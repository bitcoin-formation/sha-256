import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';
import './Controls.css';

export const Controls = () => {
  const { t } = useTranslation();
  const {
    animation,
    play,
    pause,
    stepForward,
    stepBack,
    roundForward,
    roundBack,
    setSpeed,
    steps
  } = useAppStore();

  // Auto-play avec interval
  useEffect(() => {
    if (!animation.isPlaying) return;

    const interval = setInterval(() => {
      const { animation, steps, stepForward, pause } = useAppStore.getState();
      
      if (animation.currentStepIndex >= steps.length - 1) {
        pause();
      } else {
        stepForward();
      }
    }, animation.speed);

    return () => clearInterval(interval);
  }, [animation.isPlaying, animation.speed]);

  const progress = steps.length > 0 
    ? ((animation.currentStepIndex + 1) / steps.length) * 100 
    : 0;

  return (
    <div className="controls">
      <div className="controls-buttons">
        <button 
          onClick={roundBack}
          className="control-btn"
          title={t('controls.fastBackward')}
          disabled={animation.currentStepIndex === 0}
        >
          ⏮
        </button>
        
        <button 
          onClick={stepBack}
          className="control-btn"
          title={t('controls.stepBack')}
          disabled={animation.currentStepIndex === 0}
        >
          ◀
        </button>
        
        {animation.isPlaying ? (
          <button 
            onClick={pause}
            className="control-btn control-btn-primary"
            title={t('controls.pause')}
          >
            ⏸
          </button>
        ) : (
          <button 
            onClick={play}
            className="control-btn control-btn-primary"
            title={t('controls.play')}
            disabled={animation.currentStepIndex >= steps.length - 1}
          >
            ▶
          </button>
        )}
        
        <button 
          onClick={stepForward}
          className="control-btn"
          title={t('controls.stepForward')}
          disabled={animation.currentStepIndex >= steps.length - 1}
        >
          ▶
        </button>
        
        <button 
          onClick={roundForward}
          className="control-btn"
          title={t('controls.fastForward')}
          disabled={animation.currentStepIndex >= steps.length - 1}
        >
          ⏭
        </button>
      </div>

      <div className="controls-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="progress-text">
          {animation.currentStepIndex + 1} / {steps.length}
        </span>
      </div>

      <div className="controls-speed">
        <label htmlFor="speed-slider">{t('controls.speed')}</label>
        <input
          id="speed-slider"
          type="range"
          min="1"
          max="50"
          step="1"
          value={Math.round(1000 / animation.speed)}
          onChange={(e) => setSpeed(1000 / Number(e.target.value))}
          className="speed-slider"
        />
        <span className="speed-value">
          {Math.round(1000 / animation.speed)}x
        </span>
      </div>
    </div>
  );
};

