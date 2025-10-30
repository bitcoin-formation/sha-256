import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from './store/useAppStore';
import { Controls } from './components/Controls/Controls';
import { CodeDisplay } from './components/CodeDisplay/CodeDisplay';
import { FlowDiagram } from './components/FlowDiagram/FlowDiagram';
import { StateDisplay } from './components/StateDisplay/StateDisplay';
import { RoundIndicator } from './components/RoundIndicator/RoundIndicator';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const {
    message,
    setMessage,
    config,
    setConfig,
    computeHash
  } = useAppStore();

  useEffect(() => {
    // S'assurer que les paramètres SHA-256 natifs sont utilisés
    if (!config.useNativeParams) {
      setConfig({
        rounds: 64,
        messageSize: 512,
        useNativeParams: true
      });
    }
    // Calculer le hash initial
    computeHash();
  }, [computeHash, config.useNativeParams, setConfig]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr-CA' ? 'en' : 'fr-CA';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>{t('app.title')}</h1>
          <p className="subtitle">{t('app.subtitle')}</p>
        </div>
        
        <div className="header-controls">
          <button onClick={toggleLanguage} className="lang-btn">
            {i18n.language === 'fr-CA' ? '🇨🇦 FR' : '🇬🇧 EN'}
          </button>
        </div>
      </header>

      <div className="app-main">
        {/* Colonne gauche: Contrôles + Configuration */}
        <div className="sidebar-left">
          <div className="section">
            <RoundIndicator />
          </div>
          
          <div className="section">
            <Controls />
          </div>

          <div className="section config-section">
            <label htmlFor="message-input" className="section-title">{t('input.label')}</label>
            <input
              id="message-input"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('input.placeholder')}
              className="message-input"
              maxLength={512}
            />
            <p className="info-message success">SHA-256 Standard (64 rounds) - Max: {message.length}/512</p>
          </div>
        </div>

        {/* Colonne centrale: Schéma + Code côte à côte */}
        <div className="main-center">
          <div className="center-left">
            <FlowDiagram />
          </div>
          <div className="center-right">
            <CodeDisplay />
          </div>
        </div>

        {/* Colonne droite: État des variables */}
        <div className="sidebar-right">
          <StateDisplay />
        </div>
      </div>

      <footer className="app-footer">
        <p>
          SHA-256 Visualizer © 2025 | 
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            {' '}GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;

