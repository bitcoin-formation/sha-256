import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import './StateDisplay.css';

export const StateDisplay = () => {
  const { t } = useTranslation();
  const { getCurrentStep, getCurrentRound } = useAppStore();
  
  const currentStep = getCurrentStep();
  
  if (!currentStep) {
    return (
      <div className="state-display">
        <div className="state-placeholder">
          {t('state.input')}...
        </div>
      </div>
    );
  }
  
  const { stateBefore, stateAfter, operation, intermediateValues, description } = currentStep;
  
  // Déterminer si on est dans la boucle (étape 3)
  const isInLoop = !description.includes('Étape 0') && 
                   !description.includes('Étape 1') && 
                   !description.includes('Étape 2') && 
                   !description.includes('Étape 4');
  const currentRound = isInLoop ? currentStep.round + 1 : null;
  
  const formatHex = (value: number): string => {
    return '0x' + value.toString(16).padStart(8, '0').toUpperCase();
  };
  
  const formatBinary = (value: number): string => {
    return value.toString(2).padStart(32, '0');
  };
  
  const variables = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
  
  // Compter combien de variables ont changé
  const changedCount = variables.filter(v => stateBefore[v] !== stateAfter[v]).length;
  const isRotation = changedCount >= 6; // Si 6+ registres changent, c'est une rotation
  
  return (
    <div className="state-display">
      <div className="state-header">
        {currentRound !== null && (
          <div className="round-info">
            <span className="round-label">{t('state.round')}:</span>
            <span className="round-value">{currentRound}</span>
          </div>
        )}
        <div className="operation-info">
          <span className="operation-label">{t('state.operation')}:</span>
          <span className="operation-value">{t(`operations.${operation}`)}</span>
        </div>
        {isRotation && (
          <div className="rotation-badge">🔄 ROTATION PARALLÈLE</div>
        )}
      </div>
      
      <div className="state-variables">
        <h4>{t('state.variables')}</h4>
        
        <div className="variables-grid">
          {variables.map((varName) => {
            const beforeValue = stateBefore[varName];
            const afterValue = stateAfter[varName];
            const changed = beforeValue !== afterValue;
            
            return (
              <motion.div
                key={varName}
                className={`variable-item ${changed ? 'changed' : ''} ${isRotation && changed ? 'rotation' : ''}`}
                animate={changed ? { scale: [1, 1.05, 1] } : {}}
                transition={{ 
                  duration: 0.5,
                  delay: isRotation ? 0 : 0 // Pas de délai pour la rotation, tout en même temps
                }}
              >
                <div className="variable-header">
                  <span className="variable-name">{varName.toUpperCase()}</span>
                  {changed && <span className="change-indicator">●</span>}
                </div>
                
                <div className="variable-values">
                  <div className="value-row">
                    <span className="value-label">{t('state.input')}:</span>
                    <span className="value-hex">{formatHex(beforeValue)}</span>
                  </div>
                  
                  {changed && (
                    <div className="value-row output">
                      <span className="value-label">{t('state.output')}:</span>
                      <span className="value-hex highlight">{formatHex(afterValue)}</span>
                    </div>
                  )}
                </div>
                
                {changed && (
                  <div className="value-binary">
                    <div className="binary-before">{formatBinary(beforeValue)}</div>
                    <div className="binary-after">{formatBinary(afterValue)}</div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {Object.keys(intermediateValues).length > 0 && (
        <div className="intermediate-values">
          <h4>Valeurs intermédiaires</h4>
          <div className="intermediate-grid">
            {Object.entries(intermediateValues).map(([key, value]) => (
              <div key={key} className="intermediate-item">
                <span className="intermediate-key">{key}:</span>
                <span className="intermediate-value">{formatHex(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

