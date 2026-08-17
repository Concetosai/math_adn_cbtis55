import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Flame,
  Trophy,
  Zap,
  Edit3,
  Brain,
  ShieldCheck,
  Activity,
  Layers,
  ChevronRight,
  Award,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BasicOperationQuestion, OperationType } from '../types';
import { getBasicOperationsQuestionsForLevel } from '../data/baseCeroData';
import { soundEngine } from '../utils/audio';
import { Scratchpad } from './Scratchpad';

interface BasicOperationsArenaProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled?: boolean;
  initialLevel?: 1 | 2 | 3;
  onFinishLevel?: (level: 1 | 2 | 3, score: number, timeSeconds: number, xpGained: number) => void;
  onLevelCompleted?: (level: 1 | 2 | 3, score: number, timeSeconds: number, xpGained: number) => void;
  completedLevels: number[];
  bestTimes: Record<number, number>;
}

export const BasicOperationsArena: React.FC<BasicOperationsArenaProps> = ({
  isOpen,
  onClose,
  soundEnabled = true,
  initialLevel = 1,
  onFinishLevel,
  onLevelCompleted,
  completedLevels,
  bestTimes,
}) => {
  const handleFinishLevelCallback = (level: 1 | 2 | 3, score: number, timeSeconds: number, xpGained: number) => {
    if (onFinishLevel) onFinishLevel(level, score, timeSeconds, xpGained);
    if (onLevelCompleted) onLevelCompleted(level, score, timeSeconds, xpGained);
  };
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3>(initialLevel);
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'results'>('lobby');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [questions, setQuestions] = useState<BasicOperationQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showScratchpad, setShowScratchpad] = useState<boolean>(false);
  const [operationStats, setOperationStats] = useState<Record<OperationType, { total: number; correct: number }>>({
    suma: { total: 0, correct: 0 },
    resta: { total: 0, correct: 0 },
    multiplicacion: { total: 0, correct: 0 },
    division: { total: 0, correct: 0 },
    combinada: { total: 0, correct: 0 },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start session
  const startSession = (level: 1 | 2 | 3) => {
    const qList = getBasicOperationsQuestionsForLevel(level);
    setQuestions(qList);
    setSelectedLevel(level);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setElapsedSeconds(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setGameState('playing');
    setOperationStats({
      suma: { total: 0, correct: 0 },
      resta: { total: 0, correct: 0 },
      multiplicacion: { total: 0, correct: 0 },
      division: { total: 0, correct: 0 },
      combinada: { total: 0, correct: 0 },
    });
    soundEngine.playStart();
  };

  // Timer loop
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    const opType = currentQ.operationType;
    setOperationStats((prev) => ({
      ...prev,
      [opType]: {
        total: prev[opType].total + 1,
        correct: prev[opType].correct + (isCorrect ? 1 : 0),
      },
    }));

    if (isCorrect) {
      soundEngine.playCorrect();
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);
    } else {
      soundEngine.playWrong();
      setStreak(0);
    }
  };

  const handleNext = () => {
    soundEngine.playClick();
    if (currentIndex + 1 >= questions.length) {
      // Complete 20 questions
      setGameState('results');
      const isPassed = score >= 14; // 70%+ pass
      const earnedXp = score * 20 + (isPassed ? 100 : 25) + Math.max(0, 300 - elapsedSeconds);
      handleFinishLevelCallback(selectedLevel, score, elapsedSeconds, earnedXp);

      if (isPassed) {
        soundEngine.playLevelUp();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.55 },
        });
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    }
  };

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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDrawerOpen, onClose]);

  if (!isOpen) return null;

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
          className="relative w-full max-w-4xl h-[94vh] bg-slate-900 border border-emerald-500/30 rounded-[28px] sm:rounded-[36px] shadow-2xl shadow-emerald-950/60 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ========================================================================= */}
          {/* MINIMAL FLOATING TOP BAR (ADN DESIGN) */}
          {/* ========================================================================= */}
          <div className="relative z-20 px-3 sm:px-5 py-2.5 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl flex items-center justify-between gap-2 shrink-0">
            {/* Left Status Pill */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setIsDrawerOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100 font-black text-xs sm:text-sm transition-all cursor-pointer shadow-sm active:scale-95"
                title="Cambiar nivel o modo"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black text-xs">
                  {gameState === 'lobby' ? '★' : `N${selectedLevel}`}
                </div>
                <span className="font-bold">
                  {gameState === 'lobby' ? 'Operaciones Básicas' : `Nivel ${selectedLevel} (20 Ejercicios)`}
                </span>
              </button>

              {gameState === 'playing' && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-black">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>{formatTime(elapsedSeconds)}</span>
                </div>
              )}
            </div>

            {/* Right Action Controls + Drawer Trigger */}
            <div className="flex items-center gap-1.5">
              {gameState === 'playing' && (
                <button
                  id="btn-toggle-scratchpad-basic-op"
                  onClick={() => setShowScratchpad(!showScratchpad)}
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

              {/* Drawer Menu Button (⋮) */}
              <button
                id="btn-open-basic-ops-drawer"
                onClick={() => {
                  soundEngine.playClick();
                  setIsDrawerOpen(true);
                }}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-black border ${
                  isDrawerOpen
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-emerald-300 border-slate-700 shadow-sm'
                }`}
                title="Abrir menú de niveles"
              >
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Niveles</span>
              </button>

              {/* Close Button */}
              <button
                id="btn-close-basic-op-arena"
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors border border-slate-700 cursor-pointer"
                title="Cerrar modal (Esc)"
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
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-100">Niveles de Operaciones</h3>
                      <span className="text-[10px] text-emerald-400">Selecciona un nivel de prueba</span>
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

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Level 1 Button - Auto-closes on click! */}
                  <button
                    onClick={() => {
                      startSession(1);
                      setIsDrawerOpen(false); // AUTO-CLOSE!
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left font-bold text-xs flex items-center justify-between border transition-all cursor-pointer ${
                      selectedLevel === 1 && gameState === 'playing'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-md'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 font-extrabold text-[10px]">
                          Nivel 1
                        </span>
                        <p className="font-black text-slate-100">Fundamentos (2 Dígitos)</p>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">20 operaciones: +, -, ×, ÷ con números de 2 dígitos</p>
                    </div>
                    {completedLevels.includes(1) && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>

                  {/* Level 2 Button - Auto-closes on click! */}
                  <button
                    onClick={() => {
                      startSession(2);
                      setIsDrawerOpen(false); // AUTO-CLOSE!
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left font-bold text-xs flex items-center justify-between border transition-all cursor-pointer ${
                      selectedLevel === 2 && gameState === 'playing'
                        ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-md'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-teal-500/30 text-teal-300 font-extrabold text-[10px]">
                          Nivel 2
                        </span>
                        <p className="font-black text-slate-100">Intermedio (Multiplicación & División)</p>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Operaciones combinadas con jerarquía básica</p>
                    </div>
                    {completedLevels.includes(2) && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>

                  {/* Level 3 Button - Auto-closes on click! */}
                  <button
                    onClick={() => {
                      startSession(3);
                      setIsDrawerOpen(false); // AUTO-CLOSE!
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left font-bold text-xs flex items-center justify-between border transition-all cursor-pointer ${
                      selectedLevel === 3 && gameState === 'playing'
                        ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-md'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-300 font-extrabold text-[10px]">
                          Nivel 3
                        </span>
                        <p className="font-black text-slate-100">Avanzado (3 Dígitos)</p>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Cálculo mental rápido con números de 3 dígitos</p>
                    </div>
                    {completedLevels.includes(3) && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>

                  {/* Back to Lobby Option */}
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setGameState('lobby');
                      setIsDrawerOpen(false); // AUTO-CLOSE!
                    }}
                    className="w-full p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-center font-bold text-xs text-slate-300 transition-colors cursor-pointer"
                  >
                    Volver al Selector Principal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lobby View (Level Select) */}
          {gameState === 'lobby' && (
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  Test de Nivelación y Preparación ADN
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-100">
                  Elige tu Nivel de Dificultad
                </h3>
                <p className="text-sm text-slate-300">
                  Cada nivel consta de <strong className="text-emerald-400">20 ejercicios</strong> mezclando las 4 operaciones básicas (+, -, ×, ÷) con cronómetro. Superar este test garantiza que estás 100% listo para Álgebra, Geometría, Trigonometría y Cálculo.
                </p>
              </div>

              {/* 3 Difficulty Level Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
                {/* Level 1 */}
                <div
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                    completedLevels.includes(1)
                      ? 'bg-gradient-to-b from-slate-900 to-emerald-950/30 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-extrabold text-xs">
                        Nivel 1
                      </span>
                      {completedLevels.includes(1) && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Superado
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-slate-100">Fundamentos (2 Dígitos)</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        20 ejercicios de suma, resta con préstamo, multiplicación y división exacta con números de 2 dígitos.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Dígitos:</span>
                        <span className="font-bold text-emerald-300">2 Dígitos</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Operaciones:</span>
                        <span className="font-bold text-slate-200">+, -, ×, ÷</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Cronómetro:</span>
                        <span className="font-bold text-amber-300">Activo</span>
                      </div>
                      {bestTimes[1] > 0 && (
                        <div className="flex justify-between font-mono pt-1 border-t border-slate-800 text-cyan-300">
                          <span>Mejor tiempo:</span>
                          <span className="font-bold">{formatTime(bestTimes[1])}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    id="btn-start-level-1"
                    onClick={() => startSession(1)}
                    className="mt-6 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <span>Iniciar Nivel 1</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Level 2 */}
                <div
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                    completedLevels.includes(2)
                      ? 'bg-gradient-to-b from-slate-900 to-cyan-950/30 border-cyan-500/40 shadow-lg shadow-cyan-950/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-extrabold text-xs">
                        Nivel 2
                      </span>
                      {completedLevels.includes(2) && (
                        <span className="flex items-center gap-1 text-xs font-bold text-cyan-400">
                          <CheckCircle2 className="w-4 h-4" /> Superado
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-slate-100">Intermedio y Jerarquía</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        20 ejercicios de 2 dígitos con operaciones combinadas, paréntesis y multiplicación de 2 dígitos por 2 dígitos.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Dígitos:</span>
                        <span className="font-bold text-cyan-300">2 Dígitos Mixtos</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Jerarquía:</span>
                        <span className="font-bold text-slate-200">Paréntesis & Mix</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Cronómetro:</span>
                        <span className="font-bold text-amber-300">Activo</span>
                      </div>
                      {bestTimes[2] > 0 && (
                        <div className="flex justify-between font-mono pt-1 border-t border-slate-800 text-cyan-300">
                          <span>Mejor tiempo:</span>
                          <span className="font-bold">{formatTime(bestTimes[2])}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    id="btn-start-level-2"
                    onClick={() => startSession(2)}
                    className="mt-6 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                  >
                    <span>Iniciar Nivel 2</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Level 3 */}
                <div
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                    completedLevels.includes(3)
                      ? 'bg-gradient-to-b from-slate-900 to-indigo-950/30 border-indigo-500/40 shadow-lg shadow-indigo-950/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-indigo-500/40'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-extrabold text-xs">
                        Nivel 3
                      </span>
                      {completedLevels.includes(3) && (
                        <span className="flex items-center gap-1 text-xs font-bold text-indigo-400">
                          <CheckCircle2 className="w-4 h-4" /> Superado
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-slate-100">Avanzado (3 Dígitos)</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        20 ejercicios con números de 3 dígitos: sumas con doble acarreo, restas complejas, multiplicaciones y divisiones.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Dígitos:</span>
                        <span className="font-bold text-indigo-300">3 Dígitos</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Operaciones:</span>
                        <span className="font-bold text-slate-200">+, -, ×, ÷ Avanzadas</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Cronómetro:</span>
                        <span className="font-bold text-amber-300">Activo</span>
                      </div>
                      {bestTimes[3] > 0 && (
                        <div className="flex justify-between font-mono pt-1 border-t border-slate-800 text-cyan-300">
                          <span>Mejor tiempo:</span>
                          <span className="font-bold">{formatTime(bestTimes[3])}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    id="btn-start-level-3"
                    onClick={() => startSession(3)}
                    className="mt-6 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                  >
                    <span>Iniciar Nivel 3</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Playing Mode */}
          {gameState === 'playing' && currentQ && (
            <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto max-w-2xl mx-auto w-full">
              {/* Header Info Bar */}
              <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 px-5 py-3 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-extrabold text-xs">
                    Nivel {selectedLevel}
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-300">
                    {currentIndex + 1} / 20
                  </span>
                </div>

                {/* Cronometro */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-sm font-black">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>{formatTime(elapsedSeconds)}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs sm:text-sm">
                    <Flame className="w-4 h-4" />
                    <span>{streak}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs sm:text-sm">
                    <Trophy className="w-4 h-4" />
                    <span>{score}</span>
                  </div>
                </div>
              </div>

              {/* Progress bar (1 to 20) */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-emerald-400 to-cyan-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / 20) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Question Card */}
              <div className="bg-slate-950/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Operación: {currentQ.operationType.toUpperCase()} ({currentQ.digits} DÍGITOS)
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{currentQ.question}</p>
                  <h3 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight font-mono py-2">
                    {currentQ.expression} = ?
                  </h3>
                </div>

                {/* Multiple choice options */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    let btnStyle = 'bg-slate-900 border-slate-800 hover:border-emerald-500/50 text-slate-200 hover:bg-slate-800/80';

                    if (isAnswered) {
                      if (opt.isCorrect) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-black shadow-lg shadow-emerald-500/20';
                      } else if (isSelected && !opt.isCorrect) {
                        btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                      } else {
                        btnStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        id={`btn-basic-op-${opt.id}`}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                        className={`p-4 sm:p-5 rounded-2xl border text-xl sm:text-2xl font-mono font-black transition-all flex items-center justify-center gap-2 active:scale-95 ${btnStyle}`}
                      >
                        <span>{opt.text}</span>
                        {isAnswered && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {isAnswered && isSelected && !opt.isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Step-by-Step feedback */}
                <AnimatePresence>
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl text-left border ${
                        selectedOptionId && currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect
                          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm mb-1">
                        {selectedOptionId && currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>¡Acierto! +20 XP</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-400" />
                            <span>Respuesta correcta: {currentQ.correctAnswer}</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 font-sans">{currentQ.explanation}</p>
                      {currentQ.stepByStep && currentQ.stepByStep.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1">
                          {currentQ.stepByStep.map((st, sIdx) => (
                            <div key={sIdx} className="text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                              <span>•</span>
                              <span>{st}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Next button */}
                {isAnswered && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
                    <button
                      id="btn-next-basic-op-question"
                      onClick={handleNext}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 active:scale-95 transition-all"
                    >
                      <span>{currentIndex + 1 >= 20 ? 'Finalizar y Ver Diagnóstico' : 'Siguiente Ejercicio (20 Total)'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Results & Readiness Diagnosis */}
          {gameState === 'results' && (
            <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto max-w-2xl mx-auto w-full">
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 mx-auto flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/30">
                  <ShieldCheck className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {score >= 14 ? 'CERTIFICADO DE PREPARACIÓN ADN' : 'RETO COMPLETADO'}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-100">
                    {score >= 14 ? '¡Fase Cero Superada con Éxito!' : 'Buen Intento de Nivelación'}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
                    {score >= 14
                      ? 'Has demostrado el dominio aritmético necesario. Estás 100% listo para abordar con total confianza Álgebra, Fracciones, Ecuaciones, Trigonometría y Cálculo.'
                      : 'Te recomendamos repasar las operaciones con fallo antes de avanzar a los módulos más complejos.'}
                  </p>
                </div>

                {/* Score Stats Grid */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <div className="text-center">
                    <span className="text-[11px] text-slate-400 block font-medium">Aciertos</span>
                    <span className="font-mono text-lg sm:text-xl font-black text-emerald-400">
                      {score} / 20
                    </span>
                  </div>
                  <div className="text-center border-x border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Tiempo</span>
                    <span className="font-mono text-lg sm:text-xl font-black text-amber-400">
                      {formatTime(elapsedSeconds)}
                    </span>
                  </div>
                  <div className="text-center border-r border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Precisión</span>
                    <span className="font-mono text-lg sm:text-xl font-black text-cyan-400">
                      {Math.round((score / 20) * 100)}%
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[11px] text-slate-400 block font-medium">XP Ganado</span>
                    <span className="font-mono text-lg sm:text-xl font-black text-emerald-400">
                      +{score * 20 + (score >= 14 ? 100 : 25)}
                    </span>
                  </div>
                </div>

                {/* Breakdown by operation */}
                <div className="p-4 bg-slate-900/50 border border-slate-800/80 rounded-2xl space-y-2 text-left">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Desglose por Tipo de Operación:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.entries(operationStats) as [string, { total: number; correct: number }][])
                      .filter(([_, data]) => data.total > 0)
                      .map(([op, data]) => (
                        <div key={op} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                          <span className="capitalize font-semibold text-slate-400 block">{op}</span>
                          <span className="font-mono font-bold text-slate-200">
                            {data.correct} / {data.total} aciertos
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    id="btn-retry-basic-op"
                    onClick={() => startSession(selectedLevel)}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Repetir Nivel {selectedLevel}</span>
                  </button>

                  {selectedLevel < 3 ? (
                    <button
                      id="btn-advance-next-basic-op-level"
                      onClick={() => startSession((selectedLevel + 1) as 1 | 2 | 3)}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                    >
                      <span>Avanzar al Nivel {selectedLevel + 1}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      id="btn-finish-all-levels-lobby"
                      onClick={() => setGameState('lobby')}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                    >
                      <span>Volver al Menú de Niveles</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Scratchpad overlay if opened */}
        {showScratchpad && <Scratchpad onClose={() => setShowScratchpad(false)} />}
      </div>
    </AnimatePresence>
  );
};
