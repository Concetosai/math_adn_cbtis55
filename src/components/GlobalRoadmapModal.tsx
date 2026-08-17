import React, { useEffect, useState } from 'react';
import { 
  X, 
  Map, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Play, 
  GraduationCap, 
  Timer, 
  Bot, 
  Trophy,
  Flame,
  Volume2,
  Compass,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { MathModule, UserProgress } from '../types';
import { MATH_MODULES } from '../data/mathModules';
import { soundEngine } from '../utils/audio';

interface GlobalRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onOpenMultiplicationTables: () => void;
  onOpenBasicOperations: (level?: 1 | 2 | 3) => void;
  onSelectModule: (module: MathModule, level?: 1 | 2 | 3) => void;
  onOpenTutorial: (moduleId: 'algebra-basica' | 'trigonometria' | 'calculo') => void;
  onOpenTimedChallenge: () => void;
  onOpenFormulas: (module?: MathModule) => void;
  onOpenMedals: () => void;
  onOpenVoiceTutor: () => void;
}

interface ModuleColorTheme {
  cardBg: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  titleColor: string;
  subtitleColor: string;
  playBtnBg: string;
  playBtnText: string;
  progressBadgeBg: string;
  progressBadgeText: string;
}

const MODULE_THEMES: Record<string, ModuleColorTheme> = {
  'base-cero': {
    cardBg: 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-emerald-950/40',
    borderColor: 'border-emerald-500/50 hover:border-emerald-400 shadow-emerald-950/40',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/40',
    titleColor: 'text-white group-hover:text-emerald-300',
    subtitleColor: 'text-emerald-400',
    playBtnBg: 'bg-emerald-400 hover:bg-emerald-300',
    playBtnText: 'text-slate-950',
    progressBadgeBg: 'bg-emerald-950/80 border border-emerald-500/40',
    progressBadgeText: 'text-emerald-300',
  },
  'algebra-basica': {
    cardBg: 'bg-gradient-to-br from-cyan-950/80 via-slate-900 to-sky-950/40',
    borderColor: 'border-cyan-500/50 hover:border-cyan-400 shadow-cyan-950/40',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/40',
    titleColor: 'text-white group-hover:text-cyan-300',
    subtitleColor: 'text-cyan-400',
    playBtnBg: 'bg-cyan-400 hover:bg-cyan-300',
    playBtnText: 'text-slate-950',
    progressBadgeBg: 'bg-cyan-950/80 border border-cyan-500/40',
    progressBadgeText: 'text-cyan-300',
  },
  'fracciones': {
    cardBg: 'bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950/40',
    borderColor: 'border-blue-500/50 hover:border-blue-400 shadow-blue-950/40',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-500/40',
    titleColor: 'text-white group-hover:text-blue-300',
    subtitleColor: 'text-blue-300',
    playBtnBg: 'bg-blue-400 hover:bg-blue-300',
    playBtnText: 'text-slate-950',
    progressBadgeBg: 'bg-blue-950/80 border border-blue-500/40',
    progressBadgeText: 'text-blue-300',
  },
  'ecuaciones': {
    cardBg: 'bg-gradient-to-br from-purple-950/80 via-slate-900 to-fuchsia-950/40',
    borderColor: 'border-purple-500/50 hover:border-purple-400 shadow-purple-950/40',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/40',
    titleColor: 'text-white group-hover:text-purple-300',
    subtitleColor: 'text-purple-300',
    playBtnBg: 'bg-purple-400 hover:bg-purple-300',
    playBtnText: 'text-slate-950',
    progressBadgeBg: 'bg-purple-950/80 border border-purple-500/40',
    progressBadgeText: 'text-purple-300',
  },
  'geometria-analitica': {
    cardBg: 'bg-gradient-to-br from-rose-950/80 via-slate-900 to-pink-950/40',
    borderColor: 'border-rose-500/50 hover:border-rose-400 shadow-rose-950/40',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/40',
    titleColor: 'text-white group-hover:text-rose-300',
    subtitleColor: 'text-rose-300',
    playBtnBg: 'bg-rose-400 hover:bg-rose-300',
    playBtnText: 'text-slate-950',
    progressBadgeBg: 'bg-rose-950/80 border border-rose-500/40',
    progressBadgeText: 'text-rose-300',
  },
  'trigonometria': {
    cardBg: 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-orange-950/40',
    borderColor: 'border-amber-500/50 hover:border-amber-400 shadow-amber-950/40',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/40',
    titleColor: 'text-white group-hover:text-amber-300',
    subtitleColor: 'text-amber-300',
    playBtnBg: 'bg-amber-400 hover:bg-amber-300',
    playBtnText: 'text-slate-950',
    progressBadgeBg: 'bg-amber-950/80 border border-amber-500/40',
    progressBadgeText: 'text-amber-300',
  },
  'calculo': {
    cardBg: 'bg-gradient-to-br from-teal-950/80 via-slate-900 to-cyan-950/40',
    borderColor: 'border-teal-500/50 hover:border-teal-400 shadow-teal-950/40',
    badgeBg: 'bg-teal-500/20',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-500/40',
    titleColor: 'text-white group-hover:text-teal-300',
    subtitleColor: 'text-teal-300',
    playBtnBg: 'bg-teal-400 hover:bg-teal-300',
    playBtnText: 'text-slate-950',
    progressBadgeBg: 'bg-teal-950/80 border border-teal-500/40',
    progressBadgeText: 'text-teal-300',
  }
};

