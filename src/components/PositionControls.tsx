import React from 'react';
import type { PositionSystem, Position } from '../utils/positions';
import './PositionControls.css';

interface PositionControlsProps {
  positionSystem: PositionSystem;
  onPositionSystemChange: (system: PositionSystem) => void;
  positions: Position[];
  positionIndex: number;
  onPositionIndexChange: (index: number) => void;
  hasSelection: boolean;
  is3npsEligible: boolean;
  isFlatEligible: boolean;
}

const SYSTEM_OPTIONS: [PositionSystem, string][] = [
  ['none', 'All'],
  ['3nps', '3NPS'],
  ['flat', 'Flat'],
  ['caged', 'CAGED'],
  ['modes', 'Positions'],
];

export const PositionControls: React.FC<PositionControlsProps> = ({
  positionSystem,
  onPositionSystemChange,
  positions,
  positionIndex,
  onPositionIndexChange,
  hasSelection,
  is3npsEligible,
  isFlatEligible,
}) => {
  const handlePrev = () => {
    if (positions.length === 0) return;
    onPositionIndexChange(
      (positionIndex - 1 + positions.length) % positions.length
    );
  };

  const handleNext = () => {
    if (positions.length === 0) return;
    onPositionIndexChange((positionIndex + 1) % positions.length);
  };

  const handleSystemChange = (system: PositionSystem) => {
    onPositionSystemChange(system);
    onPositionIndexChange(0);
  };

  if (!hasSelection) return null;

  return (
    <div className="position-toolbar">
      {/* Position System Buttons */}
      <div className="system-buttons">
        {SYSTEM_OPTIONS
          .filter(([system]) => {
            if (system === '3nps') return is3npsEligible;
            if (system === 'flat') return isFlatEligible;
            return true;
          })
          .map(([system, label]) => (
            <button
              key={system}
              className={`system-button ${positionSystem === system ? 'active' : ''}`}
              onClick={() => handleSystemChange(system)}
            >
              {label}
            </button>
          ))}
      </div>

      {/* Position Navigator */}
      {positionSystem !== 'none' && positions.length > 0 && (
        <div className="position-navigator">
          <button className="nav-button" onClick={handlePrev} title="Previous position">
            ◀
          </button>
          <span className="position-label">
            {positions[positionIndex]?.name ?? 'N/A'}
            <span className="position-count">
              {' '}({positionIndex + 1}/{positions.length})
            </span>
          </span>
          <button className="nav-button" onClick={handleNext} title="Next position">
            ▶
          </button>
        </div>
      )}
    </div>
  );
};
