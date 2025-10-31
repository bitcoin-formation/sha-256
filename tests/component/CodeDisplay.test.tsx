import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CodeDisplay } from '@/components/CodeDisplay/CodeDisplay';
import { useAppStore } from '@/store/useAppStore';

// Mock du store
vi.mock('@/store/useAppStore');

// Mock de i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'code.title': 'Pseudocode SHA-256',
        'code.currentLine': 'Ligne actuelle',
      };
      return translations[key] || key;
    },
  }),
}));

describe('CodeDisplay Component', () => {
  const mockGetCurrentStep = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendu initial', () => {
    it('affiche le titre du composant', () => {
      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep.mockReturnValue(null),
      } as any);

      render(<CodeDisplay />);
      
      expect(screen.getByText('Pseudocode SHA-256')).toBeInTheDocument();
    });

    it('affiche toutes les lignes de pseudocode', () => {
      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep.mockReturnValue(null),
      } as any);

      const { container } = render(<CodeDisplay />);
      
      const codeLines = container.querySelectorAll('.code-line');
      expect(codeLines.length).toBeGreaterThan(0);
    });

    it('affiche les numéros de ligne', () => {
      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep.mockReturnValue(null),
      } as any);

      const { container } = render(<CodeDisplay />);
      
      const lineNumbers = container.querySelectorAll('.line-number');
      expect(lineNumbers.length).toBeGreaterThan(0);
      expect(lineNumbers[0]).toHaveTextContent('1');
      expect(lineNumbers[1]).toHaveTextContent('2');
    });

    it('contient les mots-clés SHA-256 attendus dans le pseudocode', () => {
      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep.mockReturnValue(null),
      } as any);

      const { container } = render(<CodeDisplay />);
      const content = container.textContent;
      
      expect(content).toContain('SHA-256');
      expect(content).toContain('ÉTAPE 1: Préparer le message');
      expect(content).toContain('ÉTAPE 2: Initialiser les variables');
      expect(content).toContain('ÉTAPE 3: Boucle principale');
      expect(content).toContain('64 rounds');
      expect(content).toContain('Σ0');
      expect(content).toContain('Σ1');
      expect(content).toContain('Ch');
      expect(content).toContain('Maj');
    });
  });

  describe('Mise en évidence de la ligne active', () => {
    it('met en évidence la ligne active quand codeLineNumber est défini', () => {
      mockGetCurrentStep.mockReturnValue({
        codeLineNumber: 15,
        description: 'Test step',
        intermediateValues: {},
        round: 0,
      });

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
      } as any);

      const { container } = render(<CodeDisplay />);
      
      const activeLine = container.querySelector('[data-line="15"]');
      expect(activeLine).toHaveClass('active');
    });

    it('n\'a pas de ligne active quand codeLineNumber est 0', () => {
      mockGetCurrentStep.mockReturnValue({
        codeLineNumber: 0,
        description: 'Test step',
        intermediateValues: {},
        round: 0,
      });

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
      } as any);

      const { container } = render(<CodeDisplay />);
      
      const activeLines = container.querySelectorAll('.active');
      expect(activeLines.length).toBe(0);
    });

    it('met en évidence les lignes proches (near-active) de la ligne active', () => {
      mockGetCurrentStep.mockReturnValue({
        codeLineNumber: 20,
        description: 'Test step',
        intermediateValues: {},
        round: 0,
      });

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
      } as any);

      const { container } = render(<CodeDisplay />);
      
      // Les lignes 18, 19, 21, 22 devraient avoir la classe near-active
      const line18 = container.querySelector('[data-line="18"]');
      const line19 = container.querySelector('[data-line="19"]');
      const line20 = container.querySelector('[data-line="20"]');
      const line21 = container.querySelector('[data-line="21"]');
      const line22 = container.querySelector('[data-line="22"]');
      
      expect(line18).toHaveClass('near-active');
      expect(line19).toHaveClass('near-active');
      expect(line20).toHaveClass('active'); // Active, donc aussi near-active
      expect(line20).toHaveClass('near-active');
      expect(line21).toHaveClass('near-active');
      expect(line22).toHaveClass('near-active');
    });

    it('affiche l\'indicateur de ligne actuelle dans le header', () => {
      mockGetCurrentStep.mockReturnValue({
        codeLineNumber: 25,
        description: 'Test step',
        intermediateValues: {},
        round: 0,
      });

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
      } as any);

      render(<CodeDisplay />);
      
      // Le texte est divisé en plusieurs éléments, utiliser getByText avec une regex ou matcher partiel
      expect(screen.getByText(/Ligne actuelle/)).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('ne affiche pas l\'indicateur de ligne actuelle quand codeLineNumber est 0', () => {
      mockGetCurrentStep.mockReturnValue({
        codeLineNumber: 0,
        description: 'Test step',
        intermediateValues: {},
        round: 0,
      });

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
      } as any);

      render(<CodeDisplay />);
      
      expect(screen.queryByText('Ligne actuelle:')).not.toBeInTheDocument();
    });
  });

  describe('Changements de ligne active', () => {
    it('met à jour la ligne active quand l\'étape change', () => {
      mockGetCurrentStep.mockReturnValue({
        codeLineNumber: 10,
        description: 'First step',
        intermediateValues: {},
        round: 0,
      });

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
      } as any);

      const { container, rerender } = render(<CodeDisplay />);
      
      let activeLine = container.querySelector('[data-line="10"]');
      expect(activeLine).toHaveClass('active');
      
      // Changer l'étape
      mockGetCurrentStep.mockReturnValue({
        codeLineNumber: 30,
        description: 'Second step',
        intermediateValues: {},
        round: 1,
      });

      rerender(<CodeDisplay />);
      
      activeLine = container.querySelector('[data-line="30"]');
      expect(activeLine).toHaveClass('active');
      
      const oldActiveLine = container.querySelector('[data-line="10"]');
      expect(oldActiveLine).not.toHaveClass('active');
    });
  });

  describe('Gestion des lignes vides', () => {
    it('affiche un espace pour les lignes vides', () => {
      mockGetCurrentStep.mockReturnValue({
        codeLineNumber: 1,
        description: 'Test step',
        intermediateValues: {},
        round: 0,
      });

      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep,
      } as any);

      const { container } = render(<CodeDisplay />);
      
      // Le pseudocode contient des lignes vides
      const codeLines = container.querySelectorAll('.line-content');
      const emptyLines = Array.from(codeLines).filter(line => 
        line.textContent === ' ' || line.textContent === ''
      );
      
      expect(emptyLines.length).toBeGreaterThan(0);
    });
  });

  describe('Structure du composant', () => {
    it('a une classe CSS correcte pour le conteneur principal', () => {
      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep.mockReturnValue(null),
      } as any);

      const { container } = render(<CodeDisplay />);
      
      expect(container.querySelector('.code-display')).toBeInTheDocument();
    });

    it('a un header avec le titre', () => {
      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep.mockReturnValue(null),
      } as any);

      const { container } = render(<CodeDisplay />);
      
      expect(container.querySelector('.code-header')).toBeInTheDocument();
    });

    it('a un conteneur de contenu avec ref pour le scroll', () => {
      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep.mockReturnValue(null),
      } as any);

      const { container } = render(<CodeDisplay />);
      
      expect(container.querySelector('.code-content')).toBeInTheDocument();
    });
  });

  describe('Attributs data pour les tests', () => {
    it('chaque ligne a un attribut data-line avec son numéro', () => {
      vi.mocked(useAppStore).mockReturnValue({
        getCurrentStep: mockGetCurrentStep.mockReturnValue(null),
      } as any);

      const { container } = render(<CodeDisplay />);
      
      const line1 = container.querySelector('[data-line="1"]');
      const line10 = container.querySelector('[data-line="10"]');
      const line20 = container.querySelector('[data-line="20"]');
      
      expect(line1).toBeInTheDocument();
      expect(line10).toBeInTheDocument();
      expect(line20).toBeInTheDocument();
    });
  });
});

