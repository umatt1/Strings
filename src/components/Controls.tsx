import React from 'react';
import type { InstrumentConfig, TuningPreset } from '../types/music';
import { 
  GUITAR_TUNINGS, 
  BASS_TUNINGS, 
  createInstrumentFromTuning 
} from '../types/music';
import './Controls.css';

interface ControlsProps {
  instrument: InstrumentConfig;
  onInstrumentChange: (instrument: InstrumentConfig) => void;
  fretMarkerMode: 'dots' | 'numbers';
  onFretMarkerModeChange: (mode: 'dots' | 'numbers') => void;
  mirrorStrings: boolean;
  onMirrorStringsChange: (mirror: boolean) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onInstrumentChange,
  fretMarkerMode,
  onFretMarkerModeChange,
  mirrorStrings,
  onMirrorStringsChange,
}) => {
  const [selectedTuning, setSelectedTuning] = React.useState<TuningPreset>(
    GUITAR_TUNINGS.find(t => t.id === 'standard')!
  );
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  const isGuitarSelected = selectedTuning.category === 'guitar';
  const availableTunings = isGuitarSelected ? GUITAR_TUNINGS : BASS_TUNINGS;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleInstrumentCategoryChange = (category: 'guitar' | 'bass') => {
    const defaultTuning = category === 'guitar' 
      ? GUITAR_TUNINGS.find(t => t.id === 'standard')!
      : BASS_TUNINGS.find(t => t.id === 'bass-standard')!;
    
    setSelectedTuning(defaultTuning);
    onInstrumentChange(createInstrumentFromTuning(defaultTuning));
  };

  const handleTuningChange = (tuningId: string) => {
    const tuning = availableTunings.find(t => t.id === tuningId);
    if (tuning) {
      setSelectedTuning(tuning);
      onInstrumentChange(createInstrumentFromTuning(tuning));
    }
  };

  const handleExportFretboard = async (format: 'png' | 'pdf') => {
    try {
      const fretboardElement = document.querySelector('.fretboard');
      if (!fretboardElement) {
        alert('Fretboard not found for export');
        return;
      }

      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      
      // Create canvas from fretboard
      const canvas = await html2canvas(fretboardElement as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
      });

      if (format === 'png') {
        // Download as PNG
        const link = document.createElement('a');
        link.download = `fretboard-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else if (format === 'pdf') {
        // Convert to PDF using jsPDF
        try {
          // Import jsPDF v3 - it exports jsPDF as a named export
          const jsPDFModule = await import('jspdf');
          // @ts-ignore - jsPDF v3 uses named export
          const jsPDF = jsPDFModule.jsPDF;
          
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
          });

          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 297; // A4 landscape width in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save(`fretboard-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (pdfError) {
          console.error('PDF generation error:', pdfError);
          alert(`Failed to generate PDF: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}`);
          return;
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  return (
    <div className={`controls ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="controls-header" onClick={toggleCollapse}>
        <h3>⚙️ Settings</h3>
        <button className="collapse-button">
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="controls-content">
          <div className="controls-horizontal-layout">
            {/* Instrument & Tuning Section */}
            <div className="control-group">
              <h4>Instrument</h4>
              <div className="button-group compact">
                <button
                  className={isGuitarSelected ? 'active' : ''}
                  onClick={() => handleInstrumentCategoryChange('guitar')}
                >
                  Guitar
                </button>
                <button
                  className={!isGuitarSelected ? 'active' : ''}
                  onClick={() => handleInstrumentCategoryChange('bass')}
                >
                  Bass
                </button>
              </div>
              <div className="tuning-selector compact">
                <label>Tuning:</label>
                <select 
                  value={selectedTuning.id} 
                  onChange={(e) => handleTuningChange(e.target.value)}
                >
                  {availableTunings.map((tuning) => (
                    <option key={tuning.id} value={tuning.id}>
                      {tuning.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Display Options Section */}
        <div className="control-group">
          <h4>Display</h4>
          <div className="display-grid">
            <div className="option-subgroup">
              <label>Markers:</label>
              <div className="button-group compact">
                <button
                  className={fretMarkerMode === 'dots' ? 'active' : ''}
                  onClick={() => onFretMarkerModeChange('dots')}
                >
                  Dots
                </button>
                <button
                  className={fretMarkerMode === 'numbers' ? 'active' : ''}
                  onClick={() => onFretMarkerModeChange('numbers')}
                >
                  Numbers
                </button>
              </div>
            </div>

            <div className="option-subgroup">
              <label>Strings:</label>
              <div className="button-group compact">
                <button
                  className={!mirrorStrings ? 'active' : ''}
                  onClick={() => onMirrorStringsChange(false)}
                >
                  Normal
                </button>
                <button
                  className={mirrorStrings ? 'active' : ''}
                  onClick={() => onMirrorStringsChange(true)}
                >
                  Mirror
                </button>
              </div>
            </div>

            <div className="option-subgroup">
              <label>Export:</label>
              <div className="button-group compact">
                <button
                  onClick={() => handleExportFretboard('png')}
                  className="export-button"
                >
                  📷 PNG
                </button>
                <button
                  onClick={() => handleExportFretboard('pdf')}
                  className="export-button"
                >
                  📄 PDF
                </button>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
      )}
    </div>
  );
};
