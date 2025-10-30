import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { useEffect, useRef } from 'react';
import './CodeDisplay.css';

const PSEUDOCODE = `ALGORITHME: SHA-256 Fonction de Compression
═══════════════════════════════════════════

CONSTANTES:
  K[0..63] ← 64 constantes (racines cubiques des nombres premiers)
  H[0..7]  ← 8 valeurs initiales (racines carrées des nombres premiers)

FONCTION compression(bloc_message, hash_précédent):
  │
  ├─ ÉTAPE 1: Préparer le message (Message Schedule)
  │    ├─ W[0..15] ← découper bloc en 16 mots de 32 bits
  │    └─ EXPANSION: générer W[16..63] avec σ0 et σ1
  │         POUR i DE 16 À 63 FAIRE:
  │           W[i] ← σ1(W[i-2]) + W[i-7] + σ0(W[i-15]) + W[i-16]
  │
  ├─ ÉTAPE 2: Initialiser les variables de travail
  │    a, b, c, d, e, f, g, h ← hash_précédent
  │
  ├─ ÉTAPE 3: Boucle principale (64 rounds)
  │    POUR i DE 1 À 64 FAIRE:
  │      │
  │      ├─ Calculs sur la partie droite (e, f, g):
  │      │    S1 ← Σ1(e)                    [rotation + XOR]
  │      │    Ch ← Ch(e, f, g)              [fonction de choix]
  │      │    temp1 ← h + S1 + Ch + K[i] + W[i]
  │      │
  │      ├─ Calculs sur la partie gauche (a, b, c):
  │      │    S0 ← Σ0(a)                    [rotation + XOR]
  │      │    Maj ← Maj(a, b, c)            [fonction majorité]
  │      │    temp2 ← S0 + Maj
  │      │
  │      └─ Rotation des registres (EN PARALLÈLE):
  │           
  │           [a, b, c, d, e, f, g, h] ← [temp1+temp2, a, b, c, d+temp1, e, f, g]
  │           
  │           Note: C'est une rotation simultanée, comme un
  │           décalage circulaire de tous les registres en même temps
  │    FIN POUR
  │
  └─ ÉTAPE 4: Ajouter au hash
       RETOURNER [H[0]+a, H[1]+b, ..., H[7]+h]

═══════════════════════════════════════════
Fonctions auxiliaires:
• Σ0(x), Σ1(x) : rotations circulaires + XOR (majuscules)
• σ0(x), σ1(x) : rotations circulaires + XOR (minuscules)
• Ch(x,y,z)    : si x alors y sinon z
• Maj(x,y,z)   : majorité de 3 bits`;

export const CodeDisplay = () => {
  const { t } = useTranslation();
  const { getCurrentStep } = useAppStore();
  const codeRef = useRef<HTMLDivElement>(null);
  
  const currentStep = getCurrentStep();
  const currentLine = currentStep?.codeLineNumber || 0;
  
  const lines = PSEUDOCODE.split('\n');

  useEffect(() => {
    if (codeRef.current && currentLine > 0) {
      const lineElement = codeRef.current.querySelector(`[data-line="${currentLine}"]`) as HTMLElement;
      if (lineElement) {
        // Scroll uniquement dans le conteneur du code, pas toute la page
        const container = codeRef.current;
        const containerRect = container.getBoundingClientRect();
        const lineRect = lineElement.getBoundingClientRect();
        
        // Calculer si l'élément est visible dans le conteneur
        const isVisible = (
          lineRect.top >= containerRect.top &&
          lineRect.bottom <= containerRect.bottom
        );
        
        // Scroll seulement si l'élément n'est pas visible
        if (!isVisible) {
          const scrollTop = lineElement.offsetTop - container.offsetTop - (container.clientHeight / 2) + (lineElement.clientHeight / 2);
          container.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }
      }
    }
  }, [currentLine]);

  return (
    <div className="code-display">
      <div className="code-header">
        <h3>{t('code.title')}</h3>
        {currentLine > 0 && (
          <span className="current-line-indicator">
            {t('code.currentLine')}: {currentLine}
          </span>
        )}
      </div>
      
      <div className="code-content" ref={codeRef}>
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = lineNumber === currentLine;
          const isNearActive = Math.abs(lineNumber - currentLine) <= 2;
          
          return (
            <div
              key={lineNumber}
              data-line={lineNumber}
              className={`code-line ${isActive ? 'active' : ''} ${isNearActive ? 'near-active' : ''}`}
            >
              <span className="line-number">{lineNumber}</span>
              <span className="line-content">{line || ' '}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

