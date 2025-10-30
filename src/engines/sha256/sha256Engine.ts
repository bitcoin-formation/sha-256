import { SHA256Step, SHA256State, SHA256Config } from '@/types/sha256';
import { INITIAL_HASH, K, SIMPLE_K } from './constants';
import { capsigma0, capsigma1, sigma0, sigma1, ch, maj, add, getChangedBits } from './operations';
import { CODE_LINE_MAPPING } from '@/constants/codeLineMapping';

export class SHA256Engine {
  private config: SHA256Config;
  private steps: SHA256Step[] = [];

  constructor(config: SHA256Config) {
    this.config = config;
  }

  // Prépare le message (padding)
  private padMessage(message: string): Uint8Array {
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);
    const messageBits = messageBytes.length * 8;
    
    // SHA-256 utilise toujours des blocs de 512 bits (64 bytes)
    const blockSize = 512; // en bits
    const k = blockSize - 65; // Espace pour le bit 1 et la longueur (64 bits)
    const paddingLength = ((k - messageBits) % blockSize + blockSize) % blockSize;
    
    const totalLength = messageBits + 1 + paddingLength + 64;
    const paddedMessage = new Uint8Array(totalLength / 8);
    
    // Copier le message
    paddedMessage.set(messageBytes);
    
    // Ajouter le bit 1
    paddedMessage[messageBytes.length] = 0x80;
    
    // Ajouter la longueur à la fin (64 bits, big-endian)
    const lengthView = new DataView(paddedMessage.buffer);
    lengthView.setBigUint64(paddedMessage.length - 8, BigInt(messageBits), false);
    
