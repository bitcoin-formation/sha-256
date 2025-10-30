import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';
import './CurrentValue.css';

export const CurrentValue = () => {
  const { getCurrentStep } = useAppStore();
  const currentStep = getCurrentStep();
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);

  if (!currentStep) {
    return null;
  }

  // Fonction pour convertir une string en hex
  const stringToHex = (str: string): string => {
    return Array.from(str)
      .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(' ');
  };

  // Fonction pour convertir un nombre en hex
  const numberToHex = (num: number): string => {
    return '0x' + num.toString(16).padStart(8, '0');
  };

  // Fonction pour convertir en binaire
  const toBinary = (value: string | number): string => {
    if (typeof value === 'string') {
      // Convertir chaque caractère en binaire
      return Array.from(value)
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ');
    } else {
      // Convertir le nombre en binaire (32 bits)
      return (value >>> 0).toString(2).padStart(32, '0');
    }
  };

  const renderValue = (key: string, value: string | number) => {
    const isNumber = typeof value === 'number';
    const displayValue = isNumber ? numberToHex(value) : stringToHex(value.toString());
    const binaryValue = toBinary(value);

    return (
      <div 
        key={key}
        className="value-item"
        onMouseEnter={() => setHoveredValue(key)}
        onMouseLeave={() => setHoveredValue(null)}
      >
        <div className="value-label">{key}:</div>
        <div className="value-content">
          <div className="value-hex">{displayValue}</div>
          {hoveredValue === key && (
            <div className="value-tooltip">
              <div className="tooltip-title">Binaire (bits):</div>
              <div className="tooltip-binary">{binaryValue}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const { intermediateValues } = currentStep;

  return (
    <div className="current-value">
      <div className="current-value-header">
        <h3>💡 Valeurs actuelles</h3>
        <span className="hint">Survolez pour voir en binaire</span>
      </div>
      
      <div className="current-value-content">
        {Object.entries(intermediateValues).map(([key, value]) => {
          // Ignorer les valeurs qui sont des strings non-convertibles
          if (typeof value === 'string' && value.includes('←')) {
            return (
              <div key={key} className="value-item text-only">
                <div className="value-label">{key}:</div>
                <div className="value-text">{value}</div>
              </div>
            );
          }
          
          return renderValue(key, value);
        })}
      </div>
    </div>
  );
};

