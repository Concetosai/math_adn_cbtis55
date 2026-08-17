import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Flame, 
  Trophy, 
  Zap, 
  Grid3X3, 
  ChevronRight,
  BrainCircuit,
  Volume2,
  VolumeX,
  Award,
  Menu,
  MoreVertical,
  Layers,
  Check,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MULTIPLICATION_TABLES, generateTableQuestion } from '../data/baseCeroData';
import { soundEngine } from '../utils/audio';

interface MultiplicationTablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled?: boolean;
  onCompleteTable?: (tableNumber: number, xpGained: number) => void;
  onTableCompleted?: (tableNumber: number, xpGained: number) => void;
  completedTables: number[];
}

export const MultiplicationTablesModal: React.FC<MultiplicationTablesModalProps> = ({
  isOpen,
  onClose,
  soundEnabled = true,
  onCompleteTable,
  onTableCompleted,
  completedTables,
}) => {
  const handleTableCompletedCallback = (tableNumber: number, xpGained: number) => {
    if (onCompleteTable) onCompleteTable(tableNumber, xpGained);
    if (onTableCompleted) onTableCompleted(tableNumber, xpGained);
  };
  const [selectedTableNum, setSelectedTableNum] = useState<number>(2);
  const [activeTab, setActiveTab] = useState<'study' | 'quiz'>('study');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [interactiveMultiplier, setInteractiveMultiplier] = useState<number>(5);

  const activeTableInfo = MULTIPLICATION_TABLES.find((t) => t.number === selectedTableNum) || MULTIPLICATION_TABLES[0];

  // Initialize or reset quiz
  const startQuiz = (tableNum: number = selectedTableNum, totalQ: number = 10) => {
    setActiveTab('quiz');
    setQuestionCount(totalQ);
    setCurrentQIndex(0);
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setQuizFinished(false);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCurrentQuestion(generateTableQuestion(tableNum === 0 ? undefined : tableNum));
    soundEngine.playStart();
  };

  const handleSelectTable = (num: number) => {
    soundEngine.playClick();
    setSelectedTableNum(num);
    setActiveTab('study');
    setInteractiveMultiplier(5);
  };

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

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

  const handleNextQuestion = () => {
    soundEngine.playClick();
    if (currentQIndex + 1 >= questionCount) {
      // Quiz finished
      setQuizFinished(true);
      const earnedXp = score * 15 + (score >= 8 ? 50 : 0);
      handleTableCompletedCallback(selectedTableNum, earnedXp);

      if (score >= Math.floor(questionCount * 0.8)) {
        soundEngine.playLevelUp();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } else {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setCurrentQuestion(generateTableQuestion(selectedTableNum === 0 ? undefined : selectedTableNum));
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
          className="relative w-full max-w-5xl h-[94vh] bg-slate-900 border border-cyan-500/30 rounded-[28px] sm:rounded-[36px] shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ========================================================================= */}
          {/* MINIMAL FLOATING TOP BAR (ADN DESIGN - 100% FULL CANVAS USAGE) */}
          {/* ========================================================================= */}
          <div className="relative z-20 px-3 sm:px-5 py-2.5 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl flex items-center justify-between gap-2 shrink-0">
            {/* Left: Quick Table & Mode Status Pill */}
            <div className="flex items-center gap-2">
              <button
                id="btn-quick-open-tables-drawer"
                onClick={() => {
                  soundEngine.playClick();
                  setIsDrawerOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100 font-black text-xs sm:text-sm transition-all cursor-pointer shadow-sm active:scale-95"
                title="Cambiar de tabla o modo"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-xs">
                  {selectedTableNum === 0 ? '★' : selectedTableNum}
                </div>
                <span className="font-bold">
                  {selectedTableNum === 0 ? 'Reto Mixto (2-12)' : `Tabla del ${selectedTableNum}`}
                </span>
                <span className="text-[10px] text-cyan-400 font-semibold uppercase hidden xs:inline px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50">
                  {activeTab === 'study' ? 'Estudio' : 'Quiz'}
                </span>
              </button>

              <span className="text-[11px] text-slate-400 font-semibold hidden md:inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{completedTables.length}/11 Dominadas</span>
              </span>
            </div>

            {/* Right: Quick Action Controls + Drawer Trigger Button (⋮) */}
            <div className="flex items-center gap-1.5">
              {/* Quick Tab Switcher (Study / Quiz) */}
              {selectedTableNum !== 0 && (
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveTab('study');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'study'
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Estudio
                  </button>
                  <button
                    onClick={() => startQuiz(selectedTableNum, 10)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'quiz'
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Quiz
                  </button>
                </div>
              )}

              {/* Drawer Menu Button (⋮) */}
              <button
                id="btn-open-tables-drawer"
                onClick={() => {
                  soundEngine.playClick();
                  setIsDrawerOpen(true);
                }}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-black border ${
                  isDrawerOpen
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border-slate-700 shadow-sm'
                }`}
                title="Abrir menú de tablas y modos"
              >
                <MoreVertical className="w-4 h-4" />
                <span className="hidden sm:inline">Tablas</span>
              </button>

              {/* Close Modal Button */}
              <button
                id="btn-close-multiplication-modal"
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
          {/* SLIDE-OVER RIGHT DRAWER (PANEL LATERAL COLAPSABLE CON CIERRE AUTOMÁTICO) */}
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
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black">
                      <Grid3X3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-100">Navegación de Tablas ADN</h3>
                      <span className="text-[10px] text-cyan-400">Selecciona tabla o modo de estudio</span>
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

                {/* Drawer Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                  {/* Section 1: Selector de Tablas (2 al 12) - Auto-closes on click! */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                        1. Tablas de Multiplicar (2 al 12)
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        {completedTables.length}/11 completadas
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {MULTIPLICATION_TABLES.map((tbl) => {
                        const isSelected = selectedTableNum === tbl.number;
                        const isMastered = completedTables.includes(tbl.number);
                        return (
                          <button
                            key={tbl.number}
                            id={`drawer-table-btn-${tbl.number}`}
                            onClick={() => {
                              handleSelectTable(tbl.number);
                              setIsDrawerOpen(false); // AUTO-CLOSE IMMEDIATELY UPON SELECTION!
                            }}
                            className={`p-2.5 rounded-xl font-black text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/20 scale-[1.03]'
                                : isMastered
                                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                          >
                            <span className="text-base font-black font-mono">×{tbl.number}</span>
                            <span className="text-[10px] font-bold">
                              {isMastered ? '✓ Dominada' : `Tabla ${tbl.number}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 2: Modos de Estudio y Evaluación - Auto-closes on click! */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
                      2. Modos de Práctica y Retos
                    </span>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          setActiveTab('study');
                          setIsDrawerOpen(false); // AUTO-CLOSE!
                        }}
                        className={`w-full p-3 rounded-2xl text-left font-bold text-xs flex items-center justify-between border transition-all cursor-pointer ${
                          activeTab === 'study' && selectedTableNum !== 0
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          <div>
                            <p className="font-black text-slate-100">Modo Estudio & Trucos</p>
                            <p className="text-[10px] text-slate-400">Explicaciones, patrones y matriz visual</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </button>

                      <button
                        onClick={() => {
                          startQuiz(selectedTableNum, 10);
                          setIsDrawerOpen(false); // AUTO-CLOSE!
                        }}
                        className="w-full p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-left font-bold text-xs flex items-center justify-between transition-all cursor-pointer text-slate-300"
                      >
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <div>
                            <p className="font-black text-slate-100">Quiz Rápido (10 Preguntas)</p>
                            <p className="text-[10px] text-slate-400">Pon a prueba tu agilidad de la tabla activa</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </button>

                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          setSelectedTableNum(0);
                          startQuiz(0, 15);
                          setIsDrawerOpen(false); // AUTO-CLOSE!
                        }}
                        className={`w-full p-3 rounded-2xl text-left font-bold text-xs flex items-center justify-between border transition-all cursor-pointer ${
                          selectedTableNum === 0
                            ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400 text-amber-200 shadow-sm'
                            : 'bg-amber-950/30 border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Zap className="w-4 h-4 text-amber-400" />
                          <div>
                            <p className="font-black text-amber-300">Reto Mixto (2 al 12)</p>
                            <p className="text-[10px] text-amber-400/80">15 ejercicios aleatorios combinados</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                          Desafío
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Section 3: Summary Box */}
                  <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-1 text-center">
                    <p className="text-xs text-slate-400 font-medium">Metodología ADN de Matemáticas</p>
                    <p className="text-[11px] text-cyan-400 font-bold">CBTIS 55 · Cimientos Numéricos</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MAIN FULL-SCREEN INTERACTIVE CANVAS (100% UTILIZATION) */}
          {/* ========================================================================= */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 space-y-5">
            
            {/* STUDY MODE (ESTUDIO DINÁMICO & TRUCOS ADN) */}
            {activeTab === 'study' && selectedTableNum !== 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                
                {/* Left Column: Visual Table Grid */}
                <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-inner flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-black">
                          {activeTableInfo.number}
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-slate-100">
                            {activeTableInfo.title} Completa
                          </h3>
                          <span className="text-[10px] text-slate-400">Toca cualquier fila para proyectar</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          setIsDrawerOpen(true);
                        }}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Cambiar</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {activeTableInfo.rows.map((row) => {
                        const isHighlighted = interactiveMultiplier === row.factorB;
                        return (
                          <button
                            key={row.factorB}
                            onClick={() => {
                              soundEngine.playClick();
                              setInteractiveMultiplier(row.factorB);
                            }}
                            className={`p-2 sm:p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isHighlighted
                                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/25 scale-[1.02]'
                                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <span className="font-mono text-xs sm:text-sm font-semibold">
                              {row.factorA} × {row.factorB}
                            </span>
                            <span className="font-mono text-sm sm:text-base font-black text-cyan-300">
                              = {row.product}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <button
                      id="btn-start-quiz-from-study"
                      onClick={() => startQuiz(selectedTableNum, 10)}
                      className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Iniciar 10 Ejercicios de la Tabla {selectedTableNum}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>

                {/* Right Column: Visual Array / Dot Matrix & Mental Math Trick */}
                <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                  {/* Mnemonic Trick Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                      <BrainCircuit className="w-24 h-24 text-cyan-400" />
                    </div>
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                          Truco de Cálculo Mental Rápido
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-slate-100">{activeTableInfo.trickTitle}</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activeTableInfo.trickExplanation}</p>
                      <div className="p-2.5 bg-slate-950/70 border border-cyan-500/20 rounded-xl mt-2">
                        <p className="text-xs font-mono font-medium text-cyan-300">
                          💡 <span className="font-bold">Patrón Clave:</span> {activeTableInfo.patternTip}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Visual Multiplicative Grid */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-inner space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-200 flex items-center gap-2">
                          <Grid3X3 className="w-4 h-4 text-emerald-400" />
                          Visualizador de Matriz Multiplicativa
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Visualiza {activeTableInfo.number} grupos de {interactiveMultiplier} elementos
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-base sm:text-lg font-black text-emerald-400">
                          {activeTableInfo.number} × {interactiveMultiplier} = {activeTableInfo.number * interactiveMultiplier}
                        </span>
                      </div>
                    </div>

                    {/* Multiplier Slider / Buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-slate-400 font-semibold mr-1">Multiplicador:</span>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((val) => (
                        <button
                          key={val}
                          onClick={() => {
                            soundEngine.playClick();
                            setInteractiveMultiplier(val);
                          }}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            interactiveMultiplier === val
                              ? 'bg-emerald-400 text-slate-950 scale-110 shadow-md ring-2 ring-emerald-300'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>

                    {/* Visual Dot Array */}
                    <div className="p-3 sm:p-4 bg-slate-900/80 border border-slate-800 rounded-xl max-h-48 overflow-auto flex flex-col gap-1.5 items-center justify-center min-h-[110px]">
                      {Array.from({ length: activeTableInfo.number }, (_, rowIdx) => (
                        <div key={rowIdx} className="flex items-center gap-1.5">
                          <span className="w-5 text-[10px] font-mono text-slate-500 text-right mr-1">
                            F{rowIdx + 1}
                          </span>
                          {Array.from({ length: interactiveMultiplier }, (_, colIdx) => (
                            <motion.div
                              key={colIdx}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.15, delay: (rowIdx * interactiveMultiplier + colIdx) * 0.005 }}
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-md bg-gradient-to-br from-emerald-400 to-cyan-500 border border-cyan-300/40 shadow-xs flex items-center justify-center text-[8px] sm:text-[9px] font-bold text-slate-950 select-none"
                            >
                              •
                            </motion.div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                      <span className="truncate">Suma: {Array(interactiveMultiplier).fill(activeTableInfo.number).join(' + ')}</span>
                      <span className="text-emerald-400 font-bold shrink-0 ml-2">Total: {activeTableInfo.number * interactiveMultiplier}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* QUIZ ARENA (EJERCICIOS INTERACTIVOS & RETO MIXTO) */}
            {(activeTab === 'quiz' || selectedTableNum === 0) && !quizFinished && currentQuestion && (
              <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6 pt-2">
                {/* Header Stats Bar */}
                <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800 px-4 sm:px-5 py-3 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Pregunta:</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-sm">
                      {currentQIndex + 1} / {questionCount}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-xs sm:text-sm">
                      <Flame className="w-4 h-4" />
                      <span>Racha: {streak}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs sm:text-sm">
                      <Trophy className="w-4 h-4" />
                      <span>Aciertos: {score}</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQIndex + 1) / questionCount) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Question Card */}
                <div className="bg-slate-950/85 border border-cyan-500/30 rounded-3xl p-5 sm:p-8 text-center space-y-5 sm:space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="space-y-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
                      {selectedTableNum === 0 ? 'Reto Mixto (2 al 12)' : `Ejercicio de la ${activeTableInfo.title}`}
                    </span>
                    <h3 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight font-mono">
                      {currentQuestion.factorA} × {currentQuestion.factorB} = ?
                    </h3>
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4 max-w-lg mx-auto">
                    {currentQuestion.options.map((opt: any) => {
                      const isSelected = selectedOptionId === opt.id;
                      let btnStyle = 'bg-slate-900 border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:bg-slate-800';

                      if (isAnswered) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-black shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/40';
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold ring-2 ring-rose-400/40';
                        } else {
                          btnStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-50';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          id={`btn-table-opt-${opt.id}`}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                          className={`p-3.5 sm:p-5 rounded-2xl border text-xl sm:text-2xl font-mono font-black transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt.text}</span>
                          {isAnswered && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                          {isAnswered && isSelected && !opt.isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  <AnimatePresence>
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3.5 sm:p-4 rounded-2xl text-left border ${
                          selectedOptionId && currentQuestion.options.find((o: any) => o.id === selectedOptionId)?.isCorrect
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                            : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm mb-1">
                          {selectedOptionId && currentQuestion.options.find((o: any) => o.id === selectedOptionId)?.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>¡Correcto! +15 XP</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-400" />
                              <span>Respuesta correcta: {currentQuestion.correctProduct}</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 font-sans">{currentQuestion.explanation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Next Button */}
                  {isAnswered && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-1">
                      <button
                        id="btn-next-table-question"
                        onClick={handleNextQuestion}
                        className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
                      >
                        <span>{currentQIndex + 1 >= questionCount ? 'Ver Resultados' : 'Siguiente Ejercicio'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* QUIZ FINISHED SCREEN */}
            {quizFinished && (
              <div className="max-w-lg mx-auto bg-slate-950/85 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-5 sm:space-y-6 shadow-2xl mt-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 mx-auto flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/30">
                  <Trophy className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                    {score >= Math.floor(questionCount * 0.8) ? '¡Excelente Dominio!' : '¡Práctica Completada!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Has completado los ejercicios de {selectedTableNum === 0 ? 'todas las tablas (Reto Mixto)' : activeTableInfo.title}.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 p-3.5 sm:p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <div className="text-center">
                    <span className="text-[11px] text-slate-400 block font-medium">Aciertos</span>
                    <span className="font-mono text-lg sm:text-xl font-black text-emerald-400">
                      {score} / {questionCount}
                    </span>
                  </div>
                  <div className="text-center border-x border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Mayor Racha</span>
                    <span className="font-mono text-lg sm:text-xl font-black text-amber-400">
                      {highestStreak}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[11px] text-slate-400 block font-medium">XP Ganado</span>
                    <span className="font-mono text-lg sm:text-xl font-black text-cyan-400">
                      +{score * 15 + (score >= 8 ? 50 : 0)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
                  <button
                    id="btn-retry-table-quiz"
                    onClick={() => startQuiz(selectedTableNum, questionCount)}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Repetir Ejercicios</span>
                  </button>

                  <button
                    id="btn-next-table-advance"
                    onClick={() => {
                      if (selectedTableNum > 0 && selectedTableNum < 12) {
                        handleSelectTable(selectedTableNum + 1);
                      } else {
                        setActiveTab('study');
                        setSelectedTableNum(2);
                      }
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    <span>{selectedTableNum < 12 && selectedTableNum > 0 ? `Ir a Tabla del ${selectedTableNum + 1}` : 'Volver a Estudio'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
