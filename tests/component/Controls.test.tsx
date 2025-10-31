import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Controls } from '@/components/Controls/Controls';
import { useAppStore } from '@/store/useAppStore';

// Mock du store
vi.mock('@/store/useAppStore');

// Mock de i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Controls Component', () => {
  const mockPlay = vi.fn();
  const mockPause = vi.fn();
  const mockStepForward = vi.fn();
  const mockStepBack = vi.fn();
  const mockRoundForward = vi.fn();
  const mockRoundBack = vi.fn();
  const mockSetSpeed = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock du store avec état initial
    vi.mocked(useAppStore).mockReturnValue({
      animation: {
        isPlaying: false,
        currentStepIndex: 0,
        speed: 100,
      },
      steps: Array(10).fill({}), // 10 étapes au total
      play: mockPlay,
      pause: mockPause,
      stepForward: mockStepForward,
      stepBack: mockStepBack,
      roundForward: mockRoundForward,
      roundBack: mockRoundBack,
      setSpeed: mockSetSpeed,
    } as any);
  });

  describe('Rendu initial', () => {
    it('affiche tous les boutons de contrôle', () => {
      render(<Controls />);
      
      // Vérifier la présence des 5 boutons principaux
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(5);
    });

    it('affiche la barre de progression', () => {
      render(<Controls />);
      
      expect(screen.getByText('1 / 10')).toBeInTheDocument();
    });

    it('affiche le contrôle de vitesse', () => {
      render(<Controls />);
      
      expect(screen.getByLabelText('controls.speed')).toBeInTheDocument();
      expect(screen.getByText('10x')).toBeInTheDocument(); // 1000 / 100 = 10x
    });
  });

  describe('État des boutons', () => {
    it('désactive les boutons de retour quand on est au début', () => {
      vi.mocked(useAppStore).mockReturnValue({
        animation: {
          isPlaying: false,
          currentStepIndex: 0,
          speed: 100,
        },
        steps: Array(10).fill({}),
        play: mockPlay,
        pause: mockPause,
        stepForward: mockStepForward,
        stepBack: mockStepBack,
        roundForward: mockRoundForward,
        roundBack: mockRoundBack,
        setSpeed: mockSetSpeed,
      } as any);

      render(<Controls />);
      
      const buttons = screen.getAllByRole('button');
      const roundBackBtn = buttons[0];
      const stepBackBtn = buttons[1];
      
      expect(roundBackBtn).toBeDisabled();
      expect(stepBackBtn).toBeDisabled();
    });

    it('désactive les boutons d\'avance quand on est à la fin', () => {
      vi.mocked(useAppStore).mockReturnValue({
        animation: {
          isPlaying: false,
          currentStepIndex: 9, // Dernière étape (index 9 pour 10 étapes)
          speed: 100,
        },
        steps: Array(10).fill({}),
        play: mockPlay,
        pause: mockPause,
        stepForward: mockStepForward,
        stepBack: mockStepBack,
        roundForward: mockRoundForward,
        roundBack: mockRoundBack,
        setSpeed: mockSetSpeed,
      } as any);

      render(<Controls />);
      
      const buttons = screen.getAllByRole('button');
      const playBtn = buttons[2];
      const stepForwardBtn = buttons[3];
      const roundForwardBtn = buttons[4];
      
      expect(playBtn).toBeDisabled();
      expect(stepForwardBtn).toBeDisabled();
      expect(roundForwardBtn).toBeDisabled();
    });

    it('affiche le bouton pause quand l\'animation joue', () => {
      vi.mocked(useAppStore).mockReturnValue({
        animation: {
          isPlaying: true,
          currentStepIndex: 5,
          speed: 100,
        },
        steps: Array(10).fill({}),
        play: mockPlay,
        pause: mockPause,
        stepForward: mockStepForward,
        stepBack: mockStepBack,
        roundForward: mockRoundForward,
        roundBack: mockRoundBack,
        setSpeed: mockSetSpeed,
      } as any);

      render(<Controls />);
      
      const pauseBtn = screen.getByTitle('controls.pause');
      expect(pauseBtn).toBeInTheDocument();
      expect(pauseBtn).toHaveTextContent('⏸');
    });

    it('affiche le bouton play quand l\'animation est en pause', () => {
      render(<Controls />);
      
      const playBtn = screen.getByTitle('controls.play');
      expect(playBtn).toBeInTheDocument();
      expect(playBtn).toHaveTextContent('▶');
    });
  });

  describe('Interactions', () => {
    it('appelle play() quand on clique sur le bouton play', () => {
      render(<Controls />);
      
      const playBtn = screen.getByTitle('controls.play');
      fireEvent.click(playBtn);
      
      expect(mockPlay).toHaveBeenCalledTimes(1);
    });

    it('appelle pause() quand on clique sur le bouton pause', () => {
      vi.mocked(useAppStore).mockReturnValue({
        animation: {
          isPlaying: true,
          currentStepIndex: 5,
          speed: 100,
        },
        steps: Array(10).fill({}),
        play: mockPlay,
        pause: mockPause,
        stepForward: mockStepForward,
        stepBack: mockStepBack,
        roundForward: mockRoundForward,
        roundBack: mockRoundBack,
        setSpeed: mockSetSpeed,
      } as any);

      render(<Controls />);
      
      const pauseBtn = screen.getByTitle('controls.pause');
      fireEvent.click(pauseBtn);
      
      expect(mockPause).toHaveBeenCalledTimes(1);
    });

    it('appelle stepForward() quand on clique sur avance d\'une étape', () => {
      render(<Controls />);
      
      const stepForwardBtn = screen.getByTitle('controls.stepForward');
      fireEvent.click(stepForwardBtn);
      
      expect(mockStepForward).toHaveBeenCalledTimes(1);
    });

    it('appelle stepBack() quand on clique sur recule d\'une étape', () => {
      vi.mocked(useAppStore).mockReturnValue({
        animation: {
          isPlaying: false,
          currentStepIndex: 5,
          speed: 100,
        },
        steps: Array(10).fill({}),
        play: mockPlay,
        pause: mockPause,
        stepForward: mockStepForward,
        stepBack: mockStepBack,
        roundForward: mockRoundForward,
        roundBack: mockRoundBack,
        setSpeed: mockSetSpeed,
      } as any);

      render(<Controls />);
      
      const stepBackBtn = screen.getByTitle('controls.stepBack');
      fireEvent.click(stepBackBtn);
      
      expect(mockStepBack).toHaveBeenCalledTimes(1);
    });

    it('appelle roundForward() quand on clique sur avance rapide', () => {
      render(<Controls />);
      
      const roundForwardBtn = screen.getByTitle('controls.fastForward');
      fireEvent.click(roundForwardBtn);
      
      expect(mockRoundForward).toHaveBeenCalledTimes(1);
    });

    it('appelle roundBack() quand on clique sur recul rapide', () => {
      vi.mocked(useAppStore).mockReturnValue({
        animation: {
          isPlaying: false,
          currentStepIndex: 5,
          speed: 100,
        },
        steps: Array(10).fill({}),
        play: mockPlay,
        pause: mockPause,
        stepForward: mockStepForward,
        stepBack: mockStepBack,
        roundForward: mockRoundForward,
        roundBack: mockRoundBack,
        setSpeed: mockSetSpeed,
      } as any);

      render(<Controls />);
      
      const roundBackBtn = screen.getByTitle('controls.fastBackward');
      fireEvent.click(roundBackBtn);
      
      expect(mockRoundBack).toHaveBeenCalledTimes(1);
    });

    it('appelle setSpeed() quand on change le slider de vitesse', () => {
      render(<Controls />);
      
      const speedSlider = screen.getByLabelText('controls.speed');
      fireEvent.change(speedSlider, { target: { value: '20' } });
      
      expect(mockSetSpeed).toHaveBeenCalledWith(1000 / 20); // 50ms
    });
  });

  describe('Barre de progression', () => {
    it('calcule correctement le pourcentage de progression', () => {
      vi.mocked(useAppStore).mockReturnValue({
        animation: {
          isPlaying: false,
          currentStepIndex: 4, // Étape 5 sur 10
          speed: 100,
        },
        steps: Array(10).fill({}),
        play: mockPlay,
        pause: mockPause,
        stepForward: mockStepForward,
        stepBack: mockStepBack,
        roundForward: mockRoundForward,
        roundBack: mockRoundBack,
        setSpeed: mockSetSpeed,
      } as any);

      const { container } = render(<Controls />);
      
      const progressFill = container.querySelector('.progress-fill');
      expect(progressFill).toHaveStyle({ width: '50%' }); // (5 / 10) * 100 = 50%
    });

    it('affiche la progression textuelle correcte', () => {
      vi.mocked(useAppStore).mockReturnValue({
        animation: {
          isPlaying: false,
          currentStepIndex: 7,
          speed: 100,
        },
        steps: Array(20).fill({}),
        play: mockPlay,
        pause: mockPause,
        stepForward: mockStepForward,
        stepBack: mockStepBack,
        roundForward: mockRoundForward,
        roundBack: mockRoundBack,
        setSpeed: mockSetSpeed,
      } as any);

      render(<Controls />);
      
      expect(screen.getByText('8 / 20')).toBeInTheDocument();
    });
  });

  describe('Affichage de la vitesse', () => {
    it('affiche la vitesse correcte (1000ms / speed)', () => {
      vi.mocked(useAppStore).mockReturnValue({
        animation: {
          isPlaying: false,
          currentStepIndex: 0,
          speed: 50, // 1000 / 50 = 20x
        },
        steps: Array(10).fill({}),
        play: mockPlay,
        pause: mockPause,
        stepForward: mockStepForward,
        stepBack: mockStepBack,
        roundForward: mockRoundForward,
        roundBack: mockRoundBack,
        setSpeed: mockSetSpeed,
      } as any);

      render(<Controls />);
      
      expect(screen.getByText('20x')).toBeInTheDocument();
    });

    it('affiche 1x pour vitesse lente (1000ms)', () => {
      vi.mocked(useAppStore).mockReturnValue({
        animation: {
          isPlaying: false,
          currentStepIndex: 0,
          speed: 1000,
        },
        steps: Array(10).fill({}),
        play: mockPlay,
        pause: mockPause,
        stepForward: mockStepForward,
        stepBack: mockStepBack,
        roundForward: mockRoundForward,
        roundBack: mockRoundBack,
        setSpeed: mockSetSpeed,
      } as any);

      render(<Controls />);
      
      expect(screen.getByText('1x')).toBeInTheDocument();
    });
  });
});

