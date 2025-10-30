import { create } from 'zustand';
import { SHA256Step, SHA256Config, AnimationState } from '@/types/sha256';
import { SHA256Engine } from '@/engines/sha256/sha256Engine';

interface AppState {
  // Configuration
  config: SHA256Config;
  
  // Message et steps
  message: string;
  steps: SHA256Step[];
  
  // Animation
  animation: AnimationState;
  
  // Actions
  setConfig: (config: Partial<SHA256Config>) => void;
  setMessage: (message: string) => void;
  computeHash: () => void;
  
  // Contrôles d'animation
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBack: () => void;
  roundForward: () => void;
  roundBack: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  
  // Helpers
  getCurrentStep: () => SHA256Step | null;
  getCurrentRound: () => number;
  getSteps: () => SHA256Step[];
}

const DEFAULT_CONFIG: SHA256Config = {
  rounds: 64,
  messageSize: 512,
  useNativeParams: true
};

export const useAppStore = create<AppState>((set, get) => ({
  // État initial
  config: DEFAULT_CONFIG,
  message: 'Hello',
  steps: [],
  animation: {
    isPlaying: false,
    currentStepIndex: 0,
    speed: 40  // 40ms = 25x (1000/25)
  },
  
  // Actions de configuration
  setConfig: (newConfig) => {
    const config = { ...get().config, ...newConfig };
    set({ config });
    // Recalculer le hash avec la nouvelle config
    get().computeHash();
  },
  
  setMessage: (message) => {
    set({ message });
    // Recalculer le hash
    get().computeHash();
  },
  
  computeHash: () => {
    const { message, config } = get();
    const engine = new SHA256Engine(config);
    const steps = engine.hash(message);
    set({ 
      steps,
      animation: {
        ...get().animation,
        currentStepIndex: 0,
        isPlaying: false
      }
    });
  },
  
  // Contrôles d'animation
  play: () => {
    set({ 
      animation: { 
        ...get().animation, 
        isPlaying: true 
      } 
    });
  },
  
  pause: () => {
    set({ 
      animation: { 
        ...get().animation, 
        isPlaying: false 
      } 
    });
  },
  
  stepForward: () => {
    const { steps, animation } = get();
    if (animation.currentStepIndex < steps.length - 1) {
      set({
        animation: {
          ...animation,
          currentStepIndex: animation.currentStepIndex + 1
        }
      });
    }
  },
  
  stepBack: () => {
    const { animation } = get();
    if (animation.currentStepIndex > 0) {
      set({
        animation: {
          ...animation,
          currentStepIndex: animation.currentStepIndex - 1
        }
      });
    }
  },
  
  roundForward: () => {
    const { steps, animation } = get();
    const currentRound = get().getCurrentRound();
    
    // Trouver le premier step du prochain round
    for (let i = animation.currentStepIndex + 1; i < steps.length; i++) {
      if (steps[i].round > currentRound) {
        set({
          animation: {
            ...animation,
            currentStepIndex: i
          }
        });
        return;
      }
    }
    
    // Si on ne trouve pas, aller à la fin
    set({
      animation: {
        ...animation,
        currentStepIndex: steps.length - 1
      }
    });
  },
  
  roundBack: () => {
    const { steps, animation } = get();
    const currentRound = get().getCurrentRound();
    
    // Trouver le premier step du round précédent
    for (let i = animation.currentStepIndex - 1; i >= 0; i--) {
      if (steps[i].round < currentRound) {
        // Trouver le début de ce round
        const targetRound = steps[i].round;
        for (let j = i; j >= 0; j--) {
          if (j === 0 || steps[j - 1].round < targetRound) {
            set({
              animation: {
                ...animation,
                currentStepIndex: j
              }
            });
            return;
          }
        }
      }
    }
    
    // Si on ne trouve pas, aller au début
    set({
      animation: {
        ...animation,
        currentStepIndex: 0
      }
    });
  },
  
  reset: () => {
    set({
      animation: {
        ...get().animation,
        currentStepIndex: 0,
        isPlaying: false
      }
    });
  },
  
  setSpeed: (speed) => {
    set({
      animation: {
        ...get().animation,
        speed
      }
    });
  },
  
  // Helpers
  getCurrentStep: () => {
    const { steps, animation } = get();
    return steps[animation.currentStepIndex] || null;
  },
  
  getCurrentRound: () => {
    const step = get().getCurrentStep();
    return step ? step.round : 0;
  },
  
  getSteps: () => {
    return get().steps;
  }
}));

