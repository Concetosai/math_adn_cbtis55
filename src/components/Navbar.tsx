import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Flame, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Monitor, 
  RotateCcw,
  BookOpen,
  Timer,
  GraduationCap,
  Settings,
  Bot,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Map
} from 'lucide-react';
import { UserProgress } from '../types';
import { INITIAL_MEDALS } from '../data/medalsData';
import { soundEngine } from '../utils/audio';

interface NavbarProps {
  progress: UserProgress;
  onToggleSound: () => void;
  onOpenMedals: () => void;
  onOpenQuickFormulas: () => void;
  onOpenTimedChallenge: () => void;
  onOpenTutorials: (moduleId?: 'algebra-basica' | 'trigonometria' | 'calculo') => void;
  onOpenSettings: () => void;
  onOpenAITutor: () => void;
  onResetProgress: () => void;
  isMobileSimulator: boolean;
  onToggleMobileSimulator: () => void;
  isFloatingTutorVisible?: boolean;
  onToggleFloatingTutor?: () => void;
  onOpenRoadmap?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  onToggleSound,
  onOpenMedals,
  onOpenQuickFormulas,
  onOpenTimedChallenge,
  onOpenTutorials,
  onOpenSettings,
  onOpenAITutor,
  onResetProgress,
  isMobileSimulator,
  onToggleMobileSimulator,
  isFloatingTutorVisible = true,
  onToggleFloatingTutor,
  onOpenRoadmap,
}) => {
  const totalMedals = INITIAL_MEDALS.length;
  const unlockedCount = progress.unlockedMedalIds.length;

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isInitialPeek, setIsInitialPeek] = useState<boolean>(false);
  const autoCloseTimerRef = useRef<any>(null);

  // Auto-peek the drawer menu for a few seconds on initial landing page load
  useEffect(() => {
    // Show drawer after brief mount delay
    const openTimer = setTimeout(() => {
      setIsDrawerOpen(true);
      setIsInitialPeek(true);

      // Auto hide after 3 seconds
      autoCloseTimerRef.current = setTimeout(() => {
        setIsDrawerOpen(false);
        setIsInitialPeek(false);
      }, 3200);
    }, 450);

    return () => {
      clearTimeout(openTimer);
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    };
  }, []);

  const handleOpenDrawerManually = () => {
    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    setIsInitialPeek(false);
    soundEngine.playClick();
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    setIsInitialPeek(false);
    soundEngine.playClick();
    setIsDrawerOpen(false);
  };

  // Keyboard shortcut (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        handleCloseDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  return (
    <>
      {/* ========================================================================= */}
      {/* CLEAN TOP BAR (MINIMALIST & RESPONSIVE) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          
          {/* Brand / Logo: CBTIS 55 MATH */}
          <div 
            onClick={() => {
              soundEngine.playClick();
            }}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-cyan-400 shadow-[0_4px_0_#00acc1,0_0_15px_rgba(0,242,255,0.3)] p-0.5 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-900 rounded-[12px] flex items-center justify-center">
                <span className="text-[#00f2ff] font-black text-[10px] sm:text-xs tracking-tighter">
                  55
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  CBTIS 55 <span className="text-cyan-600">MATH</span>
                </h1>
                <span className="text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 border border-cyan-200">
                  ADN
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">Plataforma de Matemáticas Interactivas</p>
            </div>
          </div>

          {/* Right Compact Quick Pill & Drawer Trigger Button */}
          <div className="flex items-center gap-2">
            {/* Quick XP Mini Badge */}
            <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-700 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>{progress.xp.toLocaleString()} <span className="text-[9px] text-cyan-700">XP</span></span>
            </div>

            {/* Quick Streak Mini Badge */}
            {progress.streakDays > 0 && (
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-black">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{progress.streakDays}d</span>
              </div>
            )}

            {/* Quick Roadmap Top Button */}
            {onOpenRoadmap && (
              <button
                id="btn-nav-quick-roadmap"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenRoadmap();
                }}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-cyan-50 hover:bg-cyan-100/80 text-cyan-800 border border-cyan-300 text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
                title="Ver Mapa Global de Secciones & Ruta"
              >
                <Map className="w-3.5 h-3.5 text-cyan-600" />
                <span>Mapa Global</span>
              </button>
            )}

            {/* MAIN LATERAL MENU TRIGGER BUTTON */}
            <button
              id="btn-open-main-lateral-menu"
              onClick={handleOpenDrawerManually}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-md active:scale-95 border ${
                isDrawerOpen
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-cyan-500/25 ring-2 ring-cyan-400/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800 hover:border-cyan-500/50 shadow-slate-900/20'
              }`}
              title="Abrir Menú Lateral de Opciones y Herramientas"
            >
              <Menu className="w-4 h-4 text-cyan-400" />
              <span>Menú</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* RIGHT LATERAL SLIDE-OVER DRAWER (AUTO-PEEK & ON-DEMAND) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseDrawer}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Slide-over Right Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm sm:max-w-md h-full bg-slate-900 border-l border-slate-700/80 shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-black text-slate-100">
                        Menú de Opciones
                      </h3>
                      <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        ADN
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Herramientas, Ajustes y Estadísticas</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isInitialPeek && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full animate-pulse hidden xs:inline-block">
                      Auto-ocultando...
                    </span>
                  )}
                  <button
                    onClick={handleCloseDrawer}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 border border-slate-700 transition-colors cursor-pointer"
                    title="Cerrar Menú (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
                
                {/* 1. Profile & Progress Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                      Progreso del Estudiante
                    </span>
                    <span className="text-[10px] font-bold text-cyan-400">
                      Nivel {Math.floor(progress.xp / 500) + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    {/* XP */}
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <Sparkles className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                      <span className="text-xs sm:text-sm font-black text-slate-100 block font-mono">
                        {progress.xp.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">XP Total</span>
                    </div>

                    {/* Streak */}
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-400 mx-auto mb-1" />
                      <span className="text-xs sm:text-sm font-black text-slate-100 block font-mono">
                        {progress.streakDays}d
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Racha</span>
                    </div>

                    {/* Medals */}
                    <div 
                      onClick={() => {
                        handleCloseDrawer();
                        onOpenMedals();
                      }}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <span className="text-xs sm:text-sm font-black text-slate-100 block font-mono">
                        {unlockedCount}/{totalMedals}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Medallas</span>
                    </div>
                  </div>
                </div>

                {/* 2. Main Interactive Tools Section */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 px-1">
                    Herramientas de Aprendizaje
                  </span>

                  {/* Global Roadmap & Plan */}
                  {onOpenRoadmap && (
                    <button
                      id="nav-global-roadmap-btn"
                      onClick={() => {
                        handleCloseDrawer();
                        onOpenRoadmap();
                      }}
                      className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/90 via-teal-950/70 to-slate-900 hover:from-cyan-900/90 hover:to-slate-850 border-2 border-cyan-400/70 text-left flex items-center justify-between transition-all cursor-pointer group shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-400 text-slate-950 flex items-center justify-center font-black group-hover:scale-105 transition-transform shadow-md">
                          <Map className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-black text-cyan-300">Mapa Global de Secciones</h4>
                            <span className="text-[9px] uppercase font-extrabold text-slate-950 bg-cyan-400 px-1.5 py-0.2 rounded-md">
                              Ruta
                            </span>
                          </div>
                          <p className="text-[10px] text-cyan-100/80">Domina las Matemáticas con Precisión y Rigor</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}

                  {/* AI Tutor */}
                  <button
                    id="nav-ai-tutor-btn"
                    onClick={() => {
                      handleCloseDrawer();
                      onOpenAITutor();
                    }}
                    className="w-full p-3.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-left flex items-center justify-between transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
                        <Bot className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-100">Tutor IA CBTIS 55</h4>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <p className="text-[10px] text-slate-400">Preguntas, pistas guiadas y explicaciones 24/7</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Timed Challenge */}
                  <button
                    id="nav-timed-challenge-btn"
                    onClick={() => {
                      handleCloseDrawer();
                      onOpenTimedChallenge();
                    }}
                    className="w-full p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left flex items-center justify-between transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                        <Timer className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-100">Desafío Contrarreloj</h4>
                          <span className="text-[9px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded-md">
                            60s · 120s · 180s
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">Puntaje combo y récords en tabla de clasificación</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Interactive Tutorials */}
                  <button
                    id="nav-tutorials-btn"
                    onClick={() => {
                      handleCloseDrawer();
                      onOpenTutorials('algebra-basica');
                    }}
                    className="w-full p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left flex items-center justify-between transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-100">Tutoriales Interactivos</h4>
                        <p className="text-[10px] text-slate-400">Guías visuales paso a paso por tema</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Formulas & Rules */}
                  <button
                    id="nav-quick-formulas-btn"
                    onClick={() => {
                      handleCloseDrawer();
                      onOpenQuickFormulas();
                    }}
                    className="w-full p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left flex items-center justify-between transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 group-hover:scale-105 transition-transform">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-100">Formularios y Reglas ADN</h4>
                        <p className="text-[10px] text-slate-400">Consultas rápidas de leyes, identidades y teoremas</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Medals Showcase */}
                  <button
                    id="nav-medals-button"
                    onClick={() => {
                      handleCloseDrawer();
                      onOpenMedals();
                    }}
                    className="w-full p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left flex items-center justify-between transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-100">Vitrina de Medallas</h4>
                          <span className="text-[10px] font-mono font-black text-amber-400">
                            {unlockedCount}/{totalMedals}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">Recompensas desbloqueables por dominio matemático</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* 3. Settings & App Controls */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 px-1">
                    Ajustes y Configuración
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Sound Toggle */}
                    <button
                      id="nav-sound-toggle-btn"
                      onClick={() => {
                        onToggleSound();
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        progress.soundEnabled
                          ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {progress.soundEnabled ? (
                        <Volume2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div>
                        <span className="text-xs font-black block">Sonido</span>
                        <span className="text-[9px] text-slate-400 font-bold">{progress.soundEnabled ? 'Activado' : 'Silenciado'}</span>
                      </div>
                    </button>

                    {/* 9:16 Mobile Aspect Simulator */}
                    <button
                      id="nav-mobile-simulator-btn"
                      onClick={() => {
                        onToggleMobileSimulator();
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        isMobileSimulator
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {isMobileSimulator ? (
                        <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <Monitor className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <div>
                        <span className="text-xs font-black block">Vista 9:16</span>
                        <span className="text-[9px] text-slate-400 font-bold">{isMobileSimulator ? 'Móvil ON' : 'Escritorio'}</span>
                      </div>
                    </button>

                    {/* Floating Voice Bubble Toggle */}
                    {onToggleFloatingTutor && (
                      <button
                        id="nav-toggle-floating-bubble-btn"
                        onClick={() => {
                          onToggleFloatingTutor();
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 col-span-2 ${
                          isFloatingTutorVisible
                            ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200'
                            : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <Bot className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black block">Burbuja Flotante Tutor</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              isFloatingTutorVisible ? 'bg-cyan-400/20 text-cyan-300' : 'bg-slate-700 text-slate-400'
                            }`}>
                              {isFloatingTutorVisible ? 'Visible (Móvil)' : 'Oculta en Menú'}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-medium">Arrastrable por la pantalla o guardada aquí</span>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Settings Admin Modal Trigger */}
                  <button
                    id="nav-settings-admin-btn"
                    onClick={() => {
                      handleCloseDrawer();
                      onOpenSettings();
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left flex items-center justify-between text-slate-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Settings className="w-4 h-4 text-cyan-400" />
                      <div>
                        <span className="text-xs font-bold block text-slate-100">Administración y Docencia</span>
                        <span className="text-[9px] text-slate-400">Configuración del Tutor IA y parámetros</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {/* Reset Progress */}
                  <button
                    id="nav-reset-btn"
                    onClick={() => {
                      handleCloseDrawer();
                      onResetProgress();
                    }}
                    className="w-full p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-center font-bold text-xs text-rose-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reiniciar Progreso de Aprendizaje</span>
                  </button>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 text-center shrink-0">
                <p className="text-[10px] font-bold text-slate-500">
                  CBTIS 55 · Plantel Pánuco, Ver. · DGETI
                </p>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
