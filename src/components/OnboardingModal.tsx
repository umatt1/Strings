import React, { useEffect } from 'react';
import './OnboardingModal.css';

interface OnboardingModalProps {
  onDismiss: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onDismiss }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onDismiss]);

  return (
    <div className="onboarding-backdrop" onClick={onDismiss}>
      <div className="onboarding-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Welcome">
        <h2 className="onboarding-title">Welcome to Strings</h2>
        <p className="onboarding-subtitle">An interactive fretboard for chord and scale practice.</p>

        <div className="onboarding-steps">
          <div className="onboarding-step">
            <span className="onboarding-step-icon">①</span>
            <div>
              <strong>Pick a chord or scale</strong>
              <p>Use the panel on the left to select a key, then click any chord or scale to highlight it on the fretboard.</p>
            </div>
          </div>

          <div className="onboarding-step">
            <span className="onboarding-step-icon">②</span>
            <div>
              <strong>Build a practice queue</strong>
              <p>Click <strong>+ Queue</strong> to add the current chord or scale to your queue. Chain up as many as you like.</p>
            </div>
          </div>

          <div className="onboarding-step">
            <span className="onboarding-step-icon">③</span>
            <div>
              <strong>Practice with the spacebar</strong>
              <p>Press <kbd>Space</kbd> to advance to the next item in the queue. Use the ◀ ▶ buttons or spacebar to cycle through.</p>
            </div>
          </div>

          <div className="onboarding-step">
            <span className="onboarding-step-icon">④</span>
            <div>
              <strong>Explore positions</strong>
              <p>With a chord or scale selected, use the <strong>CAGED</strong>, <strong>3NPS</strong>, or <strong>Positions</strong> buttons above the fretboard to focus on one neck position at a time.</p>
            </div>
          </div>
        </div>

        <div className="onboarding-tip">
          <strong>Tip:</strong> Click any note on the fretboard to hear it. Select two notes to see the interval between them.
        </div>

        <button className="onboarding-dismiss" onClick={onDismiss} autoFocus>
          Got it — let's play
        </button>
      </div>
    </div>
  );
};
