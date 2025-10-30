import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { Gate } from '@/types/sha256';
import './CircuitView.css';

export const ASICCircuit = () => {
  const { t } = useTranslation();
  const { getCurrentStep } = useAppStore();
  
  const currentStep = getCurrentStep();
  
  if (!currentStep || currentStep.gates.length === 0) {
    return (
      <div className="circuit-placeholder">
        <p>{t('circuit.asic')}</p>
        <p className="placeholder-hint">Les portes logiques apparaîtront ici pendant l'exécution</p>
      </div>
    );
  }
  
  const { gates, operation } = currentStep;
  
  const getGateSymbol = (type: Gate['type']): string => {
    switch (type) {
      case 'AND': return '∧';
      case 'OR': return '∨';
      case 'XOR': return '⊕';
      case 'NOT': return '¬';
      case 'ROTR': return '↻';
      case 'SHR': return '≫';
      case 'ADD': return '+';
      default: return '?';
    }
  };
  
  const getGateColor = (type: Gate['type']): string => {
    switch (type) {
      case 'XOR': return '#667eea';
      case 'AND': return '#f093fb';
      case 'OR': return '#4facfe';
      case 'NOT': return '#fa709a';
      case 'ROTR': return '#30cfd0';
      case 'SHR': return '#a8edea';
      case 'ADD': return '#ffa751';
      default: return '#999';
    }
  };
  
  const formatValue = (value: number): string => {
    return '0x' + value.toString(16).padStart(8, '0').toUpperCase();
  };
  
  // Calculer les positions pour un layout en grille
  const layoutGates = (gates: Gate[]) => {
    return gates.map((gate, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      return {
        ...gate,
        position: {
          x: 100 + col * 200,
          y: 80 + row * 120
        }
      };
    });
  };
  
  const layoutedGates = layoutGates(gates);
  
  return (
    <div className="circuit-view">
      <div className="circuit-header">
        <h3>{t('circuit.asic')}</h3>
        <span className="operation-badge">{t(`operations.${operation}`)}</span>
      </div>
      
      <div className="circuit-content">
        <svg className="circuit-svg" viewBox="0 0 700 600">
          {/* Grille de fond */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(100,100,150,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Connexions entre les portes */}
          {layoutedGates.map((gate, index) => {
            if (index === 0) return null;
            const prevGate = layoutedGates[index - 1];
            return (
              <motion.line
                key={`connection-${index}`}
                x1={prevGate.position.x + 60}
                y1={prevGate.position.y + 30}
                x2={gate.position.x}
                y2={gate.position.y + 30}
                stroke="rgba(102, 126, 234, 0.3)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            );
          })}
          
          {/* Portes logiques */}
          {layoutedGates.map((gate, index) => (
            <motion.g
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              {/* Rectangle de la porte */}
              <rect
                x={gate.position.x}
                y={gate.position.y}
                width="60"
                height="60"
                rx="8"
                fill={getGateColor(gate.type)}
                fillOpacity="0.2"
                stroke={getGateColor(gate.type)}
                strokeWidth="2"
              />
              
              {/* Symbole de la porte */}
              <text
                x={gate.position.x + 30}
                y={gate.position.y + 40}
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                fill={getGateColor(gate.type)}
              >
                {getGateSymbol(gate.type)}
              </text>
              
              {/* Type de porte */}
              <text
                x={gate.position.x + 30}
                y={gate.position.y - 8}
                textAnchor="middle"
                fontSize="12"
                fill="#b0b0d0"
              >
                {gate.type}
              </text>
              
              {/* Valeur d'entrée (première input) */}
              {gate.inputs.length > 0 && (
                <text
                  x={gate.position.x + 30}
                  y={gate.position.y + 78}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#888899"
                  fontFamily="monospace"
                >
                  in: {formatValue(gate.inputs[0])}
                </text>
              )}
              
              {/* Valeur de sortie */}
              <text
                x={gate.position.x + 30}
                y={gate.position.y + 90}
                textAnchor="middle"
                fontSize="9"
                fill="#d0d0e0"
                fontFamily="monospace"
              >
                out: {formatValue(gate.output)}
              </text>
            </motion.g>
          ))}
        </svg>
        
        <div className="circuit-legend">
          <h4>Légende des portes</h4>
          <div className="legend-list">
            {['XOR', 'AND', 'OR', 'NOT', 'ROTR', 'SHR'].map((type) => (
              <div key={type} className="legend-item">
                <span 
                  className="legend-symbol" 
                  style={{ color: getGateColor(type as Gate['type']) }}
                >
                  {getGateSymbol(type as Gate['type'])}
                </span>
                <span className="legend-label">{t(`circuit.gates.${type.toLowerCase()}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

