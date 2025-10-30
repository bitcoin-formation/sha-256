import { useTranslation } from 'react-i18next';
import './CircuitView.css';

// Composant préparé pour la phase 2 - Circuit optique (BIP-52)
// Pour l'instant, affiche seulement un placeholder

export const OpticCircuit = () => {
  const { t } = useTranslation();
  
  return (
    <div className="circuit-view optic-circuit">
      <div className="circuit-header">
        <h3>{t('circuit.optic')}</h3>
        <span className="coming-soon-badge">Phase 2</span>
      </div>
      
      <div className="circuit-placeholder optic-placeholder">
        <div className="placeholder-content">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="opticGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
            
            {/* Symbole de photon/onde */}
            <circle cx="60" cy="60" r="40" fill="none" stroke="url(#opticGradient)" strokeWidth="3" opacity="0.3" />
            <circle cx="60" cy="60" r="30" fill="none" stroke="url(#opticGradient)" strokeWidth="2" opacity="0.5" />
            <circle cx="60" cy="60" r="20" fill="none" stroke="url(#opticGradient)" strokeWidth="2" opacity="0.7" />
            <circle cx="60" cy="60" r="8" fill="url(#opticGradient)" opacity="0.8" />
            
            {/* Lignes de propagation */}
            <line x1="60" y1="20" x2="60" y2="0" stroke="url(#opticGradient)" strokeWidth="2" opacity="0.6" />
            <line x1="60" y1="100" x2="60" y2="120" stroke="url(#opticGradient)" strokeWidth="2" opacity="0.6" />
            <line x1="20" y1="60" x2="0" y2="60" stroke="url(#opticGradient)" strokeWidth="2" opacity="0.6" />
            <line x1="100" y1="60" x2="120" y2="60" stroke="url(#opticGradient)" strokeWidth="2" opacity="0.6" />
          </svg>
          
          <h3>Circuit Optique SHA-256</h3>
          <p>Visualisation des opérations SHA-256 avec des composants photoniques</p>
          <p className="bip-reference">Basé sur BIP-52 (Bitcoin Improvement Proposal)</p>
          
          <div className="features-preview">
            <div className="feature-item">
              <span className="feature-icon">💡</span>
              <span>Guides d'ondes optiques</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔬</span>
              <span>Modulateurs de phase</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Propagation de photons</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌈</span>
              <span>Interférences optiques</span>
            </div>
          </div>
          
          <p className="coming-soon-text">
            Cette fonctionnalité sera disponible dans une prochaine version
          </p>
        </div>
      </div>
    </div>
  );
};

