/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MATH_MODULES 
} from './data/mathModules';
import { 
  MathModule, 
  UserProgress 
} from './types';
import { 
  loadUserProgress, 
  saveUserProgress, 
  checkNewlyUnlockedMedals,
  getInitialProgress
} from './utils/storage';
import { soundEngine } from './utils/audio';

import { Navbar } from './components/Navbar';
import { StatsDashboard } from './components/StatsDashboard';
import { ModuleCard } from './components/ModuleCard';
import { FormulasModal } from './components/FormulasModal';
import { PracticeArena } from './components/PracticeArena';
import { MedalsModal } from './components/MedalsModal';
import { Scratchpad } from './components/Scratchpad';
import { InteractiveTutorialModal } from './components/InteractiveTutorialModal';
import { TimedChallengeArena } from './components/TimedChallengeArena';
import { MultiplicationTablesModal } from './components/MultiplicationTablesModal';
import { BasicOperationsArena } from './components/BasicOperationsArena';
import { SettingsAdminModal } from './components/SettingsAdminModal';
import { AITutorModal } from './components/AITutorModal';
import { VoiceTutorMiniChat } from './components/VoiceTutorMiniChat';
import { GlobalRoadmapModal } from './components/GlobalRoadmapModal';
import { ModuleIntroVideoModal } from './components/ModuleIntroVideoModal';
import { Award, Sparkles, X, Bot, Volume2, Map, ChevronDown, ChevronUp, Layers, SlidersHorizontal } from 'lucide-react';
import { INITIAL_MEDALS } from './data/medalsData';
import { AITutorConfig } from './types';
import { loadTutorConfig, saveTutorConfig } from './utils/storage';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [tutorConfig, setTutorConfig] = useState<AITutorConfig>(loadTutorConfig);
  const [activeView, setActiveView] = useState<'dashboard' | 'practice'>('dashboard');
  const [activePracticeModule, setActivePracticeModule] = useState<MathModule | null>(null);
  const [activePracticeLevel, setActivePracticeLevel] = useState<1 | 2 | 3>(1);

  // Accordion cascade states (Default CLOSED as requested by user to save mobile screen space)
  const [isSection1Open, setIsSection1Open] = useState(false);
  const [isSection2Open, setIsSection2Open] = useState(false);
  const [isSection3Open, setIsSection3Open] = useState(false);

  const handleExpandAll = () => {
    soundEngine.playClick();
    setIsSection1Open(true);
    setIsSection2Open(true);
    setIsSection3Open(true);
  };

  const handleCollapseAll = () => {
    soundEngine.playClick();
    setIsSection1Open(false);
    setIsSection2Open(false);
    setIsSection3Open(false);
  };

  // Modals state
  const [isFormulasOpen, setIsFormulasOpen] = useState(false);
  const [selectedFormulasModule, setSelectedFormulasModule] = useState<MathModule | null>(MATH_MODULES[0]);
  const [isMedalsOpen, setIsMedalsOpen] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);

  // CBTIS 55 MATH: Settings, Voice Tutor & AI Tutor Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isVoiceTutorOpen, setIsVoiceTutorOpen] = useState(false);
  const [isFloatingTutorVisible, setIsFloatingTutorVisible] = useState(true);
  const [tutorContextQuestion, setTutorContextQuestion] = useState<{ questionText: string; expression?: string } | null>(null);

  // New Features Modals: Interactive Tutorials & Timed Challenge
  const [isTutorialsOpen, setIsTutorialsOpen] = useState(false);
  const [tutorialInitialModule, setTutorialInitialModule] = useState<'algebra-basica' | 'trigonometria' | 'calculo'>('algebra-basica');
  const [isTimedChallengeOpen, setIsTimedChallengeOpen] = useState(false);

  // Fase Cero Modals: Tablas del 2 al 12 & Operaciones Básicas Test
  const [isMultiplicationTablesOpen, setIsMultiplicationTablesOpen] = useState(false);
  const [isBasicOperationsOpen, setIsBasicOperationsOpen] = useState(false);
  const [basicOperationsInitialLevel, setBasicOperationsInitialLevel] = useState<1 | 2 | 3>(1);

  // Module Intro Video Modal
  const [isModuleIntroOpen, setIsModuleIntroOpen] = useState(false);
  const [introModule, setIntroModule] = useState<MathModule | null>(null);

  // Toast notification for newly unlocked medals
  const [unlockedMedalToast, setUnlockedMedalToast] = useState<string | null>(null);

  // Determine current active section id for TTS & context
  const getCurrentSectionId = () => {
    if (isMultiplicationTablesOpen) return 'tablas-multiplicar';
    if (isBasicOperationsOpen) return 'operaciones-basicas';
    if (isTimedChallengeOpen) return 'desafio-cronometrado';
    if (isTutorialsOpen) return 'tutoriales-interactivos';
    if (activePracticeModule) return activePracticeModule.id;
    return 'base-cero';
  };

  // Open Tutor with question context
  const handleOpenAITutor = (questionText?: string, expression?: string) => {
    if (questionText) {
      setTutorContextQuestion({ questionText, expression });
    } else {
      setTutorContextQuestion(null);
    }
    setIsVoiceTutorOpen(true);
  };

  // Save tutor config
  const handleSaveTutorConfig = (newConfig: AITutorConfig) => {
    setTutorConfig(newConfig);
    saveTutorConfig(newConfig);
  };

  // Save progress on state change & check for medals
  useEffect(() => {
    saveUserProgress(progress);
    soundEngine.setEnabled(progress.soundEnabled);

    const newMedals = checkNewlyUnlockedMedals(progress);
    if (newMedals.length > 0) {
      soundEngine.playLevelUp();
      const firstNewMedal = INITIAL_MEDALS.find(m => m.id === newMedals[0]);
      if (firstNewMedal) {
        setUnlockedMedalToast(firstNewMedal.title);
        setTimeout(() => setUnlockedMedalToast(null), 4500);
      }
      setProgress((prev) => ({
        ...prev,
        unlockedMedalIds: Array.from(new Set([...prev.unlockedMedalIds, ...newMedals])),
      }));
    }
  }, [progress]);

  // Sound preference toggle
  const handleToggleSound = () => {
    const nextVal = !progress.soundEnabled;
    soundEngine.setEnabled(nextVal);
    if (nextVal) soundEngine.playClick();
    setProgress((p) => ({ ...p, soundEnabled: nextVal }));
  };

  // Open Formulas for a specific module
  const handleOpenFormulas = (module: MathModule) => {
    setSelectedFormulasModule(module);
    setIsFormulasOpen(true);
  };

  // Open Interactive Tutorials modal
  const handleOpenTutorials = (moduleId: 'algebra-basica' | 'trigonometria' | 'calculo' = 'algebra-basica') => {
    setTutorialInitialModule(moduleId);
    setIsTutorialsOpen(true);
  };

  // Open Timed Challenge Arena
  const handleOpenTimedChallenge = () => {
    setIsTimedChallengeOpen(true);
  };

  // Handle Tutorial Completion
  const handleCompleteTutorial = (tutorialId: string, xpReward: number) => {
    setProgress((prev) => {
      const alreadyCompleted = prev.completedTutorialIds.includes(tutorialId);
      const updatedTuts = alreadyCompleted 
        ? prev.completedTutorialIds 
        : [...prev.completedTutorialIds, tutorialId];

      const newProgress: UserProgress = {
        ...prev,
        xp: prev.xp + (alreadyCompleted ? Math.round(xpReward * 0.2) : xpReward),
        completedTutorialIds: updatedTuts,
      };

      const newMedals = checkNewlyUnlockedMedals(newProgress);
      if (newMedals.length > 0) {
        newProgress.unlockedMedalIds = Array.from(new Set([...newProgress.unlockedMedalIds, ...newMedals]));
      }

      return newProgress;
    });
  };

  // Handle Timed Challenge Finish
  const handleFinishChallenge = (stats: {
    correct: number;
    wrong: number;
    score: number;
    maxStreak: number;
    timeLimit: 60 | 120 | 180;
    xpEarned: number;
  }) => {
    setProgress((prev) => {
      const currentHigh = prev.timedChallengeHighScores[stats.timeLimit] || 0;
      const updatedScores = {
        ...prev.timedChallengeHighScores,
        [stats.timeLimit]: Math.max(currentHigh, stats.score),
      };

      const newProgress: UserProgress = {
        ...prev,
        xp: prev.xp + stats.xpEarned,
        totalSolved: prev.totalSolved + stats.correct + stats.wrong,
        totalCorrect: prev.totalCorrect + stats.correct,
        timedChallengeHighScores: updatedScores,
        totalTimedPlayed: prev.totalTimedPlayed + 1,
      };

      const newMedals = checkNewlyUnlockedMedals(newProgress, {
        correct: stats.correct,
        score: stats.score,
        maxStreak: stats.maxStreak,
      });

      if (newMedals.length > 0) {
        newProgress.unlockedMedalIds = Array.from(new Set([...newProgress.unlockedMedalIds, ...newMedals]));
      }

      return newProgress;
    });
  };

  // Handle Fase Cero - Table Completed
  const handleCompleteTable = (tableNumber: number, xpReward: number) => {
    setProgress((prev) => {
      const already = prev.completedTables?.includes(tableNumber) || false;
      const updatedTables = already ? (prev.completedTables || []) : [...(prev.completedTables || []), tableNumber];

      const newProgress: UserProgress = {
        ...prev,
        xp: prev.xp + (already ? Math.round(xpReward * 0.2) : xpReward),
        totalSolved: prev.totalSolved + 1,
        totalCorrect: prev.totalCorrect + 1,
        completedTables: updatedTables,
      };

      const newMedals = checkNewlyUnlockedMedals(newProgress);
      if (newMedals.length > 0) {
        newProgress.unlockedMedalIds = Array.from(new Set([...newProgress.unlockedMedalIds, ...newMedals]));
      }

      return newProgress;
    });
  };

  // Handle Fase Cero - Basic Operations Level Completed
  const handleFinishBasicOpLevel = (stats: {
    level: 1 | 2 | 3;
    timeSpentSeconds: number;
    correct: number;
    total: number;
    passed: boolean;
    xpEarned: number;
  }) => {
    setProgress((prev) => {
      const already = prev.completedBasicOpLevels?.includes(stats.level) || false;
      const updatedLevels = (stats.passed && !already)
        ? [...(prev.completedBasicOpLevels || []), stats.level]
        : (prev.completedBasicOpLevels || []);

      const prevBest = prev.basicOpBestTimes?.[stats.level] || 999999;
      const updatedTimes = stats.passed
        ? {
            ...(prev.basicOpBestTimes || {}),
            [stats.level]: Math.min(prevBest, stats.timeSpentSeconds),
          }
        : prev.basicOpBestTimes;

      const newProgress: UserProgress = {
        ...prev,
        xp: prev.xp + stats.xpEarned,
        totalSolved: prev.totalSolved + stats.total,
        totalCorrect: prev.totalCorrect + stats.correct,
        completedBasicOpLevels: updatedLevels,
        basicOpBestTimes: updatedTimes,
      };

      const newMedals = checkNewlyUnlockedMedals(newProgress);
      if (newMedals.length > 0) {
        newProgress.unlockedMedalIds = Array.from(new Set([...newProgress.unlockedMedalIds, ...newMedals]));
      }

      return newProgress;
    });
  };

  // Open Practice for a specific module & level
  const handleStartPractice = (module: MathModule, level: 1 | 2 | 3 = 1) => {
    setActivePracticeModule(module);
    setActivePracticeLevel(level);
    setIsFormulasOpen(false);
    setActiveView('practice');
    setIsVoiceTutorOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open intro video modal when clicking "Practicar" on a ModuleCard
  const handleModuleCardPractice = (module: MathModule, level?: 1 | 2 | 3) => {
    soundEngine.playClick();
    if (level) {
      // Direct level click — skip intro video
      handleStartPractice(module, level);
    } else {
      // Main "Practicar" button — show intro video first
      setIntroModule(module);
      setIsModuleIntroOpen(true);
    }
  };

  // Handle exercise solved progress update
  const handleUpdateProgress = (
    moduleId: string, 
    level: number, 
    isCorrect: boolean, 
    xpEarned: number
  ) => {
    setProgress((prev) => {
      const modKey = moduleId as keyof typeof prev.moduleProgress;
      const currentModProgress = prev.moduleProgress[modKey] || {
        moduleId: modKey,
        completedLevels: [],
        exercisesSolved: 0,
        correctCount: 0,
        wrongCount: 0,
        highestStreak: 0,
      };

      const updatedCompletedLevels = isCorrect && !currentModProgress.completedLevels.includes(level)
        ? [...currentModProgress.completedLevels, level]
        : currentModProgress.completedLevels;

      const newModStreak = isCorrect ? (currentModProgress.highestStreak || 0) + 1 : 0;

      return {
        ...prev,
        xp: prev.xp + xpEarned,
        totalSolved: prev.totalSolved + 1,
        totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
        moduleProgress: {
          ...prev.moduleProgress,
          [modKey]: {
            ...currentModProgress,
            completedLevels: updatedCompletedLevels,
            exercisesSolved: currentModProgress.exercisesSolved + 1,
            correctCount: currentModProgress.correctCount + (isCorrect ? 1 : 0),
            wrongCount: currentModProgress.wrongCount + (isCorrect ? 0 : 1),
            highestStreak: Math.max(currentModProgress.highestStreak || 0, newModStreak),
            lastPracticed: new Date().toISOString(),
          },
        },
      };
    });
  };

  // Reset progress handler
  const handleResetProgress = () => {
    const fresh = getInitialProgress();
    setProgress(fresh);
    saveUserProgress(fresh);
    setShowResetConfirm(false);
    soundEngine.playClick();
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-slate-800 font-sans selection:bg-cyan-400 selection:text-slate-950 overflow-x-hidden">
      
      {/* Background Decorative Ambient Canvas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-cyan-200/30 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-blue-200/30 rounded-full blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[150px]" />
      </div>

      {/* Main Container or 9:16 Mobile Aspect Simulator */}
      <div 
        className={`relative z-10 transition-all duration-300 ${
          isMobileSimulator 
            ? 'max-w-[420px] mx-auto min-h-screen border-x-2 border-cyan-400/40 shadow-[0_0_80px_rgba(6,182,212,0.15)] bg-[#f0f4f8] my-0 sm:my-4 sm:rounded-[36px] overflow-hidden' 
            : 'w-full'
        }`}
      >
        {/* Navigation Bar */}
        <Navbar
          progress={progress}
          onToggleSound={handleToggleSound}
          onOpenMedals={() => setIsMedalsOpen(true)}
          onOpenQuickFormulas={() => {
            setSelectedFormulasModule(MATH_MODULES[0]);
            setIsFormulasOpen(true);
          }}
          onOpenTimedChallenge={handleOpenTimedChallenge}
          onOpenTutorials={handleOpenTutorials}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAITutor={() => setIsAITutorOpen(true)}
          onResetProgress={() => setShowResetConfirm(true)}
          isMobileSimulator={isMobileSimulator}
          onToggleMobileSimulator={() => setIsMobileSimulator(!isMobileSimulator)}
          isFloatingTutorVisible={isFloatingTutorVisible}
          onToggleFloatingTutor={() => setIsFloatingTutorVisible(!isFloatingTutorVisible)}
          onOpenRoadmap={() => setIsRoadmapOpen(true)}
        />

        {/* View Content: Dashboard vs Practice Arena */}
        <main className="pb-24">
          {activeView === 'dashboard' ? (
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 space-y-4 sm:space-y-6">
              
              {/* Sections 1 and 2: Stats & Hero Banner & Accordeon Sections */}
              <StatsDashboard
                progress={progress}
                onSelectModuleForPractice={(mod) => handleStartPractice(mod, 1)}
                onOpenMedals={() => setIsMedalsOpen(true)}
                onOpenTimedChallenge={handleOpenTimedChallenge}
                onOpenTutorials={handleOpenTutorials}
                onOpenMultiplicationTables={() => setIsMultiplicationTablesOpen(true)}
                onOpenBasicOperations={() => {
                  setBasicOperationsInitialLevel(1);
                  setIsBasicOperationsOpen(true);
                }}
                onOpenRoadmap={() => setIsRoadmapOpen(true)}
                isSection1Open={isSection1Open}
                onToggleSection1={() => {
                  soundEngine.playClick();
                  setIsSection1Open(!isSection1Open);
                }}
                isSection2Open={isSection2Open}
                onToggleSection2={() => {
                  soundEngine.playClick();
                  setIsSection2Open(!isSection2Open);
                }}
                onExpandAllSections={handleExpandAll}
                onCollapseAllSections={handleCollapseAll}
              />

              {/* ========================================================================= */}
              {/* SECCIÓN 3: MÓDULOS TRONCALES · ADN MATEMÁTICO CBTIS 55 (ACORDEÓN)       */}
              {/* ========================================================================= */}
              {(() => {
                const totalPossibleLevels = MATH_MODULES.reduce((acc, m) => acc + m.totalLevels, 0); // 21
                let totalMasteredLevels = 0;
                MATH_MODULES.forEach((mod) => {
                  const p = progress.moduleProgress[mod.id];
                  if (p && p.completedLevels) {
                    totalMasteredLevels += p.completedLevels.length;
                  }
                });
                const totalProgressPercent = Math.round((totalMasteredLevels / totalPossibleLevels) * 100);

                return (
                  <div className="rounded-2xl sm:rounded-[28px] bg-gradient-to-br from-cyan-50/90 via-sky-50/40 to-white border-2 border-cyan-300/80 shadow-md overflow-hidden transition-all">
                    
                    {/* Accordion Header */}
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        setIsSection3Open(!isSection3Open);
                      }}
                      className="w-full p-3.5 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-cyan-100/40 transition-colors cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                          <span className="text-base sm:text-lg">03</span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-cyan-900 bg-cyan-200/90 px-2.5 py-0.5 rounded-full border border-cyan-300">
                              Sección 3
                            </span>
                            <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                              Módulos Troncales · ADN Matemático CBTIS 55
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-1 font-medium">
                            7 Módulos: Fundamentos Aritméticos, Álgebra, Fracciones, Ecuaciones, Geometría, Trigonometría y Cálculo.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden md:inline-flex text-[10px] font-extrabold text-cyan-900 bg-cyan-100 px-2.5 py-1 rounded-full border border-cyan-200">
                          {totalMasteredLevels}/{totalPossibleLevels} Niveles ({totalProgressPercent}%)
                        </span>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-100 text-cyan-900 flex items-center justify-center border border-cyan-300 transition-transform">
                          {isSection3Open ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Collapsible Content */}
                    {isSection3Open && (
                      <div className="p-3.5 sm:p-6 pt-0 border-t border-cyan-200/60 mt-1 space-y-4">
                        
                        {/* Section Sub-header & Action Buttons */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 pb-1 border-b border-cyan-200/40">
                          <div>
                            <p className="text-xs text-slate-600 font-medium">
                              Accede a las fórmulas explicadas, tutoriales interactivos, tutor IA socrático y práctica por niveles.
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setIsAITutorOpen(true)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400 text-cyan-800 text-xs font-bold transition-all shadow-sm cursor-pointer"
                            >
                              <Bot className="w-3.5 h-3.5 text-cyan-600" />
                              <span>Tutor IA</span>
                            </button>

                            <button
                              onClick={() => setIsScratchpadOpen(true)}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-cyan-400 text-cyan-700 text-xs font-bold transition-all shadow-sm cursor-pointer"
                            >
                              <span>Abrir Pizarra</span>
                            </button>
                          </div>
                        </div>

                        {/* 7 Core Modules Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          {MATH_MODULES.map((module) => (
                            <ModuleCard
                              key={module.id}
                              module={module}
                              progress={progress.moduleProgress[module.id]}
                              onOpenFormulas={handleOpenFormulas}
                              onStartPractice={handleModuleCardPractice}
                              onOpenMultiplicationTables={
                                module.id === 'base-cero' ? () => setIsMultiplicationTablesOpen(true) : undefined
                              }
                              onOpenBasicOperations={
                                module.id === 'base-cero' ? () => {
                                  setBasicOperationsInitialLevel(1);
                                  setIsBasicOperationsOpen(true);
                                } : undefined
                              }
                              onOpenTutorial={
                                ['algebra-basica', 'trigonometria', 'calculo'].includes(module.id)
                                  ? () => handleOpenTutorials(module.id as any)
                                  : undefined
                              }
                            />
                          ))}
                        </div>

                      </div>
                    )}

                  </div>
                );
              })()}

            </div>
          ) : (
            activePracticeModule && (
              <PracticeArena
                module={activePracticeModule}
                initialLevel={activePracticeLevel}
                progress={progress}
                onBackToDashboard={() => setActiveView('dashboard')}
                onOpenFormulas={handleOpenFormulas}
                onOpenScratchpad={() => setIsScratchpadOpen(true)}
                onOpenAITutor={(questionText, expression) => handleOpenAITutor(questionText, expression)}
                onUpdateProgress={handleUpdateProgress}
              />
            )
          )}
        </main>

        {/* Global Footer */}
        <footer className="w-full border-t border-slate-200 bg-white/70 backdrop-blur-md py-6 px-4 text-center text-xs text-slate-500">
          <p>
            CBTIS 55 MATH — Plataforma Interactiva con Estética ADN, Bento Grid, Fase Cero, Desafíos Cronometrados y Tutor IA Gemini 3.7.
          </p>
        </footer>
      </div>

      {/* Settings & Admin Panel (Docente / Administración) */}
      <SettingsAdminModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={tutorConfig}
        onSaveConfig={handleSaveTutorConfig}
      />

      {/* AI Tutor Virtual Assistant Modal */}
      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => {
          setIsAITutorOpen(false);
          setTutorContextQuestion(null);
        }}
        config={tutorConfig}
        currentContext={
          activePracticeModule
            ? {
                moduleId: activePracticeModule.id,
                moduleTitle: activePracticeModule.title,
                level: activePracticeLevel,
                questionText: tutorContextQuestion?.questionText,
                expression: tutorContextQuestion?.expression,
              }
            : undefined
        }
      />

      {/* Formulas & Rules Modal */}
      <FormulasModal
        isOpen={isFormulasOpen}
        selectedModule={selectedFormulasModule}
        onClose={() => setIsFormulasOpen(false)}
        onSelectModule={(mod) => setSelectedFormulasModule(mod)}
        onStartPractice={(mod) => handleStartPractice(mod, 1)}
      />

      {/* Medals & Progress Showcase Modal */}
      <MedalsModal
        isOpen={isMedalsOpen}
        progress={progress}
        onClose={() => setIsMedalsOpen(false)}
      />

      {/* Interactive Step-by-Step Tutorials Modal */}
      <InteractiveTutorialModal
        isOpen={isTutorialsOpen}
        onClose={() => setIsTutorialsOpen(false)}
        initialModuleId={tutorialInitialModule}
        completedTutorialIds={progress.completedTutorialIds || []}
        onCompleteTutorial={handleCompleteTutorial}
      />

      {/* Timed Challenge Mode Arena & Leaderboard */}
      <TimedChallengeArena
        isOpen={isTimedChallengeOpen}
        onClose={() => setIsTimedChallengeOpen(false)}
        onFinishChallenge={handleFinishChallenge}
      />

      {/* Fase Cero Section 1: Tablas de Multiplicar del 2 al 12 Modal */}
      <MultiplicationTablesModal
        isOpen={isMultiplicationTablesOpen}
        onClose={() => setIsMultiplicationTablesOpen(false)}
        completedTables={progress.completedTables || []}
        onCompleteTable={handleCompleteTable}
      />

      {/* Fase Cero Section 2: Operaciones Básicas (3 Niveles con Cronómetro) */}
      <BasicOperationsArena
        isOpen={isBasicOperationsOpen}
        onClose={() => setIsBasicOperationsOpen(false)}
        initialLevel={basicOperationsInitialLevel}
        completedLevels={progress.completedBasicOpLevels || []}
        bestTimes={progress.basicOpBestTimes || {}}
        onFinishLevel={handleFinishBasicOpLevel}
      />

      {/* Global Pedagogical Roadmap & Section Directory Modal */}
      <GlobalRoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
        progress={progress}
        onOpenMultiplicationTables={() => setIsMultiplicationTablesOpen(true)}
        onOpenBasicOperations={(lvl = 1) => {
          setBasicOperationsInitialLevel((lvl ?? 1) as 1 | 2 | 3);
          setIsBasicOperationsOpen(true);
        }}
        onSelectModule={(mod, lvl = 1) => handleStartPractice(mod, (lvl ?? 1) as 1 | 2 | 3)}
        onOpenTutorial={(modId) => handleOpenTutorials(modId)}
        onOpenTimedChallenge={handleOpenTimedChallenge}
        onOpenFormulas={(mod) => {
          if (mod) setSelectedFormulasModule(mod);
          setIsFormulasOpen(true);
        }}
        onOpenMedals={() => setIsMedalsOpen(true)}
        onOpenVoiceTutor={() => setIsVoiceTutorOpen(true)}
      />

      {/* Module Intro Video Modal (YouTube embed + Continue/Replay buttons) */}
      <ModuleIntroVideoModal
        isOpen={isModuleIntroOpen}
        module={introModule}
        onClose={() => setIsModuleIntroOpen(false)}
        onStartPractice={handleStartPractice}
        onOpenFormulas={handleOpenFormulas}
      />

      {/* Virtual Scratchpad Canvas (Pizarra de Cálculo) */}
      <Scratchpad
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />

      {/* CBTIS 55 MATH Voice Tutor & Mini-Chat System (TTS + STT + Auto-Send) */}
      <VoiceTutorMiniChat
        isOpen={isVoiceTutorOpen}
        onClose={() => setIsVoiceTutorOpen(false)}
        currentSectionId={getCurrentSectionId()}
        currentExerciseContext={
          tutorContextQuestion
            ? {
                questionText: tutorContextQuestion.questionText,
                expression: tutorContextQuestion.expression,
                level: activePracticeLevel,
              }
            : undefined
        }
        tutorConfig={tutorConfig}
        onOpenFullModal={() => {
          setIsVoiceTutorOpen(false);
          setIsAITutorOpen(true);
        }}
      />

      {/* Floating AI & Voice Tutor Quick Action Trigger Button (when mini-chat & modal are closed and visible) */}
      {!isAITutorOpen && !isVoiceTutorOpen && isFloatingTutorVisible && (
        <motion.div
          drag
          dragMomentum={false}
          className="fixed bottom-5 left-5 z-20 flex items-center shadow-[0_0_25px_rgba(0,242,255,0.4)] rounded-2xl cursor-grab active:cursor-grabbing group select-none"
        >
          <button
            id="floating-ai-tutor-btn"
            onClick={() => {
              soundEngine.playClick();
              setIsVoiceTutorOpen(true);
            }}
            className="px-3.5 py-2.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 rounded-l-2xl border-y border-l border-cyan-300 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            title="Arrastrar para mover · Clic para abrir Tutor de Voz & IA"
          >
            <div className="relative flex items-center justify-center">
              <Bot className="w-4 h-4 text-slate-950" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-slate-950 rounded-full flex items-center justify-center">
                <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>Tutor Voz & IA</span>
              <Volume2 className="w-3.5 h-3.5 text-slate-950" />
            </div>
          </button>

          {/* Close/Hide Button to store in drawer menu */}
          <button
            id="btn-dismiss-floating-tutor"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick();
              setIsFloatingTutorVisible(false);
            }}
            className="p-2.5 bg-cyan-600/90 hover:bg-cyan-700 text-slate-950 hover:text-white rounded-r-2xl border-y border-r border-cyan-300 transition-colors cursor-pointer"
            title="Ocultar burbuja flotante (puedes activarla desde el Menú Lateral)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Floating Scratchpad Quick Action Button (when closed) */}
      {!isScratchpadOpen && (
        <button
          id="floating-scratchpad-btn"
          onClick={() => {
            soundEngine.playClick();
            setIsScratchpadOpen(true);
          }}
          className="fixed bottom-5 right-5 z-30 neon-button px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-cyan-400/20 cursor-pointer group"
          title="Abrir Pizarra de Cálculo Libre"
        >
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          <span className="text-xs uppercase font-black text-slate-950">Pizarra ADN</span>
        </button>
      )}

      {/* Unlocked Medal Floating Toast Notification */}
      {unlockedMedalToast && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-amber-400 text-slate-950 border border-amber-300 shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="p-2 rounded-xl bg-slate-950 text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider block text-slate-900">
              ¡Nueva Medalla Desbloqueada!
            </span>
            <span className="text-xs font-black">{unlockedMedalToast}</span>
          </div>
          <button 
            onClick={() => setUnlockedMedalToast(null)}
            className="p-1 rounded-lg hover:bg-amber-300 text-slate-950 transition-colors ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reset Progress Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-md w-full p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 mb-2">¿Reiniciar todo el progreso?</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Esta acción restablecerá tus puntos de experiencia (XP), medallas desbloqueadas, puntuaciones de desafíos cronometrados y niveles superados a cero.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 border border-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetProgress}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Sí, Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
