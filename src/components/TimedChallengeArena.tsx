import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, 
  Zap, 
  Flame, 
  Trophy, 
  RotateCcw, 
  ChevronRight, 
  X, 
  Award, 
  Play, 
  CheckCircle2, 
  XCircle,
  Clock,
  Sparkles,
  BarChart3,
  Edit3,
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TimedChallengeQuestion, LeaderboardEntry } from '../types';
import { TIMED_CHALLENGE_QUESTIONS } from '../data/timedChallengeQuestions';
import { soundEngine } from '../utils/audio';
import { loadLeaderboard, saveLeaderboardEntry } from '../utils/storage';
import { Scratchpad } from './Scratchpad';
import { formatMathExpression } from '../utils/mathFormatter';

interface TimedChallengeArenaProps {
  isOpen: boolean;
  onClose: () => void;
  onFinishChallenge?: (stats: {
    correct: number;
    wrong: number;
    score: number;
    maxStreak: number;
    timeLimit: 60 | 120 | 180;
    xpEarned: number;
  }) => void;
}

export const TimedChallengeArena: React.FC<TimedChallengeArenaProps> = ({
  isOpen,
  onClose,
  onFinishChallenge,
}) => {
  // Game modes: 'lobby' | 'playing' | 'gameover' | 'leaderboard'
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'gameover' | 'leaderboard'>('lobby');
  const [timeLimit, setTimeLimit] = useState<60 | 120 | 180>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [showScratchpad, setShowScratchpad] = useState<boolean>(false);
  
  // Gameplay questions and stats
  const [questionPool, setQuestionPool] = useState<TimedChallengeQuestion[]>(() => {
    return [...TIMED_CHALLENGE_QUESTIONS].sort(() => 0.5 - Math.random());
  });
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  // Score & Streak
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [bonusTimeAdded, setBonusTimeAdded] = useState(false);

  // Leaderboard
  const [playerName, setPlayerName] = useState('ADN Challenger');
  const [hasSavedScore, setHasSavedScore] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState<60 | 120 | 180>(60);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  // Ticking timer ref
  const timerRef = useRef<any>(null);

  // Load leaderboard when tab or gameState changes
  useEffect(() => {
    if (gameState === 'leaderboard' || gameState === 'gameover') {
      setLeaderboardData(loadLeaderboard(leaderboardTab));
    }
  }, [gameState, leaderboardTab]);

  // Handle countdown during 'playing'
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleGameOver();
            return 0;
          }
          if (prev <= 5) {
            soundEngine.playClick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Multiplier logic based on streak
  const getMultiplier = () => {
    if (currentStreak >= 10) return 3.0;
    if (currentStreak >= 6) return 2.0;
    if (currentStreak >= 3) return 1.5;
    return 1.0;
  };

  const multiplier = getMultiplier();

  // Shuffle and start game
  const handleStartGame = (selectedTime?: 60 | 120 | 180) => {
    soundEngine.playStart();
    const duration = selectedTime || timeLimit;
    if (selectedTime) setTimeLimit(selectedTime);

    const shuffled = [...TIMED_CHALLENGE_QUESTIONS].sort(() => 0.5 - Math.random());
    setQuestionPool(shuffled);
    setCurrentQIndex(0);
    setTimeLeft(duration);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setSelectedOptionId(null);
    setIsAnswerRevealed(false);
    setHasSavedScore(false);
    setIsDrawerOpen(false);
    setGameState('playing');
  };

  const handleGameOver = () => {
    soundEngine.playLevelUp();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }
    setGameState('gameover');
  };

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswerRevealed || gameState !== 'playing') return;
    setSelectedOptionId(optionId);
    setIsAnswerRevealed(true);

    if (isCorrect) {
      soundEngine.playCorrect();
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);

      const ptsEarned = Math.round(50 * multiplier);
      setScore((prev) => prev + ptsEarned);
      setCorrectCount((prev) => prev + 1);

      // Time bonus on 3+ streak
      if (nextStreak >= 3) {
        setTimeLeft((prev) => prev + 2);
        setBonusTimeAdded(true);
        setTimeout(() => setBonusTimeAdded(false), 900);
      }
    } else {
      soundEngine.playWrong();
      setCurrentStreak(0);
      setWrongCount((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev - 10));
    }

    // Auto next question after short delay
    setTimeout(() => {
      if (currentQIndex + 1 < questionPool.length) {
        setCurrentQIndex((prev) => prev + 1);
        setSelectedOptionId(null);
        setIsAnswerRevealed(false);
      } else {
        // Reshuffle if reached end of pool
        const reshuffled = [...TIMED_CHALLENGE_QUESTIONS].sort(() => 0.5 - Math.random());
        setQuestionPool(reshuffled);
        setCurrentQIndex(0);
        setSelectedOptionId(null);
        setIsAnswerRevealed(false);
      }
    }, 450);
  };

  const handleSaveScoreToLeaderboard = () => {
    if (hasSavedScore) return;
    soundEngine.playClick();
    const entry: LeaderboardEntry = {
      id: `lb-${Date.now()}`,
      playerName: playerName.trim() || 'ADN Challenger',
      score,
      correctCount,
      totalQuestions: correctCount + wrongCount,
      highestStreak: maxStreak,
      timeLimit,
      date: new Date().toISOString().split('T')[0],
    };
    saveLeaderboardEntry(entry);
    setHasSavedScore(true);

    // Notify parent for user progress XP and medals
    if (onFinishChallenge) {
      onFinishChallenge({
        correct: correctCount,
        wrong: wrongCount,
        score,
        maxStreak,
        timeLimit,
        xpEarned: Math.round(score * 0.5),
      });
    }

    setLeaderboardTab(timeLimit);
    setGameState('leaderboard');
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playClick();
        if (isDrawerOpen) {
          setIsDrawerOpen(false);
        } else {
          onClose();
        }
        return;
      }

      if (gameState === 'playing' && !isAnswerRevealed) {
        const currentQ = questionPool[currentQIndex] || TIMED_CHALLENGE_QUESTIONS[0];
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key) - 1;
          if (currentQ && currentQ.options[idx]) {
            handleSelectOption(currentQ.options[idx].id, currentQ.options[idx].isCorrect);
          }
        } else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
          const keyUpper = e.key.toUpperCase();
          const targetOpt = currentQ?.options.find(o => o.id === keyUpper);
          if (targetOpt) {
            handleSelectOption(targetOpt.id, targetOpt.isCorrect);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDrawerOpen, gameState, isAnswerRevealed, currentQIndex, questionPool, onClose]);

  if (!isOpen) return null;

  const currentQ = questionPool[currentQIndex] || TIMED_CHALLENGE_QUESTIONS[0] || {
    id: 'tc-fallback',
    topic: 'Cálculo Rápido',
    moduleId: 'base-cero',
    question: '¿Cuánto es 12 × 12?',
    expression: '12 \\times 12',
    options: [
      { id: 'A', text: '144', isCorrect: true },
      { id: 'B', text: '124', isCorrect: false },
      { id: 'C', text: '142', isCorrect: false },
      { id: 'D', text: '154', isCorrect: false },
    ],
    explanation: '12 × 12 = 144',
    xp: 25,
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            soundEngine.playClick();
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl h-[94vh] bg-slate-900 border border-amber-500/30 rounded-[28px] sm:rounded-[36px] shadow-2xl shadow-amber-950/60 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ========================================================================= */}
          {/* MINIMAL FLOATING TOP BAR (ADN DESIGN) */}
          {/* ========================================================================= */}
          <div className="relative z-20 px-3 sm:px-5 py-2.5 bg-slate-950/85 border-b border-slate-800/80 backdrop-blur-xl flex items-center justify-between gap-2 shrink-0">
            {/* Left Status Pill */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setIsDrawerOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100 font-black text-xs sm:text-sm transition-all cursor-pointer shadow-sm active:scale-95"
                title="Cambiar modo de duración o ver ranking"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xs">
                  <Timer className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold">
                  {gameState === 'playing' ? `${timeLimit}s (${timeLeft}s restantes)` : `Desafío Cronometrado (${timeLimit}s)`}
                </span>
              </button>

              {gameState === 'playing' && (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-mono font-black ${
                  timeLeft <= 10 
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse' 
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeLeft}s</span>
                </div>
              )}
            </div>

            {/* Right Action Controls + Drawer Trigger */}
            <div className="flex items-center gap-1.5">
              {gameState === 'playing' && (
                <button
                  id="btn-toggle-scratchpad-timed"
                  onClick={() => {
                    soundEngine.playClick();
                    setShowScratchpad(!showScratchpad);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    showScratchpad
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pizarra</span>
                </button>
              )}

              {/* Drawer Menu Button (Modos / Ranking) */}
              <button
                id="btn-open-timed-challenge-drawer"
                onClick={() => {
                  soundEngine.playClick();
                  setIsDrawerOpen(true);
                }}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-black border ${
                  isDrawerOpen
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-amber-300 border-slate-700 shadow-sm'
                }`}
                title="Abrir menú de modos y ranking"
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Modos</span>
              </button>

              {/* Close Button */}
              <button
                id="btn-close-timed-challenge"
                onClick={() => {
                  soundEngine.playClick();
                  if (gameState === 'playing') {
                    if (timerRef.current) clearInterval(timerRef.current);
                  }
                  onClose();
                }}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors border border-slate-700 cursor-pointer"
                title="Cerrar (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SLIDE-OVER RIGHT DRAWER (PANEL LATERAL CON AUTO-CIERRE) */}
          {/* ========================================================================= */}
          {isDrawerOpen && (
            <div 
              className="absolute inset-0 z-40 bg-slate-950/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
              onClick={() => setIsDrawerOpen(false)}
            >
              <div 
                className="w-full max-w-sm h-full bg-slate-900 border-l border-slate-700/80 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drawer Header */}
                <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black">
                      <Timer className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-100">Desafío Cronometrado</h3>
                      <span className="text-[10px] text-amber-400">Modos de Duración y Clasificación</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setIsDrawerOpen(false);
                    }}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 border border-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Drawer Content with Auto-Close Options */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                  {/* 60s Option */}
                  <button
                    onClick={() => handleStartGame(60)}
                    className={`w-full p-3.5 rounded-2xl text-left font-bold text-xs flex items-center justify-between border transition-all cursor-pointer ${
                      timeLimit === 60 && gameState === 'playing'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/30 text-amber-300 font-extrabold text-[10px]">
                          60s
                        </span>
                        <p className="font-black text-slate-100">Flash Relámpago (1 Minuto)</p>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Ideal para calentar y ejercitar cálculo rápido</p>
                    </div>
                    <Play className="w-4 h-4 text-amber-400 shrink-0" />
                  </button>

                  {/* 120s Option */}
                  <button
                    onClick={() => handleStartGame(120)}
                    className={`w-full p-3.5 rounded-2xl text-left font-bold text-xs flex items-center justify-between border transition-all cursor-pointer ${
                      timeLimit === 120 && gameState === 'playing'
                        ? 'bg-orange-500/20 border-orange-400 text-orange-200 shadow-md'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-orange-500/30 text-orange-300 font-extrabold text-[10px]">
                          120s
                        </span>
                        <p className="font-black text-slate-100">Pro Challenger (2 Minutos)</p>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">El equilibrio perfecto de resistencia y agilidad</p>
                    </div>
                    <Play className="w-4 h-4 text-orange-400 shrink-0" />
                  </button>

                  {/* 180s Option */}
                  <button
                    onClick={() => handleStartGame(180)}
                    className={`w-full p-3.5 rounded-2xl text-left font-bold text-xs flex items-center justify-between border transition-all cursor-pointer ${
                      timeLimit === 180 && gameState === 'playing'
                        ? 'bg-rose-500/20 border-rose-400 text-rose-200 shadow-md'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/30 text-rose-300 font-extrabold text-[10px]">
                          180s
                        </span>
                        <p className="font-black text-slate-100">Maratón ADN (3 Minutos)</p>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Prueba máxima para récords legendarios</p>
                    </div>
                    <Play className="w-4 h-4 text-rose-400 shrink-0" />
                  </button>

                  {/* View Leaderboard */}
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setGameState('leaderboard');
                      setIsDrawerOpen(false);
                    }}
                    className="w-full p-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-left font-bold text-xs flex items-center justify-between text-slate-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <p className="font-black text-slate-100">Tabla de Clasificación</p>
                        <p className="text-[10px] text-slate-400">Ver récords de la comunidad</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>

                  {/* Back to Lobby */}
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setGameState('lobby');
                      setIsDrawerOpen(false);
                    }}
                    className="w-full p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-center font-bold text-xs text-slate-300 transition-colors cursor-pointer"
                  >
                    Volver al Menú Principal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. LOBBY VIEW */}
          {/* ========================================================================= */}
          {gameState === 'lobby' && (
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 flex flex-col justify-center max-w-2xl mx-auto w-full">
              <div className="text-center space-y-2.5">
                <div className="inline-flex p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10 mb-1">
                  <Timer className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                  Desafío Cronometrado <span className="text-amber-400">ADN</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed max-w-lg mx-auto">
                  Resuelve la mayor cantidad de ejercicios contrarreloj. Encadena respuestas correctas para activar multiplicadores de puntos (hasta x3.0) y ganar segundos extra de bonus (+2s).
                </p>
              </div>

              {/* Time Selector Cards */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase text-slate-400 tracking-wider text-center">
                  Selecciona la Duración del Reto:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { sec: 60 as const, label: '60 Segundos', tag: 'Flash 1M', desc: 'Rápido & Ágil' },
                    { sec: 120 as const, label: '120 Segundos', tag: 'Pro 2M', desc: 'Equilibrio Óptimo' },
                    { sec: 180 as const, label: '180 Segundos', tag: 'Maratón 3M', desc: 'Máximo Puntaje' },
                  ].map((m) => (
                    <button
                      key={m.sec}
                      onClick={() => {
                        soundEngine.playClick();
                        setTimeLimit(m.sec);
                      }}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                        timeLimit === m.sec
                          ? 'bg-amber-500/20 text-amber-200 border-amber-400 shadow-lg shadow-amber-500/20 font-black ring-1 ring-amber-400/50'
                          : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-600 font-bold'
                      }`}
                    >
                      <Clock className="w-5 h-5 mx-auto mb-1.5 text-amber-400 opacity-90" />
                      <span className="text-base font-mono block text-slate-100">{m.sec}s</span>
                      <span className="text-[10px] text-amber-300/80 font-bold block">{m.tag}</span>
                      <span className="text-[9px] text-slate-400 hidden sm:block mt-0.5">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rules & Rewards Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/80 shadow-sm">
                  <span className="text-amber-400 font-black block text-sm">+50 pts</span>
                  <span className="text-[10px] text-slate-400 font-medium">Por Acierto</span>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/80 shadow-sm">
                  <span className="text-cyan-400 font-black block text-sm">Hasta x3.0</span>
                  <span className="text-[10px] text-slate-400 font-medium">Multiplicador Racha</span>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/80 shadow-sm">
                  <span className="text-emerald-400 font-black block text-sm">+2 Segundos</span>
                  <span className="text-[10px] text-slate-400 font-medium">Bonus en Racha 3+</span>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/80 shadow-sm">
                  <span className="text-rose-400 font-black block text-sm">-10 pts</span>
                  <span className="text-[10px] text-slate-400 font-medium">Penalización Fallo</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  id="btn-start-timed-challenge"
                  onClick={() => handleStartGame()}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current" /> ¡Comenzar Desafío ({timeLimit}s)!
                </button>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setGameState('leaderboard');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-amber-400" /> Ver Tabla de Clasificación
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. PLAYING VIEW (Active Question Canvas) */}
          {/* ========================================================================= */}
          {gameState === 'playing' && (
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 flex flex-col justify-between">
              {/* Top Stats Strip */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  {/* Timer */}
                  <div className="flex items-center gap-2">
                    <div className={`px-4 py-2 rounded-2xl font-mono text-lg sm:text-xl font-black flex items-center gap-2 shadow-md transition-all ${
                      timeLeft <= 10 
                        ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30' 
                        : 'bg-slate-800 border border-slate-700 text-amber-300'
                    }`}>
                      <Timer className="w-5 h-5" />
                      <span>{timeLeft}s</span>
                    </div>
                    {bonusTimeAdded && (
                      <span className="text-xs font-black text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 rounded-xl animate-bounce">
                        +2s Bonus!
                      </span>
                    )}
                  </div>

                  {/* Multiplier & Score */}
                  <div className="flex items-center gap-2">
                    {currentStreak >= 3 && (
                      <div className="px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-black flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
                        <span>Racha: {currentStreak}</span>
                      </div>
                    )}

                    <div className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-black">
                      x{multiplier.toFixed(1)} Combo
                    </div>

                    <div className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-mono text-xs font-black shadow-sm">
                      {score} Pts
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      timeLeft <= 10 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'
                    }`}
                    style={{ width: `${Math.max(0, (timeLeft / timeLimit) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Question Main Box */}
              <div className="p-5 sm:p-7 rounded-[28px] bg-slate-800/80 border border-slate-700 shadow-xl space-y-4 text-center my-auto">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/40">
                    {currentQ.topic || 'Operación Rápida'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Pregunta #{currentQIndex + 1}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-100 leading-snug">
                  {currentQ.question}
                </h3>

                {currentQ.expression && (
                  <div className="p-3.5 sm:p-4 bg-slate-900/90 rounded-2xl border border-slate-700/80 font-mono text-lg sm:text-2xl font-black text-cyan-300 max-w-md mx-auto shadow-inner tracking-wide overflow-x-auto">
                    {formatMathExpression(currentQ.expression)}
                  </div>
                )}

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {currentQ.options.map((opt, index) => {
                    const isSelected = selectedOptionId === opt.id;
                    let style = 'bg-slate-900/80 hover:bg-slate-750 text-slate-200 border-slate-700 hover:border-slate-600';
                    if (isAnswerRevealed) {
                      if (opt.isCorrect) {
                        style = 'bg-emerald-500/20 text-emerald-200 border-emerald-400 font-black shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400';
                      } else if (isSelected && !opt.isCorrect) {
                        style = 'bg-rose-500/20 text-rose-200 border-rose-400 font-black';
                      } else {
                        style = 'opacity-30 bg-slate-900 border-slate-800 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        id={`option-${opt.id}`}
                        onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                        disabled={isAnswerRevealed}
                        className={`p-3.5 sm:p-4 rounded-2xl border text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center justify-between gap-3 ${style}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-black text-amber-400 shrink-0">
                            {opt.id}
                          </span>
                          <span className="text-left">{opt.text}</span>
                        </div>

                        <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                          [{index + 1}]
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Stats */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-2">
                <span>Aciertos: <strong className="text-emerald-400">{correctCount}</strong></span>
                <span>Fallos: <strong className="text-rose-400">{wrongCount}</strong></span>
                <span>Mayor Racha: <strong className="text-amber-400">{maxStreak}🔥</strong></span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. GAMEOVER / RESULTS VIEW */}
          {/* ========================================================================= */}
          {gameState === 'gameover' && (
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 text-center flex flex-col justify-center max-w-xl mx-auto w-full">
              <div className="inline-flex p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-xl shadow-amber-500/10 mx-auto">
                <Trophy className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                  ¡Tiempo Cumplido!
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
                  Has demostrado gran velocidad y reflejos matemáticos
                </p>
              </div>

              {/* Score Showcase */}
              <div className="p-6 rounded-[28px] bg-slate-950 border border-amber-500/40 text-white shadow-2xl max-w-sm mx-auto w-full space-y-2">
                <span className="text-xs uppercase font-black tracking-widest text-amber-400">
                  Puntuación Final
                </span>
                <div className="font-mono text-4xl sm:text-5xl font-black text-amber-300">
                  {score} <span className="text-sm font-sans font-bold text-slate-400">pts</span>
                </div>
                <div className="text-xs text-cyan-300 font-bold">
                  +{Math.round(score * 0.5)} XP para tu perfil ADN
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto w-full text-center text-xs">
                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-sm">
                  <span className="text-xs text-slate-400 font-medium block">Aciertos</span>
                  <span className="text-lg font-black text-emerald-400">{correctCount}</span>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-sm">
                  <span className="text-xs text-slate-400 font-medium block">Mayor Racha</span>
                  <span className="text-lg font-black text-amber-400">{maxStreak}🔥</span>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-sm">
                  <span className="text-xs text-slate-400 font-medium block">Precisión</span>
                  <span className="text-lg font-black text-cyan-400">
                    {correctCount + wrongCount > 0 
                      ? `${Math.round((correctCount / (correctCount + wrongCount)) * 100)}%`
                      : '0%'}
                  </span>
                </div>
              </div>

              {/* Player Name Input & Save to Leaderboard */}
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 max-w-md mx-auto w-full space-y-2.5 text-left">
                <label className="block text-xs font-black uppercase text-slate-300 tracking-wider">
                  Registrar Récord en Clasificación:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={18}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Tu Nombre o Alias"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleSaveScoreToLeaderboard}
                    disabled={hasSavedScore}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                      hasSavedScore 
                        ? 'bg-emerald-500 text-slate-950' 
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
                    }`}
                  >
                    {hasSavedScore ? '¡Guardado!' : 'Guardar Récord'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => handleStartGame()}
                  className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" /> Jugar Otra Vez ({timeLimit}s)
                </button>

                <button
                  onClick={() => setGameState('leaderboard')}
                  className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-amber-400" /> Ver Ranking
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. LEADERBOARD VIEW */}
          {/* ========================================================================= */}
          {gameState === 'leaderboard' && (
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 flex flex-col justify-between">
              <div>
                {/* Header & Tabs */}
                <div className="text-center mb-4 space-y-2">
                  <h3 className="text-xl font-black text-slate-100 flex items-center justify-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    Tabla de Clasificación Oficial
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    {[60, 120, 180].map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          soundEngine.playClick();
                          setLeaderboardTab(t as any);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          leaderboardTab === t
                            ? 'bg-amber-400 text-slate-950 shadow-md border border-amber-400'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {t}s ({t === 60 ? 'Flash 1M' : t === 120 ? 'Pro 2M' : 'Maratón 3M'})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Rankings List */}
                <div className="space-y-2 max-w-xl mx-auto">
                  {leaderboardData.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs font-medium bg-slate-800/50 rounded-2xl border border-slate-700">
                      No hay puntuaciones registradas en esta categoría aún. ¡Sé el primero en jugar!
                    </div>
                  ) : (
                    leaderboardData.map((entry, index) => {
                      let rankBadge = `${index + 1}º`;
                      let rankStyle = 'bg-slate-800 text-slate-400 border-slate-700';
                      if (index === 0) {
                        rankBadge = '🥇 1º';
                        rankStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-black';
                      } else if (index === 1) {
                        rankBadge = '🥈 2º';
                        rankStyle = 'bg-slate-700 text-slate-200 border-slate-600 font-black';
                      } else if (index === 2) {
                        rankBadge = '🥉 3º';
                        rankStyle = 'bg-orange-500/20 text-orange-300 border-orange-500/40 font-black';
                      }

                      return (
                        <div
                          key={entry.id}
                          className="p-3 sm:p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-sm flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border ${rankStyle}`}>
                              {rankBadge}
                            </span>
                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-slate-100">
                                {entry.playerName}
                              </h4>
                              <span className="text-[10px] text-slate-400">
                                {entry.correctCount} aciertos · Racha {entry.highestStreak}🔥 · {entry.date}
                              </span>
                            </div>
                          </div>

                          <div className="text-right font-mono">
                            <span className="text-base sm:text-lg font-black text-amber-400">
                              {entry.score}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-sans">pts</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="pt-3 flex items-center justify-center gap-3 border-t border-slate-800">
                <button
                  onClick={() => handleStartGame(leaderboardTab)}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" /> Jugar Desafío ({leaderboardTab}s)
                </button>
                <button
                  onClick={() => setGameState('lobby')}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Volver al Menú
                </button>
              </div>
            </div>
          )}

        </motion.div>

        {/* Integrated Scratchpad */}
        <Scratchpad
          isOpen={showScratchpad}
          onClose={() => setShowScratchpad(false)}
        />
      </div>
    </AnimatePresence>
  );
};
