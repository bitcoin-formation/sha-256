import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import './RoundIndicator.css';

export const RoundIndicator = () => {
  const { t } = useTranslation();
  const { getCurrentStep, config, reset } = useAppStore();
  
  const currentStep = getCurrentStep();
  const totalRounds = config.rounds;
  
  if (!currentStep) {
    return (
      <div className="round-indicator">
        <div className="round-header">
          <button 
            onClick={reset}
            className="reset-btn"
            title={t('controls.reset')}
          >
            ↺
          </button>
          <div className="round-display">
            <span className="round-current">0</span>
            <span className="round-separator">/</span>
            <span className="round-total">{totalRounds}</span>
          </div>
        </div>
        <div className="round-progress-bar">
          <div className="round-progress-fill" style={{ width: '0%' }} />
        </div>
      </div>
    );
  }
  
  // Déterminer l'étape principale et la sous-étape
  const description = currentStep.description;
  let mainStep = 3; // Par défaut, on est dans la boucle
  let subStep = 0;
  let displayText = '';
  let progress = 0;
  
  if (description.includes('Étape 0: Message')) {
    mainStep = 0;
    displayText = 'Étape 0: Message d\'entrée';
    progress = 0;
  } else if (description.includes('Étape 1: Préparation')) {
    mainStep = 1;
    displayText = 'Étape 1: Préparation';
    progress = 2;
  } else if (description.includes('Étape 2: Initialisation')) {
    mainStep = 2;
    displayText = 'Étape 2: Initialisation';
    progress = 3;
  } else if (description.includes('Étape 4: Ajout au hash')) {
    mainStep = 4;
    displayText = 'Étape 4: Finalisation';
    progress = 99;
  } else if (description.includes('Étape 5: Résultat')) {
    mainStep = 5;
    displayText = 'Étape 5: Résultat';
    progress = 100;
  } else {
    // On est dans la boucle (étape 3)
    const currentRound = currentStep.round + 1; // +1 pour afficher de 1 à N
    
    // Déterminer la sous-étape
    if (description.includes('Calcul Σ1(e)')) subStep = 1;
    else if (description.includes('Calcul Ch(e,f,g)')) subStep = 2;
    else if (description.includes('Calcul temp1')) subStep = 3;
    else if (description.includes('Calcul Σ0(a)')) subStep = 4;
    else if (description.includes('Calcul Maj(a,b,c)')) subStep = 5;
    else if (description.includes('Calcul temp2')) subStep = 6;
    else if (description.includes('Mise à jour état')) subStep = 7;
    
    displayText = `Round ${currentRound}/${totalRounds}`;
    if (subStep > 0) {
      displayText += ` - Step ${subStep}/7`;
    }
    
    // Calculer le progrès : 1 message + 2 étapes avant + (rounds * 7 steps) + 2 étapes après (4 et 5)
    // Total steps = 1 + 2 + (totalRounds * 7) + 2 = 5 + totalRounds * 7
    const totalSteps = 5 + (totalRounds * 7);
    const currentStepNumber = 3 + ((currentRound - 1) * 7) + subStep;
    progress = (currentStepNumber / totalSteps) * 100;
  }
  
  return (
    <div className="round-indicator">
      <div className="round-header">
        <button 
          onClick={reset}
          className="reset-btn"
          title={t('controls.reset')}
        >
          ↺
        </button>
        <div className="round-display-text">
          {displayText}
        </div>
      </div>
      
      <div className="round-progress-bar">
        <div 
          className="round-progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {mainStep === 3 && (
        <div className="round-labels">
          <span>{t('state.round')} {t('state.input')}</span>
          <span>{t('state.round')} {t('state.output')}</span>
        </div>
      )}
    </div>
  );
};

