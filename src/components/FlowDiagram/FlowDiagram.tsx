import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';
import './FlowDiagram.css';

export const FlowDiagram = () => {
  const { t } = useTranslation();
  const { getCurrentStep, message, getSteps } = useAppStore();
  const [showMessageTooltip, setShowMessageTooltip] = useState(false);
  const [showWTooltip, setShowWTooltip] = useState(false);
  const [showResultTooltip, setShowResultTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // Position client de la souris
  
  const currentStep = getCurrentStep();
  
  if (!currentStep) {
    return (
      <div className="flow-placeholder">
        <p>Le diagramme de flux apparaîtra ici pendant l'exécution</p>
      </div>
    );
  }
  
  const { intermediateValues, description } = currentStep;
  
  // Récupérer les valeurs W[] FIXES de l'étape 1 (préparation)
  const allSteps = getSteps();
  const prepareStep = allSteps.find(step => step.description.includes('Étape 1: Préparation'));
  const fixedWValues = prepareStep?.intermediateValues || {};
  
  // Déterminer quelle étape principale est active
  const getActiveMainStep = () => {
    if (description.includes('Étape 0: Message')) return 0;
    if (description.includes('Étape 1: Préparation')) return 1;
    if (description.includes('Étape 2: Initialisation')) return 2;
    if (description.includes('Étape 4: Ajout au hash')) return 4;
    if (description.includes('Étape 5: Résultat')) return 5;
    // Sinon on est dans la boucle
    return 3;
  };
  
  // Déterminer quelle sous-étape du round est active
  const getActiveSubStep = () => {
    if (description.includes('Calcul Σ1(e)')) return 1;
    if (description.includes('Calcul Ch(e,f,g)')) return 2;
    if (description.includes('Calcul temp1')) return 3;
    if (description.includes('Calcul Σ0(a)')) return 4;
    if (description.includes('Calcul Maj(a,b,c)')) return 5;
    if (description.includes('Calcul temp2')) return 6;
    if (description.includes('Mise à jour état')) return 7;
    return 0;
  };
  
  const activeMainStep = getActiveMainStep();
  const activeSubStep = getActiveSubStep();
  const isInLoop = activeMainStep === 3;
  
  // ============================================================
  // STANDARD TOOLTIP STYLES - À UTILISER PARTOUT
  // ============================================================
  const TOOLTIP_STYLES = {
    container: {
      position: 'fixed' as const,
      backgroundColor: 'rgba(20, 20, 40, 0.98)',
      border: '2px solid rgba(139, 92, 246, 0.6)',
      borderRadius: '12px',
      padding: '16px 20px',
      color: 'white',
      fontSize: '13px',
      fontFamily: 'Arial, sans-serif',
      zIndex: 10000,
      minWidth: '320px',
      maxWidth: '450px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      pointerEvents: 'none' as const,
    },
    title: {
      marginBottom: '12px',
      fontWeight: 'bold' as const,
      color: '#9b59b6',
      fontSize: '16px',
    },
    itemTitle: {
      color: '#9b59b6',
      fontSize: '14px',
      marginBottom: '6px',
      fontWeight: 'bold' as const,
    },
    label: {
      color: '#b0b0d0',
      fontSize: '13px',
    },
    valueHex: {
      color: '#f093fb',
      fontFamily: 'monospace',
      fontSize: '13px',
    },
    valueDecimal: {
      color: '#4facfe',
      fontFamily: 'monospace',
      fontSize: '13px',
    },
    valueBinary: {
      color: '#26de81',
      fontFamily: 'monospace',
      fontSize: '12px',
      wordBreak: 'break-all' as const,
    },
  };
  
  // ============================================================
  // FORMAT CONVERSION HELPERS
  // ============================================================
  // Pour les strings
  const stringToHex = (str: string): string => {
    return Array.from(str)
      .map(char => char.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase())
      .join('');
  };
  
  const stringToHexWith0x = (str: string): string => {
    return '0x' + Array.from(str)
      .map(char => char.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase())
      .join('');
  };
  
  const stringToDecimal = (str: string): string => {
    return Array.from(str).map(char => char.charCodeAt(0)).join(', ');
  };
  
  const stringToBinary = (str: string): string => {
    return Array.from(str)
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
  };
  
  // Pour les numbers
  const numberToHex = (num: number): string => {
    return (num >>> 0).toString(16).padStart(8, '0').toUpperCase();
  };
  
  const numberToHexWith0x = (num: number): string => {
    return '0x' + numberToHex(num);
  };
  
  const numberToDecimal = (num: number): string => {
    return (num >>> 0).toString();
  };
  
  const numberToBinary = (num: number): string => {
    return (num >>> 0).toString(2).padStart(32, '0');
  };
  
  // ============================================================
  // STANDARD VALUE DISPLAY - À UTILISER PARTOUT
  // ============================================================
  const renderValueDisplay = (hexValue: string, decimalValue: string, binaryValue: string) => (
    <>
      <div style={{ marginBottom: '4px' }}>
        <span style={TOOLTIP_STYLES.label}>Hex: </span>
        <span style={TOOLTIP_STYLES.valueHex}>{hexValue}</span>
      </div>
      <div style={{ marginBottom: '4px' }}>
        <span style={TOOLTIP_STYLES.label}>Decimal: </span>
        <span style={TOOLTIP_STYLES.valueDecimal}>{decimalValue}</span>
      </div>
      <div>
        <span style={TOOLTIP_STYLES.label}>Binary: </span>
        <span style={TOOLTIP_STYLES.valueBinary}>{binaryValue}</span>
      </div>
    </>
  );
  
  // Obtenir les valeurs W[] FIXES de l'étape 1 avec indication de la source
  const getWValuesJSX = () => {
    if (!fixedWValues) return null;
    
    // Chercher W[0], W[1], etc. dans les valeurs FIXES de l'étape 1
    const wEntries = Object.entries(fixedWValues)
      .filter(([key]) => key.startsWith('W['))
      .sort((a, b) => {
        const numA = parseInt(a[0].match(/\d+/)?.[0] || '0');
        const numB = parseInt(b[0].match(/\d+/)?.[0] || '0');
        return numA - numB;
      });
    
    if (wEntries.length === 0) return null;
    
    // Afficher les 3 premiers avec couleur selon la source
    const firstThree = wEntries.slice(0, 3);
    
    return (
      <>
        {firstThree.map(([key, value], idx) => {
          if (typeof value !== 'number') return null;
          const wIndex = parseInt(key.match(/\d+/)?.[0] || '0');
          const isOriginal = wIndex < 16;
          const color = isOriginal ? '#4facfe' : '#f093fb'; // Bleu pour original, rose pour expansion
          
          return (
            <tspan key={key} fill={color}>
              {numberToHex(value)}
              {idx < firstThree.length - 1 ? ' ' : ''}
            </tspan>
          );
        })}
        {wEntries.length > 3 && <tspan fill="#f093fb">...</tspan>}
      </>
    );
  };
  
  const loopSteps = [
    { id: 1, label: 'Σ1(e)', color: '#667eea' },
    { id: 2, label: 'Ch(e,f,g)', color: '#f093fb' },
    { id: 3, label: 'temp1', color: '#4facfe' },
    { id: 4, label: 'Σ0(a)', color: '#30cfd0' },
    { id: 5, label: 'Maj(a,b,c)', color: '#a8edea' },
    { id: 6, label: 'temp2', color: '#ffa751' },
    { id: 7, label: 'Rotation', color: '#26de81' }
  ];
  
  return (
    <div className="flow-diagram">
      <div className="flow-header">
        <h3>
          {t('flow.title', 'Schéma de flux SHA-256')}
          {isInLoop && ` - Round ${currentStep.round + 1}`}
        </h3>
        <span className="operation-badge">{description}</span>
      </div>
      
      <div className="flow-content">
        <svg className="flow-svg" viewBox="0 0 600 1100" preserveAspectRatio="xMidYMin meet">
          {/* Définir les flèches */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="rgba(100,100,150,0.5)" />
            </marker>
            <marker id="arrowhead-loop" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#26de81" />
            </marker>
          </defs>
          
          {/* ÉTAPES PRINCIPALES */}
          {/* Étape 0: Message d'entrée */}
          <g 
            onMouseEnter={() => setShowMessageTooltip(true)}
            onMouseLeave={() => setShowMessageTooltip(false)}
            onMouseMove={(e) => {
              setMousePos({ x: e.clientX, y: e.clientY });
            }}
            style={{ cursor: 'pointer' }}
          >
            <rect x="50" y="30" width="500" height="75" rx="10" 
                  fill={activeMainStep === 0 ? 'rgba(52, 152, 219, 0.4)' : 'rgba(52, 152, 219, 0.2)'} 
                  stroke="#3498db" 
                  strokeWidth={activeMainStep === 0 ? 3 : 2}/>
            <text x="300" y="50" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#3498db">
              0. Message d'entrée
            </text>
            <text x="300" y="70" textAnchor="middle" fontSize="13" fill="#b0b0d0" fontFamily="monospace">
              {message ? `"${message.length > 20 ? message.substring(0, 20) + '...' : message}"` : '""'}
            </text>
            <text x="300" y="95" textAnchor="middle" fontSize="11" fill="#4facfe" fontFamily="monospace">
              HEX: {message ? stringToHex(message).substring(0, 30) + (stringToHex(message).length > 30 ? '...' : '') : '--'}
            </text>
          </g>
          <line x1="300" y1="105" x2="300" y2="130" stroke="#3498db" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          
          {/* Étape 1: Préparer message */}
          <g
            onMouseEnter={() => activeMainStep >= 1 && setShowWTooltip(true)}
            onMouseLeave={() => setShowWTooltip(false)}
            onMouseMove={(e) => {
              if (activeMainStep >= 1) {
                setMousePos({ x: e.clientX, y: e.clientY });
              }
            }}
            style={{ cursor: activeMainStep >= 1 ? 'pointer' : 'default' }}
          >
            <rect x="50" y="130" width="500" height="75" rx="10" 
                  fill={activeMainStep === 1 ? 'rgba(155, 89, 182, 0.4)' : 'rgba(155, 89, 182, 0.2)'} 
                  stroke="#9b59b6" 
                  strokeWidth={activeMainStep === 1 ? 3 : 2}/>
            <text x="300" y="155" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#9b59b6">
              1. Préparer le message
            </text>
            <text x="300" y="175" textAnchor="middle" fontSize="12" fill="#b0b0d0">
              W[0..63] (expansion de 16→64)
            </text>
            {activeMainStep >= 1 && getWValuesJSX() && (
              <text x="300" y="195" textAnchor="middle" fontSize="11" fontFamily="monospace">
                <tspan fill="#b0b0d0">HEX: </tspan>
                {getWValuesJSX()}
              </text>
            )}
          </g>
          <line x1="300" y1="205" x2="300" y2="225" stroke="#9b59b6" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          
          {/* Étape 2: Initialiser */}
          <rect x="50" y="225" width="500" height="60" rx="10"
                fill={activeMainStep === 2 ? 'rgba(52, 152, 219, 0.4)' : 'rgba(52, 152, 219, 0.2)'} 
                stroke="#3498db" 
                strokeWidth={activeMainStep === 2 ? 3 : 2}/>
          <text x="300" y="250" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#3498db">
            2. Initialiser les variables
          </text>
          <text x="300" y="270" textAnchor="middle" fontSize="12" fill="#b0b0d0">
            a, b, c, d, e, f, g, h ← H
          </text>
          <line x1="300" y1="285" x2="300" y2="305" stroke="#3498db" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          
          {/* Étape 3: Boucle (BOX LARGE) */}
          <rect x="50" y="305" width="500" height="540" rx="10"
                fill={isInLoop ? 'rgba(231, 76, 60, 0.15)' : 'rgba(231, 76, 60, 0.05)'} 
                stroke="#e74c3c" strokeWidth={isInLoop ? 3 : 2}/>
          <text x="300" y="330" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#e74c3c">
            3. BOUCLE PRINCIPALE (64 rounds)
          </text>
          
          {/* 7 sous-étapes de la boucle */}
          {loopSteps.map((step, index) => {
            const y = 355 + index * 65;
            const isActive = activeSubStep === step.id;
            return (
              <g key={step.id}>
                {/* Flèche entre sous-étapes */}
                {index > 0 && (
                  <line x1="300" y1={y - 10} x2="300" y2={y} 
                        stroke="rgba(100,100,150,0.3)" strokeWidth="1.5"/>
                )}
                
                {/* Rectangle sous-étape */}
                <rect x="80" y={y} width="440" height="50" rx="8"
                      fill={isActive ? step.color : 'rgba(40, 40, 60, 0.8)'}
                      fillOpacity={isActive ? 0.3 : 0.6}
                      stroke={isActive ? step.color : 'rgba(100, 100, 150, 0.3)'}
                      strokeWidth={isActive ? 3 : 1}/>
                      
                {/* Numéro */}
                <circle cx="110" cy={y + 25} r="12"
                        fill={isActive ? step.color : 'rgba(60, 60, 80, 0.8)'}
                        stroke={isActive ? step.color : 'rgba(100, 100, 150, 0.5)'}
                        strokeWidth="2"/>
                <text x="110" y={y + 30} textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">
                  {step.id}
                </text>
                
                {/* Label */}
                <text x="300" y={y + 30} textAnchor="middle" fontSize="14"
                      fontWeight={isActive ? 'bold' : 'normal'}
                      fill={isActive ? step.color : '#d0d0e0'}>
                  {step.label}
                </text>
              </g>
            );
          })}
          
          {/* Flèche de boucle retour */}
          <path d="M 520 805 Q 560 565, 560 355 Q 560 335, 520 335"
                fill="none" stroke="#26de81" strokeWidth="2" strokeDasharray="5,5"
                markerEnd="url(#arrowhead-loop)"/>
          <text x="565" y="575" fontSize="11" fill="#26de81" fontWeight="600">Boucle</text>
          <text x="565" y="589" fontSize="10" fill="#26de81">(64x)</text>
          
          {/* Sortie de boucle */}
          <line x1="300" y1="845" x2="300" y2="865" stroke="#e74c3c" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          
          {/* Étape 4: Ajouter au hash */}
          <rect x="50" y="865" width="500" height="60" rx="10"
                fill={activeMainStep === 4 ? 'rgba(46, 204, 113, 0.4)' : 'rgba(46, 204, 113, 0.2)'} 
                stroke="#2ecc71" 
                strokeWidth={activeMainStep === 4 ? 3 : 2}/>
          <text x="300" y="890" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#2ecc71">
            4. Ajouter au hash
          </text>
          <text x="300" y="910" textAnchor="middle" fontSize="12" fill="#b0b0d0">
            H[i] ← H[i] + variables
          </text>
          
          <line x1="300" y1="925" x2="300" y2="950" stroke="#f39c12" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          
          {/* Étape 5: Résultat */}
          <g
            onMouseEnter={() => activeMainStep >= 5 && setShowResultTooltip(true)}
            onMouseLeave={() => setShowResultTooltip(false)}
            onMouseMove={(e) => {
              if (activeMainStep >= 5) {
                setMousePos({ x: e.clientX, y: e.clientY });
              }
            }}
            style={{ cursor: activeMainStep >= 5 ? 'pointer' : 'default' }}
          >
            <rect x="50" y="950" width="500" height="80" rx="10"
                  fill={activeMainStep === 5 ? 'rgba(243, 156, 18, 0.4)' : 'rgba(243, 156, 18, 0.2)'} 
                  stroke="#f39c12" 
                  strokeWidth={activeMainStep === 5 ? 3 : 2}/>
            <text x="300" y="975" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#f39c12">
              5. Résultat SHA-256
            </text>
            <text x="300" y="995" textAnchor="middle" fontSize="12" fill="#b0b0d0">
              Hash final (256 bits)
            </text>
            {activeMainStep >= 5 && currentStep.intermediateValues['Hash complet'] && (
              <text x="300" y="1015" textAnchor="middle" fontSize="10" fill="#f39c12" fontFamily="monospace">
                {String(currentStep.intermediateValues['Hash complet']).substring(0, 32)}...
              </text>
            )}
          </g>
        </svg>
        
        {/* Tooltip Message - FORMAT STANDARD */}
        {showMessageTooltip && message && (
          <div 
            style={{
              ...TOOLTIP_STYLES.container,
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
            }}
          >
            <div style={TOOLTIP_STYLES.title}>
              Message: "{message}"
            </div>
            
            {renderValueDisplay(
              stringToHexWith0x(message),
              stringToDecimal(message),
              stringToBinary(message)
            )}
          </div>
        )}
        
        {/* Tooltip W[] - FORMAT STANDARD - Affiche les valeurs FIXES de l'étape 1 */}
        {showWTooltip && fixedWValues && (
          <div 
            style={{
              ...TOOLTIP_STYLES.container,
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
            }}
          >
            <div style={TOOLTIP_STYLES.title}>
              Message Schedule W[] (Étape 1):
            </div>
            
            {Object.entries(fixedWValues)
              .filter(([key]) => key.startsWith('W['))
              .sort((a, b) => {
                const numA = parseInt(a[0].match(/\d+/)?.[0] || '0');
                const numB = parseInt(b[0].match(/\d+/)?.[0] || '0');
                return numA - numB;
              })
              .map(([key, value]) => {
                if (typeof value !== 'number') return null;
                
                // Extraire l'index pour savoir si c'est du message original (0-15) ou expansion (16-63)
                const wIndex = parseInt(key.match(/\d+/)?.[0] || '0');
                const isOriginalMessage = wIndex < 16;
                const titleColor = isOriginalMessage ? '#4facfe' : '#9b59b6'; // Bleu pour original, mauve pour expansion
                const label = isOriginalMessage ? `${key} (Message original)` : `${key} (Expansion)`;
                
                return (
                  <div key={key} style={{ marginBottom: '10px' }}>
                    <div style={{ 
                      color: titleColor, 
                      fontSize: '14px', 
                      marginBottom: '6px', 
                      fontWeight: 'bold' 
                    }}>
                      {label}
                    </div>
                    
                    <div style={{ marginLeft: '10px' }}>
                      {renderValueDisplay(
                        numberToHexWith0x(value),
                        numberToDecimal(value),
                        numberToBinary(value)
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        
        {/* Tooltip Résultat - FORMAT STANDARD */}
        {showResultTooltip && currentStep.intermediateValues['Hash complet'] && (
          <div 
            style={{
              ...TOOLTIP_STYLES.container,
              maxWidth: '600px',  // Plus large pour le hash complet (64 caractères hex)
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
            }}
          >
            <div style={TOOLTIP_STYLES.title}>
              Hash SHA-256 Final:
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <div style={TOOLTIP_STYLES.itemTitle}>Hash (256 bits):</div>
              
              <div style={{ marginLeft: '10px' }}>
                <div style={{ marginBottom: '4px' }}>
                  <span style={TOOLTIP_STYLES.label}>Hex: </span>
                  <span style={{ 
                    ...TOOLTIP_STYLES.valueHex, 
                    wordBreak: 'break-all',
                    display: 'block',
                    marginTop: '4px'
                  }}>
                    0x{String(currentStep.intermediateValues['Hash complet']).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{ 
              color: '#b0b0d0', 
              fontSize: '12px', 
              fontStyle: 'italic',
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              ✅ Ce hash est unique pour le message "{message}"
            </div>
          </div>
        )}
        
        {/* Panneau des valeurs intermédiaires */}
        <div className="flow-values" key={`step-${activeSubStep}-${currentStep.round}`}>
          <h4>Valeurs {isInLoop ? `(${activeSubStep}/7)` : ''}</h4>
          <div className="values-list">
            {Object.entries(intermediateValues).length > 0 ? (
              Object.entries(intermediateValues).map(([key, value]) => (
                <div key={key} className="value-item">
                  <span className="value-key">{key}:</span>
                  <span className="value-hex">
                    {typeof value === 'number' 
                      ? '0x' + value.toString(16).toUpperCase().padStart(8, '0') 
                      : String(value)}
                  </span>
                </div>
              ))
            ) : (
              <div className="value-item">
                <span className="value-key">Aucune valeur</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

