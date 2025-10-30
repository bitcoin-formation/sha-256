/**
 * Mapping centralisé des numéros de ligne du pseudo-code
 * 
 * Ce fichier définit une source unique de vérité pour la correspondance
 * entre les étapes de l'algorithme SHA-256 et les lignes du pseudo-code.
 * 
 * ⚠️ IMPORTANT: Si le pseudo-code change, TOUS les numéros doivent être
 * mis à jour ici et SEULEMENT ici.
 */

export const CODE_LINE_MAPPING = {
  // Étapes principales
  STEP_0_MESSAGE_INPUT: 1,        // ALGORITHME: SHA-256 Fonction de Compression
  STEP_1_PREPARE_MESSAGE: 10,     // ├─ ÉTAPE 1: Préparer le message
  STEP_2_INITIALIZE: 16,          // ├─ ÉTAPE 2: Initialiser les variables
  STEP_3_MAIN_LOOP: 19,           // ├─ ÉTAPE 3: Boucle principale
  STEP_4_ADD_TO_HASH: 40,         // └─ ÉTAPE 4: Ajouter au hash
  STEP_5_RESULT: 41,              // RETOURNER [H[0]+a, H[1]+b, ..., H[7]+h]
  
  // Sous-étapes de la boucle principale (round)
  ROUND_SIGMA1_E: 23,             // S1 ← Σ1(e)
  ROUND_CH: 24,                   // Ch ← Ch(e, f, g)
  ROUND_TEMP1: 25,                // temp1 ← h + S1 + Ch + K[i] + W[i]
  ROUND_SIGMA0_A: 28,             // S0 ← Σ0(a)
  ROUND_MAJ: 29,                  // Maj ← Maj(a, b, c)
  ROUND_TEMP2: 30,                // temp2 ← S0 + Maj
  ROUND_ROTATION: 34,             // [a, b, c, d, e, f, g, h] ← [...]
} as const;

/**
 * Fonction de validation pour s'assurer que les numéros de ligne sont cohérents
 * Peut être appelée dans les tests
 */
export function validateCodeLineMapping(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const values = Object.values(CODE_LINE_MAPPING);
  
  // Vérifier qu'il n'y a pas de doublons
  const duplicates = values.filter((v, i) => values.indexOf(v) !== i);
  if (duplicates.length > 0) {
    errors.push(`Numéros de ligne dupliqués: ${duplicates.join(', ')}`);
  }
  
  // Vérifier que les numéros sont dans un ordre logique
  if (CODE_LINE_MAPPING.STEP_0_MESSAGE_INPUT >= CODE_LINE_MAPPING.STEP_1_PREPARE_MESSAGE) {
    errors.push('Étape 0 devrait être avant Étape 1');
  }
  if (CODE_LINE_MAPPING.STEP_1_PREPARE_MESSAGE >= CODE_LINE_MAPPING.STEP_2_INITIALIZE) {
    errors.push('Étape 1 devrait être avant Étape 2');
  }
  if (CODE_LINE_MAPPING.STEP_2_INITIALIZE >= CODE_LINE_MAPPING.STEP_3_MAIN_LOOP) {
    errors.push('Étape 2 devrait être avant Étape 3');
  }
  
  // Vérifier que les sous-étapes du round sont dans la bonne séquence
  const roundSteps = [
    CODE_LINE_MAPPING.ROUND_SIGMA1_E,
    CODE_LINE_MAPPING.ROUND_CH,
    CODE_LINE_MAPPING.ROUND_TEMP1,
    CODE_LINE_MAPPING.ROUND_SIGMA0_A,
    CODE_LINE_MAPPING.ROUND_MAJ,
    CODE_LINE_MAPPING.ROUND_TEMP2,
    CODE_LINE_MAPPING.ROUND_ROTATION,
  ];
  
  for (let i = 1; i < roundSteps.length; i++) {
    if (roundSteps[i] <= roundSteps[i - 1]) {
      errors.push(`Les sous-étapes du round ne sont pas dans l'ordre séquentiel`);
      break;
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

