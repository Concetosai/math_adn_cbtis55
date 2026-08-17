import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  HelpCircle, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Pencil, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  BookOpen,
  Zap,
  Flame,
  Award,
  Bot
} from 'lucide-react';
import { MathModule, Exercise, UserProgress } from '../types';
import { soundEngine } from '../utils/audio';
import { formatMathExpression } from '../utils/mathFormatter';

interface PracticeArenaProps {
  module: MathModule;
  initialLevel?: 1 | 2 | 3;
  progress: UserProgress;
  onBackToDashboard: () => void;
  onOpenFormulas: (module: MathModule) => void;
  onOpenScratchpad: () => void;
  onOpenAITutor?: (questionText: string, expression?: string) => void;
  onUpdateProgress: (moduleId: string, level: number, isCorrect: boolean, xpEarned: number) => void;
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({
  module,
  initialLevel = 1,
  progress,
  onBackToDashboard,
  onOpenFormulas,
  onOpenScratchpad,
  onOpenAITutor,
  onUpdateProgress,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3>(initialLevel);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [isLevelFinished, setIsLevelFinished] = useState(false);

  // Filter exercises for currently selected level
  const levelExercises = module.exercises.filter((ex) => ex.level === selectedLevel);
  const currentExercise: Exercise | undefined = levelExercises[currentExerciseIndex] || levelExercises[0];

  // Timer effect
  useEffect(() => {
    if (isLevelFinished) return;
    const interval = setInterval(() => {
      setTimeSeconds((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isLevelFinished]);

  // Reset exercise state when changing level
  useEffect(() => {
    setCurrentExerciseIndex(0);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setShowHint(false);
    setIsLevelFinished(false);
  }, [selectedLevel]);

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered || !currentExercise) return;

    soundEngine.playClick();
    setSelectedOptionId(optionId);
    setHasAnswered(true);

    const isCorrect = currentExercise.options.find((o) => o.id === optionId)?.isCorrect ?? false;

    if (isCorrect) {
      soundEngine.playCorrect();
      setSessionStreak((s) => s + 1);
      const earnedXp = currentExercise.xpReward + (sessionStreak >= 2 ? 15 : 0);
      setSessionScore((s) => s + earnedXp);
      onUpdateProgress(module.id, selectedLevel, true, earnedXp);
    } else {
      soundEngine.playWrong();
      setSessionStreak(0);
      onUpdateProgress(module.id, selectedLevel, false, 0);
    }
  };

  const handleNextExercise = () => {
    soundEngine.playClick();
    if (currentExerciseIndex < levelExercises.length - 1) {
      setCurrentExerciseIndex((i) => i + 1);
      setSelectedOptionId(null);
      setHasAnswered(false);
      setShowHint(false);
    } else {
      // Level completed!
      setIsLevelFinished(true);
      soundEngine.playLevelUp();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#22d3ee', '#38bdf8', '#fbbf24', '#ffffff'],
        });
      } catch {
        // Safe catch
      }
    }
  };

  const handleRestartLevel = () => {
    soundEngine.playClick();
    setCurrentExerciseIndex(0);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setShowHint(false);
    setIsLevelFinished(false);
    setSessionScore(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      
      {/* Top Navigation Bar in Arena */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 sm:p-5 rounded-[28px] glass border border-white/90 deep-shadow">
        <div className="flex items-center gap-3">
          <button
            id="arena-back-btn"
            onClick={() => {
              soundEngine.playClick();
              onBackToDashboard();
            }}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-300 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver a Módulos</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-cyan-700 uppercase tracking-widest bg-cyan-100 px-2.5 py-0.5 rounded-full border border-cyan-200">
                {module.title}
              </span>
              <span className="text-xs font-black text-slate-800">
                {levelExercises[currentExerciseIndex]?.levelName || `Nivel ${selectedLevel}`}
              </span>
            </div>
          </div>
        </div>

        {/* Level Switcher in Arena */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {[1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                soundEngine.playClick();
                setSelectedLevel(lvl as 1 | 2 | 3);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-cyan-500 text-slate-950 shadow-sm border border-cyan-400'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Nvl {lvl}
            </button>
          ))}
        </div>

        {/* Tools: Scratchpad, Formulas, Timer */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-cyan-600" />
            <span className="font-mono font-black">{formatTime(timeSeconds)}</span>
          </div>

          <button
            id="arena-scratchpad-btn"
            onClick={() => {
              soundEngine.playClick();
              onOpenScratchpad();
            }}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-300 text-slate-600 hover:text-cyan-600 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm cursor-pointer"
            title="Abrir Pizarra de Rayado y Cálculo"
          >
            <Pencil className="w-3.5 h-3.5 text-cyan-600" />
            <span className="hidden md:inline">Pizarra</span>
          </button>

          <button
            id="arena-formulas-btn"
            onClick={() => {
              soundEngine.playClick();
              onOpenFormulas(module);
            }}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-300 text-slate-600 hover:text-cyan-600 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm cursor-pointer"
            title="Ver Formulario del Módulo"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
            <span className="hidden md:inline">Fórmulas</span>
          </button>
        </div>
      </div>

      {/* Main Question Arena or Level Completed Screen */}
      {!isLevelFinished && currentExercise ? (
        <div className="space-y-6">
          
          {/* Progress Header & Streak Banner */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-800">
                Ejercicio {currentExerciseIndex + 1} de {levelExercises.length}
              </span>
              {sessionStreak >= 2 && (
                <span className="flex items-center gap-1 font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  Racha x{sessionStreak} (+15 XP)
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 font-black text-cyan-700">
              <Zap className="w-4 h-4 text-cyan-600" />
              <span>+{currentExercise.xpReward} XP Base</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(0,242,255,0.8)] transition-all duration-300"
              style={{
                width: `${((currentExerciseIndex + (hasAnswered ? 1 : 0)) / levelExercises.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Card (Bento Glassmorphism) */}
          <div className="rounded-[32px] glass p-6 sm:p-8 deep-shadow border border-white/90 relative">
            <div className="flex items-start justify-between gap-4 mb-4">
              <span className="text-xs font-black text-cyan-700 tracking-wider uppercase bg-cyan-100 px-3 py-1 rounded-full border border-cyan-200">
                {currentExercise.levelName}
              </span>

              <div className="flex items-center gap-2">
                {/* AI Tutor Guidance Button */}
                {onOpenAITutor && (
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      onOpenAITutor(currentExercise.question, currentExercise.mathExpression);
                    }}
                    className="px-3.5 py-1.5 rounded-2xl bg-cyan-50 border border-cyan-300 hover:bg-cyan-100 text-xs font-bold text-cyan-800 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    title="Preguntar al Tutor IA sobre este ejercicio"
                  >
                    <Bot className="w-3.5 h-3.5 text-cyan-600" />
                    <span className="hidden xs:inline">Tutor IA</span>
                  </button>
                )}

                {/* Hint Button */}
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setShowHint(!showHint);
                  }}
                  className="px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-300 text-xs font-bold text-slate-600 hover:text-cyan-700 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
                  <span>{showHint ? 'Ocultar Pista' : 'Ver Pista'}</span>
                </button>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 leading-snug">
              {currentExercise.question}
            </h2>

            {/* Math Expression Box */}
            {currentExercise.mathExpression && (
              <div className="my-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center shadow-inner">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#00f2ff] font-mono tracking-wider">
                  {formatMathExpression(currentExercise.mathExpression)}
                </div>
              </div>
            )}

            {/* Hint Box */}
            {showHint && (
              <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 mb-6 flex items-start gap-3 animate-in fade-in duration-200">
                <Sparkles className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-cyan-800 uppercase tracking-wider mb-0.5">Pista Estratégica:</p>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{currentExercise.hint}</p>
                </div>
              </div>
            )}

            {/* Answer Options Grid (Tactile Bento Buttons) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {currentExercise.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-cyan-300 hover:bg-cyan-50/50 shadow-sm';

                if (hasAnswered) {
                  if (option.isCorrect) {
                    btnStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-md border-b-4';
                  } else if (isSelected && !option.isCorrect) {
                    btnStyle = 'bg-rose-500 border-rose-600 text-white shadow-md border-b-4';
                  } else {
                    btnStyle = 'opacity-40 bg-slate-100 border-slate-200 text-slate-400';
                  }
                }

                return (
                  <button
                    key={option.id}
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(option.id)}
                    className={`py-4 px-5 rounded-2xl border flex items-center justify-between text-base font-bold transition-all text-left cursor-pointer ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black uppercase shrink-0 ${
                        hasAnswered && (option.isCorrect || (isSelected && !option.isCorrect))
                          ? 'bg-white/20 text-white'
                          : 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                      }`}>
                        {option.id}
                      </span>
                      <span className="font-mono">{option.text}</span>
                    </div>

                    {hasAnswered && option.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                    )}
                    {hasAnswered && isSelected && !option.isCorrect && (
                      <XCircle className="w-5 h-5 text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Detailed Step-by-Step Resolution */}
            {hasAnswered && (
              <div className="mt-8 pt-6 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Result Status Banner */}
                <div
                  className={`p-5 rounded-2xl mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    currentExercise.options.find((o) => o.id === selectedOptionId)?.isCorrect
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {currentExercise.options.find((o) => o.id === selectedOptionId)?.isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    )}
                    <div>
                      <h4 className="font-black text-sm">
                        {currentExercise.options.find((o) => o.id === selectedOptionId)?.isCorrect
                          ? '¡Excelente! Respuesta Correcta'
                          : 'Respuesta Incorrecta'}
                      </h4>
                      <p className="text-xs opacity-90 font-medium">
                        {currentExercise.options.find((o) => o.id === selectedOptionId)?.isCorrect
                          ? `Has ganado +${currentExercise.xpReward + (sessionStreak >= 2 ? 15 : 0)} XP`
                          : 'Revisa la explicación paso a paso abajo para dominar el concepto.'}
                      </p>
                    </div>
                  </div>

                  {/* Next Question CTA Button (Neon Button) */}
                  <button
                    id="arena-next-step-btn"
                    onClick={handleNextExercise}
                    className="neon-button py-3 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs uppercase font-black tracking-wider cursor-pointer w-full sm:w-auto"
                  >
                    <span>{currentExerciseIndex < levelExercises.length - 1 ? 'Siguiente Ejercicio' : 'Finalizar Nivel'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Explanation & Steps */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <h5 className="text-xs font-black uppercase tracking-wider text-cyan-800 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-600" />
                    Resolución y Explicación Detallada:
                  </h5>
                  <p className="text-sm text-slate-700 mb-4 leading-relaxed font-medium">
                    {currentExercise.solutionExplanation}
                  </p>

                  {/* Steps List */}
                  <div className="space-y-2">
                    {currentExercise.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
                        <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 flex items-center justify-center font-black text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-mono text-slate-800">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      ) : isLevelFinished ? (
        /* Level Completed Trophy Screen */
        <div className="rounded-[32px] glass p-8 sm:p-12 text-center max-w-2xl mx-auto deep-shadow border border-white/90 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 shadow-lg flex items-center justify-center mb-6">
            <Trophy className="w-10 h-10 text-amber-500 animate-bounce" />
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-200">
            ¡Nivel {selectedLevel} Completado!
          </span>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 mb-2 tracking-tight">
            Maestría en <span className="text-cyan-600">{module.title}</span>
          </h2>

          <p className="text-sm text-slate-600 max-w-md mx-auto mb-8 leading-relaxed font-medium">
            Has completado satisfactoriamente los ejercicios de este nivel. Tu habilidad matemática ha alcanzado un nuevo estándar.
          </p>

          {/* Stats Summary Grid */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Puntos Ganados</p>
              <p className="text-lg font-black text-cyan-600">+{sessionScore} XP</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tiempo Total</p>
              <p className="text-lg font-black text-slate-800 font-mono">{formatTime(timeSeconds)}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nivel ADN</p>
              <p className="text-lg font-black text-amber-500">Nvl {selectedLevel}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {selectedLevel < 3 && (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedLevel((l) => (l + 1) as 1 | 2 | 3);
                }}
                className="neon-button py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-sm uppercase font-black tracking-wider cursor-pointer w-full sm:w-auto"
              >
                <span>Avanzar a Nivel {selectedLevel + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleRestartLevel}
              className="btn-3d-secondary py-3 px-5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold cursor-pointer w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Repetir Nivel</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onBackToDashboard();
              }}
              className="py-3 px-5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-300 text-slate-700 text-xs font-bold transition-all w-full sm:w-auto shadow-sm cursor-pointer"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      ) : null}

    </div>
  );
};
