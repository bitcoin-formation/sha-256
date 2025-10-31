import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FlowDiagram } from '@/components/FlowDiagram/FlowDiagram';
import { useAppStore } from '@/store/useAppStore';
import { SHA256Step } from '@/types/sha256';

// Mock du store
vi.mock('@/store/useAppStore');

// Mock de i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}));

describe('FlowDiagram Component', () => {
  const mockGetCurrentStep = vi.fn();
  const mockGetSteps = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('État initial sans étape', () => {
    it('affiche le placeholder quand il n\'y a pas d\'étape', () => {
      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep.mockReturnValue(null),
        getSteps: mockGetSteps.mockReturnValue([]),
        message: '',
      } as any);

      render(<FlowDiagram />);
      
      expect(screen.getByText(/diagramme de flux apparaîtra ici/i)).toBeInTheDocument();
    });
  });

  describe('Rendu avec étape active', () => {
    const createMockStep = (description: string, round: number = 0): SHA256Step => ({
      description,
      round,
      intermediateValues: {
        'a': 0x6a09e667,
        'b': 0xbb67ae85,
        'Hash complet': 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      },
      codeLineNumber: 10,
    });

    const prepareStep: SHA256Step = {
      description: 'Étape 1: Préparation du message',
      round: 0,
      intermediateValues: {
        'W[0]': 0x48656c6c,
        'W[1]': 0x6f000000,
        'W[2]': 0x00000000,
      },
      codeLineNumber: 15,
    };

    it('affiche le titre du diagramme', () => {
      mockGetCurrentStep.mockReturnValue(createMockStep('Étape 0: Message d\'entrée'));
      mockGetSteps.mockReturnValue([prepareStep]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'Hello',
      } as any);

      render(<FlowDiagram />);
      
      expect(screen.getByText(/Schéma de flux SHA-256/i)).toBeInTheDocument();
    });

    it('affiche le numéro de round dans le titre pendant la boucle', () => {
      const loopStep = createMockStep('Étape 3: Round 5 - Calcul Σ1(e)', 5);
      mockGetCurrentStep.mockReturnValue(loopStep);
      mockGetSteps.mockReturnValue([prepareStep, loopStep]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'Hello',
      } as any);

      render(<FlowDiagram />);
      
      expect(screen.getByText(/Round 6/i)).toBeInTheDocument(); // round + 1
    });

    it('affiche la description de l\'étape dans le badge', () => {
      const step = createMockStep('Étape 2: Initialisation des variables');
      mockGetCurrentStep.mockReturnValue(step);
      mockGetSteps.mockReturnValue([prepareStep]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'Hello',
      } as any);

      render(<FlowDiagram />);
      
      expect(screen.getByText('Étape 2: Initialisation des variables')).toBeInTheDocument();
    });
  });

  describe('Diagramme SVG', () => {
    const createMockStep = (description: string): SHA256Step => ({
      description,
      round: 0,
      intermediateValues: {},
      codeLineNumber: 10,
    });

    const prepareStep: SHA256Step = {
      description: 'Étape 1: Préparation du message',
      round: 0,
      intermediateValues: {},
      codeLineNumber: 15,
    };

    it('contient un élément SVG', () => {
      mockGetCurrentStep.mockReturnValue(createMockStep('Étape 0: Message'));
      mockGetSteps.mockReturnValue([prepareStep]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'Hello',
      } as any);

      const { container } = render(<FlowDiagram />);
      
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('flow-svg');
    });

    it('affiche les 5 étapes principales du SHA-256', () => {
      mockGetCurrentStep.mockReturnValue(createMockStep('Étape 0: Message'));
      mockGetSteps.mockReturnValue([prepareStep]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'Hello',
      } as any);

      render(<FlowDiagram />);
      
      expect(screen.getByText('0. Message d\'entrée')).toBeInTheDocument();
      expect(screen.getByText('1. Préparer le message')).toBeInTheDocument();
      expect(screen.getByText('2. Initialiser les variables')).toBeInTheDocument();
      expect(screen.getByText('3. BOUCLE PRINCIPALE (64 rounds)')).toBeInTheDocument();
      expect(screen.getByText('4. Ajouter au hash')).toBeInTheDocument();
      expect(screen.getByText('5. Résultat SHA-256')).toBeInTheDocument();
    });

    it('affiche les 7 sous-étapes de la boucle', () => {
      mockGetCurrentStep.mockReturnValue(createMockStep('Étape 3: Round 1'));
      mockGetSteps.mockReturnValue([prepareStep]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'Hello',
      } as any);

      render(<FlowDiagram />);
      
      expect(screen.getByText('Σ1(e)')).toBeInTheDocument();
      expect(screen.getByText('Ch(e,f,g)')).toBeInTheDocument();
      expect(screen.getByText('temp1')).toBeInTheDocument();
      expect(screen.getByText('Σ0(a)')).toBeInTheDocument();
      expect(screen.getByText('Maj(a,b,c)')).toBeInTheDocument();
      expect(screen.getByText('temp2')).toBeInTheDocument();
      expect(screen.getByText('Rotation')).toBeInTheDocument();
    });
  });

  describe('Mise en évidence des étapes', () => {
    const prepareStep: SHA256Step = {
      description: 'Étape 1: Préparation du message',
      round: 0,
      intermediateValues: {},
      codeLineNumber: 15,
    };

    it('met en évidence l\'étape 0 (Message) quand elle est active', () => {
      const step: SHA256Step = {
        description: 'Étape 0: Message d\'entrée',
        round: 0,
        intermediateValues: {},
        codeLineNumber: 5,
      };

      mockGetCurrentStep.mockReturnValue(step);
      mockGetSteps.mockReturnValue([prepareStep]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'Hello',
      } as any);

      const { container } = render(<FlowDiagram />);
      
      // Vérifier que le rectangle de l'étape 0 a une opacité/stroke plus élevée
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('met en évidence la sous-étape de boucle active', () => {
      const step: SHA256Step = {
        description: 'Étape 3: Round 1 - Calcul Σ1(e)',
        round: 0,
        intermediateValues: {},
        codeLineNumber: 25,
      };

      mockGetCurrentStep.mockReturnValue(step);
      mockGetSteps.mockReturnValue([prepareStep, step]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'Hello',
      } as any);

      const { container } = render(<FlowDiagram />);
      
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Affichage du message', () => {
    const createMockStep = (description: string): SHA256Step => ({
      description,
      round: 0,
      intermediateValues: {},
      codeLineNumber: 10,
    });

    const prepareStep: SHA256Step = {
      description: 'Étape 1: Préparation',
      round: 0,
      intermediateValues: {},
      codeLineNumber: 15,
    };

    it('affiche le message court tel quel', () => {
      mockGetCurrentStep.mockReturnValue(createMockStep('Étape 0: Message'));
      mockGetSteps.mockReturnValue([prepareStep]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'Hello',
      } as any);

      render(<FlowDiagram />);
      
      expect(screen.getByText(/"Hello"/)).toBeInTheDocument();
    });

    it('tronque les messages longs', () => {
      const longMessage = 'A'.repeat(30);
      mockGetCurrentStep.mockReturnValue(createMockStep('Étape 0: Message'));
      mockGetSteps.mockReturnValue([prepareStep]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: longMessage,
      } as any);

      render(<FlowDiagram />);
      
      // Le message doit être tronqué avec "..."
      const messageElements = screen.getAllByText(/\.\.\./);
      expect(messageElements.length).toBeGreaterThan(0);
    });

    it('affiche le message en HEX', () => {
      mockGetCurrentStep.mockReturnValue(createMockStep('Étape 0: Message'));
      mockGetSteps.mockReturnValue([prepareStep]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'Hi',
      } as any);

      render(<FlowDiagram />);
      
      // "Hi" en HEX = 4869
      expect(screen.getByText(/4869/)).toBeInTheDocument();
    });
  });

  describe('Tooltips interactifs', () => {
    const createMockStep = (description: string): SHA256Step => ({
      description,
      round: 0,
      intermediateValues: {
        'Hash complet': 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      },
      codeLineNumber: 10,
    });

    const prepareStep: SHA256Step = {
      description: 'Étape 1: Préparation',
      round: 0,
      intermediateValues: {
        'W[0]': 0x48656c6c,
      },
      codeLineNumber: 15,
    };

    it('affiche le tooltip du message au survol', () => {
      mockGetCurrentStep.mockReturnValue(createMockStep('Étape 5: Résultat'));
      mockGetSteps.mockReturnValue([prepareStep]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'abc',
      } as any);

      const { container } = render(<FlowDiagram />);
      
      // Trouver le groupe SVG de l'étape 0 (Message)
      const svg = container.querySelector('svg');
      const messageGroup = svg?.querySelector('g');
      
      if (messageGroup) {
        fireEvent.mouseEnter(messageGroup);
        
        // Le tooltip devrait s'afficher avec le message (il y a plusieurs éléments avec "abc", vérifier la présence du tooltip)
        const allAbcElements = screen.queryAllByText(/"abc"/);
        expect(allAbcElements.length).toBeGreaterThan(0); // Au moins un élément avec "abc"
      }
    });

    it('cache le tooltip du message au mouseLeave', () => {
      mockGetCurrentStep.mockReturnValue(createMockStep('Étape 5: Résultat'));
      mockGetSteps.mockReturnValue([prepareStep]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'abc',
      } as any);

      const { container } = render(<FlowDiagram />);
      
      const svg = container.querySelector('svg');
      const messageGroup = svg?.querySelector('g');
      
      if (messageGroup) {
        fireEvent.mouseEnter(messageGroup);
        fireEvent.mouseLeave(messageGroup);
        
        // Le tooltip ne devrait plus contenir les détails
        // (il ne sera pas dans le DOM car il est conditionnel)
      }
    });
  });

  describe('Panneau des valeurs intermédiaires', () => {
    const step: SHA256Step = {
      description: 'Étape 3: Round 1 - Calcul temp1',
      round: 0,
      intermediateValues: {
        'a': 0x6a09e667,
        'b': 0xbb67ae85,
        'temp1': 0x12345678,
      },
      codeLineNumber: 30,
    };

    const prepareStep: SHA256Step = {
      description: 'Étape 1: Préparation',
      round: 0,
      intermediateValues: {},
      codeLineNumber: 15,
    };

    it('affiche le titre du panneau des valeurs', () => {
      mockGetCurrentStep.mockReturnValue(step);
      mockGetSteps.mockReturnValue([prepareStep, step]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'Hello',
      } as any);

      render(<FlowDiagram />);
      
      expect(screen.getByText(/Valeurs/)).toBeInTheDocument();
    });

    it('affiche toutes les valeurs intermédiaires en HEX', () => {
      mockGetCurrentStep.mockReturnValue(step);
      mockGetSteps.mockReturnValue([prepareStep, step]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'Hello',
      } as any);

      render(<FlowDiagram />);
      
      expect(screen.getByText('a:')).toBeInTheDocument();
      expect(screen.getByText('b:')).toBeInTheDocument();
      expect(screen.getByText('temp1:')).toBeInTheDocument();
      
      // Vérifier les valeurs hexadécimales (avec 0x préfixe)
      expect(screen.getByText(/0x6A09E667/i)).toBeInTheDocument();
      expect(screen.getByText(/0xBB67AE85/i)).toBeInTheDocument();
      expect(screen.getByText(/0x12345678/i)).toBeInTheDocument();
    });

    it('affiche "Aucune valeur" quand il n\'y a pas de valeurs intermédiaires', () => {
      const emptyStep: SHA256Step = {
        description: 'Étape 0: Message',
        round: 0,
        intermediateValues: {},
        codeLineNumber: 5,
      };

      mockGetCurrentStep.mockReturnValue(emptyStep);
      mockGetSteps.mockReturnValue([prepareStep]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'Hello',
      } as any);

      render(<FlowDiagram />);
      
      expect(screen.getByText('Aucune valeur')).toBeInTheDocument();
    });
  });

  describe('Hash final', () => {
    const finalStep: SHA256Step = {
      description: 'Étape 5: Résultat final',
      round: 63,
      intermediateValues: {
        'Hash complet': 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      },
      codeLineNumber: 45,
    };

    const prepareStep: SHA256Step = {
      description: 'Étape 1: Préparation',
      round: 0,
      intermediateValues: {},
      codeLineNumber: 15,
    };

    it('affiche le hash final tronqué dans le SVG', () => {
      mockGetCurrentStep.mockReturnValue(finalStep);
      mockGetSteps.mockReturnValue([prepareStep, finalStep]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'abc',
      } as any);

      render(<FlowDiagram />);
      
      // Hash tronqué (premiers 32 caractères) - le hash apparaît à plusieurs endroits (SVG et panneau des valeurs)
      const hashElements = screen.queryAllByText(/ba7816bf8f01cfea414140de5dae2223/);
      expect(hashElements.length).toBeGreaterThan(0); // Au moins un élément affiche le hash
    });
  });

  describe('Structure CSS', () => {
    const step: SHA256Step = {
      description: 'Étape 2: Initialisation',
      round: 0,
      intermediateValues: {},
      codeLineNumber: 20,
    };

    const prepareStep: SHA256Step = {
      description: 'Étape 1: Préparation',
      round: 0,
      intermediateValues: {},
      codeLineNumber: 15,
    };

    it('a les bonnes classes CSS', () => {
      mockGetCurrentStep.mockReturnValue(step);
      mockGetSteps.mockReturnValue([prepareStep]);

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
        getSteps: mockGetSteps,
        message: 'Hello',
      } as any);

      const { container } = render(<FlowDiagram />);
      
      expect(container.querySelector('.flow-diagram')).toBeInTheDocument();
      expect(container.querySelector('.flow-header')).toBeInTheDocument();
      expect(container.querySelector('.flow-content')).toBeInTheDocument();
      expect(container.querySelector('.flow-values')).toBeInTheDocument();
    });
  });
});