export const GlobalRoadmapModal: React.FC<GlobalRoadmapModalProps> = ({
  isOpen,
  onClose,
  progress,
  onOpenMultiplicationTables,
  onOpenBasicOperations,
  onSelectModule,
  onOpenTutorial,
  onOpenTimedChallenge,
  onOpenFormulas,
  onOpenMedals,
  onOpenVoiceTutor,
}) => {
  const [showRecommendation, setShowRecommendation] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const completedTablesCount = progress.completedTables?.length || 0;
  const completedBasicOpCount = progress.completedBasicOpLevels?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="global-roadmap-modal-card"
        className="relative w-full max-w-4xl max-h-[96vh] sm:max-h-[92vh] flex flex-col rounded-2xl sm:rounded-[32px] bg-slate-900 border border-cyan-400/50 sm:border-2 sm:border-cyan-400/60 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-slate-100 overflow-hidden"
      >
        {/* Top Header Bar - Ultra compact on mobile */}
        <div className="py-2.5 px-3 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-cyan-500/30 flex items-center justify-between gap-2 sm:gap-4 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-400 to-cyan-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Map className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] sm:text-xs font-black uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/40 truncate">
                  Ruta CBTIS 55
                </span>
                <span className="text-[9px] text-slate-400 font-bold hidden md:inline">
                  Planteamiento Integral
                </span>
              </div>
              <h2 className="text-xs sm:text-lg font-black text-white tracking-tight truncate">
                Domina las Matemáticas con <span className="text-cyan-400">Precisión y Rigor</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Toggle advice banner button */}
            <button
              id="btn-toggle-roadmap-advice"
              onClick={() => {
                soundEngine.playClick();
                setShowRecommendation(!showRecommendation);
              }}
              className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-black flex items-center gap-1 border transition-all cursor-pointer ${
                showRecommendation 
                  ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title={showRecommendation ? 'Ocultar recomendación académica' : 'Mostrar recomendación académica'}
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">{showRecommendation ? 'Ocultar Consejo' : 'Ver Consejo'}</span>
            </button>

            {/* Close Button */}
            <button
              id="btn-close-roadmap"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 cursor-pointer"
              title="Cerrar Mapa Global (ESC)"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body - Contains recommendation inside so it scrolls smoothly */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar">
          
          {/* Informative Lead Banner (inside scroll body so it doesn't block screen) */}
          {showRecommendation && (
            <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-teal-950/80 border border-cyan-500/30 text-xs sm:text-sm text-cyan-100 flex items-start justify-between gap-3 shadow-md">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                <p className="font-semibold leading-relaxed text-[11px] sm:text-xs">
                  <strong className="text-cyan-300 font-extrabold">Recomendación Académica: </strong> 
                  Comienza con las secciones de <strong>Fase Cero</strong> (Tablas del 2 al 12 y Test de 20 Operaciones Básicas) para asegurar tu preparación en Álgebra, Geometría, Trigonometría y Cálculo.
                </p>
              </div>
              <button
                onClick={() => setShowRecommendation(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-white/10 shrink-0"
                title="Ocultar recomendación"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* SECTION 1: FASE CERO */}
          <div className="rounded-2xl sm:rounded-[28px] bg-slate-850/80 border-2 border-emerald-500/40 p-3.5 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-md">
                  0
                </span>
                <div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    Etapa Inicial Obligatoria
                  </span>
                  <h3 className="text-sm sm:text-xl font-black text-white">
                    Fase Cero: Cimientos del Cálculo y Agilidad Mental
                  </h3>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl border border-emerald-500/40 shrink-0">
                {completedTablesCount + (completedBasicOpCount > 0 ? 1 : 0)} / 2 Listas
              </span>
            </div>

            <p className="text-[11px] sm:text-sm text-slate-300 leading-relaxed mb-3 sm:mb-4">
              Antes de abordar fórmulas algebraicas complejas, consolida la aritmética base, la memorización relacional de tablas y el cálculo rápido con operaciones de 2 y 3 dígitos contra reloj.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Tile 1: Tablas (Emerald / Mint Theme) */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950/60 border-2 border-emerald-400/60 hover:border-emerald-300 shadow-lg shadow-emerald-950/50 flex flex-col justify-between transition-all">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-emerald-400 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-sm">
                        ✕
                      </span>
                      <span className="text-xs font-black text-emerald-300">Sección 1 · Tablas de Multiplicar (2 al 12)</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      {completedTablesCount}/11 Listas
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-emerald-100/90 mb-2.5 sm:mb-3">
                    Modo estudio con trucos nemotécnicos de patrones numéricos, matriz visual pitagórica y evaluación interactiva por tabla.
                  </p>
                </div>
                <button
                  id="roadmap-btn-tablas"
                  onClick={() => {
                    soundEngine.playClick();
                    onClose();
                    onOpenMultiplicationTables();
                  }}
                  className="w-full py-2 sm:py-2.5 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <span>Explorar Tablas 2 al 12</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tile 2: Operaciones Básicas (Sky / Blue Theme) */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-950/90 via-slate-900 to-blue-950/60 border-2 border-sky-400/60 hover:border-sky-300 shadow-lg shadow-sky-950/50 flex flex-col justify-between transition-all">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-sky-400 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-sm">
                        ±
                      </span>
                      <span className="text-xs font-black text-sky-300">Sección 2 · Test de 20 Operaciones Básicas</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-sky-300 bg-sky-900/80 px-2 py-0.5 rounded-full border border-sky-500/40">
                      {completedBasicOpCount}/3 Niveles
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-sky-100/90 mb-2.5 sm:mb-3">
                    3 niveles de dificultad progresiva con sumas, restas, multiplicaciones y divisiones cronometradas de 2 y 3 dígitos.
                  </p>
                </div>
                <button
                  id="roadmap-btn-operaciones"
                  onClick={() => {
                    soundEngine.playClick();
                    onClose();
                    onOpenBasicOperations(1);
                  }}
                  className="w-full py-2 sm:py-2.5 px-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <span>Iniciar Test 20 Operaciones</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: 7 TRONCAL MATH MODULES */}
          <div className="rounded-2xl sm:rounded-[28px] bg-slate-850/80 border-2 border-cyan-500/40 p-3.5 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-md">
                  1-7
                </span>
                <div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-cyan-400">
                    Módulos Troncales
                  </span>
                  <h3 className="text-sm sm:text-xl font-black text-white">
                    ADN Matemático CBTIS 55: De Fundamentos a Cálculo
                  </h3>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl border border-cyan-500/40 shrink-0">
                7 Módulos
              </span>
            </div>

            <p className="text-[11px] sm:text-sm text-slate-300 leading-relaxed mb-3 sm:mb-4">
              Cada módulo contiene 3 niveles de ejercicios prácticos, formulario conceptual y retroalimentación socrática en tiempo real.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
              {MATH_MODULES.map((mod, index) => {
                const modProgress = progress.moduleProgress[mod.id];
                const completedCount = modProgress?.completedLevels?.length || 0;
                const hasTut = ['algebra-basica', 'trigonometria', 'calculo'].includes(mod.id);
                const theme = MODULE_THEMES[mod.id] || MODULE_THEMES['base-cero'];

                return (
                  <div 
                    key={mod.id}
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${theme.cardBg} border-2 ${theme.borderColor} transition-all flex flex-col justify-between group shadow-md`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-5 h-5 rounded-md ${theme.badgeBg} ${theme.badgeText} text-[10px] font-black flex items-center justify-center border ${theme.badgeBorder} shrink-0 shadow-sm`}>
                            {index + 1}
                          </span>
                          <h4 className={`text-xs sm:text-sm font-black ${theme.titleColor} transition-colors truncate`}>
                            {mod.title}
                          </h4>
                        </div>
                        <span className={`text-[9px] sm:text-[10px] font-black ${theme.progressBadgeBg} ${theme.progressBadgeText} px-2 py-0.5 rounded-full shrink-0`}>
                          {completedCount}/{mod.totalLevels} Niveles
                        </span>
                      </div>

                      <p className={`text-[10px] sm:text-[11px] font-bold ${theme.subtitleColor} mb-1`}>
                        {mod.subtitle}
                      </p>
                      <p className="text-[11px] text-slate-300/90 mb-2.5 line-clamp-2 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-slate-800/80">
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          onClose();
                          onSelectModule(mod, 1);
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-lg ${theme.playBtnBg} ${theme.playBtnText} font-black text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md active:scale-95`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Practicar</span>
                      </button>

                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          onClose();
                          onOpenFormulas(mod);
                        }}
                        className="py-1.5 px-2 rounded-lg bg-slate-800/90 hover:bg-slate-750 border border-slate-650 text-slate-200 font-bold text-[10px] sm:text-[11px] flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                        title="Ver Fórmulas del Módulo"
                      >
                        <BookOpen className="w-3 h-3 text-cyan-400" />
                        <span>Fórmulas</span>
                      </button>

                      {hasTut && (
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            onClose();
                            onOpenTutorial(mod.id as any);
                          }}
                          className="py-1.5 px-2 rounded-lg bg-indigo-950/80 hover:bg-indigo-900/90 border border-indigo-500/60 text-indigo-200 font-bold text-[10px] sm:text-[11px] flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                          title="Abrir Tutorial Interactivo Paso a Paso"
                        >
                          <GraduationCap className="w-3 h-3 text-indigo-300" />
                          <span>Tutorial</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: HERRAMIENTAS DE ALTO RENDIMIENTO & IA */}
          <div className="rounded-2xl sm:rounded-[28px] bg-slate-850/80 border-2 border-amber-500/40 p-3.5 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-md">
                  ⚡
                </span>
                <div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-400">
                    Potenciadores del Aprendizaje
                  </span>
                  <h3 className="text-sm sm:text-xl font-black text-white">
                    Herramientas de Alto Rendimiento, IA y Competencia
                  </h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {/* Tool 1: Contrarreloj */}
              <div 
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                  onOpenTimedChallenge();
                }}
                className="p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-950/70 via-slate-900 to-orange-950/40 border-2 border-amber-500/50 hover:border-amber-400 shadow-md transition-all cursor-pointer flex flex-col justify-between group active:scale-95"
              >
                <div>
                  <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mb-1.5" />
                  <h4 className="text-xs font-black text-white group-hover:text-amber-300">Contrarreloj</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-300/80 mt-0.5">Partidas de 60s, 120s y 180s.</p>
                </div>
                <span className="mt-2 text-[9px] sm:text-[10px] font-bold text-amber-400 flex items-center gap-1">
                  <span>Jugar</span> <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {/* Tool 2: Tutoriales */}
              <div 
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                  onOpenTutorial('algebra-basica');
                }}
                className="p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-purple-950/40 border-2 border-indigo-500/50 hover:border-indigo-400 shadow-md transition-all cursor-pointer flex flex-col justify-between group active:scale-95"
              >
                <div>
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 mb-1.5" />
                  <h4 className="text-xs font-black text-white group-hover:text-indigo-300">Tutoriales</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-300/80 mt-0.5">Laboratorios visuales interactivos.</p>
                </div>
                <span className="mt-2 text-[9px] sm:text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                  <span>Aprender</span> <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {/* Tool 3: Tutor IA */}
              <div 
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                  onOpenVoiceTutor();
                }}
                className="p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-950/70 via-slate-900 to-teal-950/40 border-2 border-cyan-500/50 hover:border-cyan-400 shadow-md transition-all cursor-pointer flex flex-col justify-between group active:scale-95"
              >
                <div>
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 mb-1.5" />
                  <h4 className="text-xs font-black text-white group-hover:text-cyan-300">Tutor de Voz</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-300/80 mt-0.5">Asistencia socrática con audio.</p>
                </div>
                <span className="mt-2 text-[9px] sm:text-[10px] font-bold text-cyan-400 flex items-center gap-1">
                  <span>Hablar</span> <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {/* Tool 4: Medallero */}
              <div 
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                  onOpenMedals();
                }}
                className="p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-950/70 via-slate-900 to-amber-950/40 border-2 border-yellow-500/50 hover:border-yellow-400 shadow-md transition-all cursor-pointer flex flex-col justify-between group active:scale-95"
              >
                <div>
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mb-1.5" />
                  <h4 className="text-xs font-black text-white group-hover:text-yellow-300">Medallero</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-300/80 mt-0.5">23 insignias y logros.</p>
                </div>
                <span className="mt-2 text-[9px] sm:text-[10px] font-bold text-yellow-400 flex items-center gap-1">
                  <span>Ver Logros</span> <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Footnote (inside scroll area) */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Sigue la secuencia de Fase Cero a Cálculo para maximizar tu puntaje en el CBTIS 55.</span>
          </div>

        </div>

        {/* Footer CTA - Ultra compact with hide/show toggle */}
        {showFooter ? (
          <div className="p-2 sm:p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowFooter(false);
              }}
              className="text-[10px] text-slate-500 hover:text-slate-300 px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              title="Ocultar barra inferior para ver más contenido"
            >
              <ChevronDown className="w-3 h-3" />
              <span className="hidden sm:inline">Ocultar Barra</span>
            </button>

            <button
              id="btn-roadmap-finish-bottom"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="px-4 py-2 sm:px-5 sm:py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5 ml-auto"
            >
              <span>Entendido, ir al Tablero</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="py-1 px-3 bg-slate-950/80 border-t border-slate-800/60 flex items-center justify-between shrink-0">
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowFooter(true);
              }}
              className="text-[9px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 py-0.5 cursor-pointer"
            >
              <ChevronUp className="w-3 h-3" />
              <span>Mostrar Barra Inferior</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="text-[9px] text-slate-400 hover:text-white font-bold py-0.5"
            >
              Cerrar (ESC)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