    return paddedMessage;
  }

  // Prépare le schedule de message (W[0..63] ou simplifié)
  private prepareMessageSchedule(block: Uint8Array): number[] {
    const rounds = this.config.useNativeParams ? 64 : this.config.rounds;
    const W: number[] = new Array(rounds);
    
    // Les 16 premiers mots viennent directement du message
    const view = new DataView(block.buffer, block.byteOffset, block.byteLength);
    const maxWords = Math.min(16, rounds, Math.floor(block.byteLength / 4));
    
    for (let i = 0; i < maxWords; i++) {
      W[i] = view.getUint32(i * 4, false); // big-endian
    }
    
    // Remplir avec des zéros si nécessaire
    for (let i = maxWords; i < 16; i++) {
      W[i] = 0;
    }
    
    // Les mots restants sont calculés (expansion silencieuse, pas de steps)
    for (let i = 16; i < rounds; i++) {
      const s0 = sigma0(W[i - 15]);
      const s1 = sigma1(W[i - 2]);
      W[i] = add(W[i - 16], s0.result, W[i - 7], s1.result);
    }
    
    return W;
  }

  private createEmptyState(): SHA256State {
    return { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0 };
  }

  private stateFromArray(arr: number[]): SHA256State {
    return {
      a: arr[0],
      b: arr[1],
      c: arr[2],
      d: arr[3],
      e: arr[4],
      f: arr[5],
      g: arr[6],
      h: arr[7]
    };
  }

  private stateToArray(state: SHA256State): number[] {
    return [state.a, state.b, state.c, state.d, state.e, state.f, state.g, state.h];
  }

  // Processus principal
  public hash(message: string): SHA256Step[] {
    this.steps = [];
    
    // ÉTAPE 0: Message d'entrée
    this.steps.push({
      round: -2,
      operation: 'init',
      stateBefore: this.createEmptyState(),
      stateAfter: this.createEmptyState(),
      gates: [],
      description: `Étape 0: Message d'entrée`,
      codeLineNumber: CODE_LINE_MAPPING.STEP_0_MESSAGE_INPUT,
      intermediateValues: {
        'Message': message,
        'Longueur': `${message.length} caractères`,
        'Bytes': message.length * 8,
        'Format': 'UTF-8'
      },
      changedBits: []
    });
    
    const paddedMessage = this.padMessage(message);
    const rounds = this.config.useNativeParams ? 64 : this.config.rounds;
    const constants = this.config.useNativeParams ? K : SIMPLE_K;
    
    // Initialisation du hash
    let H = [...INITIAL_HASH];
    
    // Traiter chaque bloc de 512 bits (64 bytes)
    const blockSize = 64; // SHA-256 utilise toujours des blocs de 64 bytes
    const numBlocks = Math.ceil(paddedMessage.length / blockSize);
    
    for (let blockIdx = 0; blockIdx < numBlocks; blockIdx++) {
      const blockStart = blockIdx * blockSize;
      const blockEnd = Math.min(blockStart + blockSize, paddedMessage.length);
      const block = paddedMessage.slice(blockStart, blockEnd);
      
      // Étendre le bloc si nécessaire
      const paddedBlock = new Uint8Array(blockSize);
      paddedBlock.set(block);
      
      // ÉTAPE 1: Préparer le message schedule
      const W = this.prepareMessageSchedule(paddedBlock);
      
      // Ajouter un step pour la préparation du message
      this.steps.push({
        round: -1,
        operation: 'prepare_schedule',
        stateBefore: this.createEmptyState(),
        stateAfter: this.createEmptyState(),
        gates: [],
        description: `Étape 1: Préparation du message W[0..${rounds-1}]`,
        codeLineNumber: CODE_LINE_MAPPING.STEP_1_PREPARE_MESSAGE,
        intermediateValues: {
          'W[0]': W[0],
          'W[1]': W[1],
          'W[2]': W[2],
          'W[15]': W[15],
          'W[16]': W[16],
          'W[63]': W[63],
          'Total mots': W.length
        },
        changedBits: []
      });
      
      // ÉTAPE 2: Initialiser les variables de travail
      let state: SHA256State = this.stateFromArray(H);
      
      this.steps.push({
        round: -1,
        operation: 'init',
        stateBefore: this.createEmptyState(),
        stateAfter: state,
        gates: [],
        description: `Étape 2: Initialisation des variables a,b,c,d,e,f,g,h`,
        codeLineNumber: CODE_LINE_MAPPING.STEP_2_INITIALIZE,
        intermediateValues: {
          'a': state.a,
          'b': state.b,
          'c': state.c,
          'd': state.d,
          'e': state.e,
          'f': state.f,
          'g': state.g,
          'h': state.h
        },
        changedBits: []
      });
      
      // Compression principale
      for (let i = 0; i < rounds; i++) {
        const stateBefore = { ...state };
        
        // Step 1: Calcul de Σ1(e)
        const S1 = capsigma1(state.e);
        this.steps.push({
          round: i,
          operation: 'capsigma1',
          stateBefore: { ...state },
          stateAfter: { ...state },
          gates: S1.gates,
          description: `Round ${i}: Calcul Σ1(e)`,
          codeLineNumber: CODE_LINE_MAPPING.ROUND_SIGMA1_E,
          intermediateValues: {
            'e': state.e,
            'Σ1(e)': S1.result
          },
          changedBits: []
        });
        
        // Step 2: Calcul de Ch(e,f,g)
        const chResult = ch(state.e, state.f, state.g);
        this.steps.push({
          round: i,
          operation: 'ch',
          stateBefore: { ...state },
          stateAfter: { ...state },
          gates: chResult.gates,
          description: `Round ${i}: Calcul Ch(e,f,g)`,
          codeLineNumber: CODE_LINE_MAPPING.ROUND_CH,
          intermediateValues: {
            'e': state.e,
            'f': state.f,
            'g': state.g,
            'Ch(e,f,g)': chResult.result
          },
          changedBits: []
        });
        
        // Step 3: Calcul de temp1
        const temp1 = add(state.h, S1.result, chResult.result, constants[i], W[i]);
        this.steps.push({
          round: i,
          operation: 'ch',
          stateBefore: { ...state },
          stateAfter: { ...state },
          gates: [],
          description: `Round ${i}: Calcul temp1`,
          codeLineNumber: CODE_LINE_MAPPING.ROUND_TEMP1,
          intermediateValues: {
            'h': state.h,
            'Σ1(e)': S1.result,
            'Ch(e,f,g)': chResult.result,
            'K[i]': constants[i],
            'W[i]': W[i],
            'temp1': temp1
          },
          changedBits: []
        });
        
        // Step 4: Calcul de Σ0(a)
        const S0 = capsigma0(state.a);
        this.steps.push({
          round: i,
          operation: 'capsigma0',
          stateBefore: { ...state },
          stateAfter: { ...state },
          gates: S0.gates,
          description: `Round ${i}: Calcul Σ0(a)`,
          codeLineNumber: CODE_LINE_MAPPING.ROUND_SIGMA0_A,
          intermediateValues: {
            'a': state.a,
            'Σ0(a)': S0.result
          },
          changedBits: []
        });
        
        // Step 5: Calcul de Maj(a,b,c)
        const majResult = maj(state.a, state.b, state.c);
        this.steps.push({
          round: i,
          operation: 'maj',
          stateBefore: { ...state },
          stateAfter: { ...state },
          gates: majResult.gates,
          description: `Round ${i}: Calcul Maj(a,b,c)`,
          codeLineNumber: CODE_LINE_MAPPING.ROUND_MAJ,
          intermediateValues: {
            'a': state.a,
            'b': state.b,
            'c': state.c,
            'Maj(a,b,c)': majResult.result
          },
          changedBits: []
        });
        
        // Step 6: Calcul de temp2
        const temp2 = add(S0.result, majResult.result);
        this.steps.push({
          round: i,
          operation: 'maj',
          stateBefore: { ...state },
          stateAfter: { ...state },
          gates: [],
          description: `Round ${i}: Calcul temp2`,
          codeLineNumber: CODE_LINE_MAPPING.ROUND_TEMP2,
          intermediateValues: {
            'Σ0(a)': S0.result,
            'Maj(a,b,c)': majResult.result,
            'temp2': temp2
          },
          changedBits: []
        });
        
        // Step 7: Mise à jour de l'état (rotation des registres)
        state = {
          a: add(temp1, temp2),
          b: state.a,
          c: state.b,
          d: state.c,
          e: add(state.d, temp1),
          f: state.e,
          g: state.f,
          h: state.g
        };
        
        // Calculer les bits changés
        const changedBits = this.getStateChangedBits(stateBefore, state);
        
        this.steps.push({
          round: i,
          operation: 'ch',
          stateBefore,
          stateAfter: state,
          gates: [],
          description: `Round ${i}: Mise à jour état`,
          codeLineNumber: CODE_LINE_MAPPING.ROUND_ROTATION,
          intermediateValues: {
            'temp1': temp1,
            'temp2': temp2,
            'nouveau a': state.a,
            'nouveau e': state.e
          },
          changedBits
        });
      }
      
      // ÉTAPE 4: Ajouter le résultat compressé au hash
      const stateArray = this.stateToArray(state);
      const oldH = [...H];
      for (let i = 0; i < 8; i++) {
        H[i] = add(H[i], stateArray[i]);
      }
      
      // Ajouter un step pour l'addition finale
      this.steps.push({
        round: -1,
        operation: 'finalize',
        stateBefore: this.stateFromArray(oldH),
        stateAfter: this.stateFromArray(H),
        gates: [],
        description: `Étape 4: Ajout au hash final`,
        codeLineNumber: CODE_LINE_MAPPING.STEP_4_ADD_TO_HASH,
        intermediateValues: {
          'H[0] old': oldH[0],
          'H[0] new': H[0],
          'H[1] old': oldH[1],
          'H[1] new': H[1],
          'Somme': `H + [a,b,c,d,e,f,g,h]`
        },
        changedBits: []
      });
    }
    
    // ÉTAPE 5: Résultat final - Convertir le hash en string hexadécimal
    const hashHex = H.map(h => h.toString(16).padStart(8, '0')).join('');
    
    this.steps.push({
      round: -1,
      operation: 'finalize',
      stateBefore: this.stateFromArray(H),
      stateAfter: this.stateFromArray(H),
      gates: [],
      description: `Étape 5: Résultat SHA-256`,
      codeLineNumber: CODE_LINE_MAPPING.STEP_5_RESULT,
      intermediateValues: {
        'Hash complet': hashHex,
        'H[0]': H[0],
        'H[1]': H[1],
        'H[2]': H[2],
        'H[3]': H[3],
        'H[4]': H[4],
        'H[5]': H[5],
        'H[6]': H[6],
        'H[7]': H[7],
      },
      changedBits: []
    });
    
    return this.steps;
  }

  private getStateChangedBits(before: SHA256State, after: SHA256State): number[] {
    const changed: number[] = [];
    const keys: (keyof SHA256State)[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    
    keys.forEach((key, varIdx) => {
      const bits = getChangedBits(before[key], after[key]);
      bits.forEach(bit => {
        changed.push(varIdx * 32 + bit);
      });
    });
    
    return changed;
  }

  public getSteps(): SHA256Step[] {
    return this.steps;
  }
}

