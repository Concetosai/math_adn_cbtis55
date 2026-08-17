import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Target, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  BrainCircuit,
  Timer,
  GraduationCap,
  Award,
  Map,
  Compass,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';
import { UserProgress, MathModule } from '../types';
import { MATH_MODULES } from '../data/mathModules';
import { soundEngine } from '../utils/audio';

interface StatsDashboardProps {
  progress: UserProgress;
  onSelectModuleForPractice: (module: MathModule) => void;
  onOpenMedals: () => void;
  onOpenTimedChallenge: () => void;
  onOpenTutorials: (moduleId?: 'algebra-basica' | 'trigonometria' | 'calculo') => void;
  onOpenMultiplicationTables: () => void;
  onOpenBasicOperations: () => void;
  onOpenRoadmap?: () => void;
  isSection1Open?: boolean;
  onToggleSection1?: () => void;
  isSection2Open?: boolean;
  onToggleSection2?: () => void;
  onExpandAllSections?: () => void;
  onCollapseAllSections?: () => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  progress,
  onSelectModuleForPractice,
  onOpenMedals,
  onOpenTimedChallenge,
  onOpenTutorials,
  onOpenMultiplicationTables,
  onOpenBasicOperations,
  onOpenRoadmap,
  isSection1Open: controlledSection1Open,
  onToggleSection1: controlledToggleSection1,
  isSection2Open: controlledSection2Open,
  onToggleSection2: controlledToggleSection2,
  onExpandAllSections,
  onCollapseAllSections,
}) => {
  const [isHeroCollapsed, setIsHeroCollapsed] = React.useState(false);
  const [internalSection1Open, setInternalSection1Open] = React.useState(false);
  const [internalSection2Open, setInternalSection2Open] = React.useState(false);

  // Use controlled or internal state (default false = closed)
  const isSection1Open = controlledSection1Open !== undefined ? controlledSection1Open : internalSection1Open;
  const isSection2Open = controlledSection2Open !== undefined ? controlledSection2Open : internalSection2Open;

  const toggleSection1 = () => {
    soundEngine.playClick();
    if (controlledToggleSection1) {
      controlledToggleSection1();
    } else {
      setInternalSection1Open(!internalSection1Open);
    }
  };

  const toggleSection2 = () => {
    soundEngine.playClick();
    if (controlledToggleSection2) {
      controlledToggleSection2();
    } else {
      setInternalSection2Open(!internalSection2Open);
    }
  };

  const accuracy = progress.totalSolved > 0 
    ? Math.round((progress.totalCorrect / progress.totalSolved) * 100) 
    : 100;

  // Calculate total completed levels
  let totalMasteredLevels = 0;
  const totalPossibleLevels = MATH_MODULES.reduce((acc, m) => acc + m.totalLevels, 0); // 7 * 3 = 21

  MATH_MODULES.forEach((mod) => {
    const p = progress.moduleProgress[mod.id];
    if (p && p.completedLevels) {
      totalMasteredLevels += p.completedLevels.length;
    }
  });

  const totalProgressPercent = Math.round((totalMasteredLevels / totalPossibleLevels) * 100);

  // Suggest next module to practice
  const nextRecommendedModule = MATH_MODULES.find((m) => {
    const p = progress.moduleProgress[m.id];
    return !p || p.completedLevels.length < m.totalLevels;
  }) || MATH_MODULES[0];

  const bestScore60 = progress.timedChallengeHighScores?.[60] || 0;
  const completedTutsCount = progress.completedTutorialIds?.length || 0;
  const completedTablesCount = progress.completedTables?.length || 0;
  const completedBasicOpCount = progress.completedBasicOpLevels?.length || 0;

  return (
    <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
      
      {/* Top Bento Banner: Motivation & Quick Practice CTA */}
      <div className="relative rounded-2xl sm:rounded-[32px] glass p-3.5 sm:p-7 lg:p-8 deep-shadow border border-white/80 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-cyan-700 bg-cyan-100 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-cyan-200 flex items-center gap-1.5 shadow-sm">
                <BrainCircuit className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                SISTEMA ADN • BENTO GRID
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400">Entrenamiento Activo</span>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                setIsHeroCollapsed(!isHeroCollapsed);
              }}
              className="text-[10px] sm:text-xs font-bold text-slate-500 hover:text-cyan-700 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-white/60 transition-colors cursor-pointer"
            >
              {isHeroCollapsed ? (
                <>
                  <span>Mostrar Banner</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Compactar</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {!isHeroCollapsed ? (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-6 mt-1">
              <div className="max-w-xl">
                <h1 className="text-lg sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Domina las <span className="text-cyan-500">Matemáticas</span> con Precisión y Rigor
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2 leading-relaxed font-medium">
                  Despliega las secciones en cascada para explorar: <strong>Sección 1</strong> (Fase Cero), <strong>Sección 2</strong> (Modo Rápido y Métricas) y <strong>Sección 3</strong> (Módulos Troncales).
                </p>
              </div>

              {/* Action CTA Buttons: Mapa Global & Practicar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 shrink-0">
                {onOpenRoadmap && (
                  <button
                    id="btn-hero-open-roadmap"
                    onClick={() => {
                      soundEngine.playClick();
                      onOpenRoadmap();
                    }}
                    className="py-2.5 px-3.5 sm:py-3 sm:px-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-850 hover:to-slate-750 text-cyan-300 hover:text-cyan-200 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/20 border border-cyan-500/40 transition-all cursor-pointer group active:scale-95"
                  >
                    <Map className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Ver Mapa Global & Ruta</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}

                <button
                  id="btn-hero-quick-practice"
                  onClick={() => {
                    soundEngine.playClick();
                    onSelectModuleForPractice(nextRecommendedModule);
                  }}
                  className="py-2.5 px-3.5 sm:py-3 sm:px-5 rounded-xl sm:rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/30 transition-all cursor-pointer active:scale-95 border border-cyan-500"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Practicar Módulo</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-xs sm:text-sm font-black text-slate-800 truncate">
                Ruta Pedagógica · Domina las Matemáticas CBTIS 55
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {onOpenRoadmap && (
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      onOpenRoadmap();
                    }}
                    className="py-1.5 px-2.5 rounded-lg bg-slate-900 text-cyan-300 font-black text-[11px] flex items-center gap-1 hover:bg-slate-800 cursor-pointer"
                  >
                    <Map className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Mapa Global</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onSelectModuleForPractice(nextRecommendedModule);
                  }}
                  className="py-1.5 px-2.5 rounded-lg bg-cyan-400 text-slate-950 font-black text-[11px] flex items-center gap-1 hover:bg-cyan-300 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Practicar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Quick Accordion Controls Toolbar */}
      {(onExpandAllSections || onCollapseAllSections) && (
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-600" />
            Menú de Secciones en Cascada
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                if (onExpandAllSections) onExpandAllSections();
              }}
              className="text-[10px] sm:text-xs font-bold text-cyan-700 hover:text-cyan-800 bg-cyan-50 hover:bg-cyan-100 px-2.5 py-1 rounded-lg border border-cyan-200 transition-colors cursor-pointer"
            >
              Expandir Todo
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                if (onCollapseAllSections) onCollapseAllSections();
              }}
              className="text-[10px] sm:text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              Cerrar Todo
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 1: FASE CERO · PRIMERAS SECCIONES OBLIGATORIAS (ACORDEÓN)       */}
      {/* ========================================================================= */}
      <div className="rounded-2xl sm:rounded-[28px] bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border-2 border-emerald-300/80 shadow-md overflow-hidden transition-all">
        
        {/* Accordion Header */}
        <button
          onClick={toggleSection1}
          className="w-full p-3.5 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-emerald-100/40 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <span className="text-base sm:text-lg">01</span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-200/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Sección 1
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                  Fase Cero · Primeras Secciones Obligatorias
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-1 font-medium">
                Garantiza tu preparación: Tablas de Multiplicar (2 al 12) y Test de 20 Operaciones Básicas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:inline-flex text-[10px] font-extrabold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
              {completedTablesCount}/11 Tablas · {completedBasicOpCount}/3 Niveles
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center border border-emerald-300 transition-transform">
              {isSection1Open ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>
        </button>

        {/* Collapsible Content */}
        {isSection1Open && (
          <div className="p-3.5 sm:p-6 pt-0 border-t border-emerald-200/60 mt-1 space-y-3">
            <div className="text-xs text-slate-500 font-semibold pt-3 pb-1">
              Garantiza tu preparación para todas las funciones y secciones de la app
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tile 1: Tablas de Multiplicar 2 al 12 */}
              <div
                id="tile-fase-cero-tablas"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenMultiplicationTables();
                }}
                className="p-5 rounded-[22px] bg-gradient-to-br from-emerald-100/90 via-teal-50/50 to-white border-2 border-emerald-300 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
                        <span className="text-lg">✖️</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black tracking-wider text-emerald-900 bg-emerald-200/90 px-2 py-0.5 rounded-full border border-emerald-300">
                          Sección 1
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                          Tablas de Multiplicar (2 al 12)
                        </h3>
                      </div>
                    </div>
                    {completedTablesCount > 0 && (
                      <span className="text-xs font-black text-emerald-950 bg-emerald-200 px-2.5 py-1 rounded-xl border border-emerald-300 shadow-sm">
                        {completedTablesCount}/11 Tablas
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Explora el modo estudio visual con trucos nemotécnicos de cálculo rápido y resuelve ejercicios prácticos del 2 al 12.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200/70 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Estudio, Matriz & Ejercicios
                  </span>
                  <button className="py-2 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm transition-all border border-emerald-500">
                    <span>Abrir Tablas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tile 2: Operaciones Básicas (3 Niveles con Cronómetro) */}
              <div
                id="tile-fase-cero-operaciones"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenBasicOperations();
                }}
                className="p-5 rounded-[22px] bg-gradient-to-br from-cyan-100/90 via-sky-50/50 to-white border-2 border-cyan-300 hover:border-cyan-500 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
                        <span className="text-lg">⏱️</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black tracking-wider text-cyan-900 bg-cyan-200/90 px-2 py-0.5 rounded-full border border-cyan-300">
                          Sección 2 · Test de 20 Ejercicios
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                          Práctica: Operaciones Básicas
                        </h3>
                      </div>
                    </div>
                    {completedBasicOpCount > 0 && (
                      <span className="text-xs font-black text-cyan-950 bg-cyan-200 px-2.5 py-1 rounded-xl border border-cyan-300 shadow-sm">
                        {completedBasicOpCount}/3 Niveles
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    3 niveles de dificultad mezclando las 4 operaciones (+, -, ×, ÷). Nivel 1 y 2 de 2 dígitos, y Nivel 3 de 3 dígitos con cronómetro.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-cyan-200/70 flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" /> 20 Ejercicios + Cronómetro
                  </span>
                  <button className="py-2 px-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm transition-all border border-cyan-500">
                    <span>Iniciar Test</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN 2: MODO RÁPIDO, TUTORIALES & RENDIMIENTO (ACORDEÓN)              */}
      {/* ========================================================================= */}
      <div className="rounded-2xl sm:rounded-[28px] bg-gradient-to-br from-amber-50/90 via-indigo-50/40 to-white border-2 border-amber-300/80 shadow-md overflow-hidden transition-all">
        
        {/* Accordion Header */}
        <button
          onClick={toggleSection2}
          className="w-full p-3.5 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-amber-100/40 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <span className="text-base sm:text-lg">02</span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/90 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Sección 2
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                  Modo Rápido, Tutoriales & Rendimiento
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-1 font-medium">
                Desafíos contrarreloj, lecciones interactivas paso a paso y métricas (XP, Precisión, Racha).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:inline-flex text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
              {progress.xp.toLocaleString()} XP · {accuracy}% Precisión · {progress.streakDays}d Racha
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300 transition-transform">
              {isSection2Open ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>
        </button>

        {/* Collapsible Content */}
        {isSection2Open && (
          <div className="p-3.5 sm:p-6 pt-0 border-t border-amber-200/60 mt-1 space-y-4">
            
            {/* Feature Bento Tiles: Timed Challenge + Interactive Tutorials Promo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 pt-3">
              {/* Banner 1: Desafío Cronometrado */}
              <div 
                onClick={() => {
                  soundEngine.playClick();
                  onOpenTimedChallenge();
                }}
                className="p-4 sm:p-5 rounded-[22px] bg-gradient-to-br from-amber-100/90 via-orange-50/50 to-white border-2 border-amber-300 hover:border-amber-500 transition-all shadow-md hover:shadow-xl cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0 group-hover:scale-105 transition-transform">
                    <Timer className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-black tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300">
                      Modo Rápido
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1 truncate">
                      Desafío Cronometrado
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-1 font-medium">
                      {bestScore60 > 0 ? `Récord 60s: ${bestScore60} pts` : 'Resuelve contrarreloj y escala en la clasificación'}
                    </p>
                  </div>
                </div>
                <button className="p-2.5 rounded-xl bg-amber-400 text-slate-950 group-hover:bg-amber-300 transition-colors shadow-sm shrink-0 border border-amber-500">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Banner 2: Tutoriales Interactivos */}
              <div 
                onClick={() => {
                  soundEngine.playClick();
                  onOpenTutorials('algebra-basica');
                }}
                className="p-4 sm:p-5 rounded-[22px] bg-gradient-to-br from-indigo-100/90 via-purple-50/50 to-white border-2 border-indigo-300 hover:border-indigo-500 transition-all shadow-md hover:shadow-xl cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-black tracking-wider text-indigo-900 bg-indigo-200 px-2 py-0.5 rounded-full border border-indigo-300">
                      Paso a Paso
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1 truncate">
                      Tutoriales Interactivos
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-1 font-medium">
                      {completedTutsCount > 0 ? `${completedTutsCount} lecciones completadas` : 'Laboratorio visual para Álgebra, Trigo y Cálculo'}
                    </p>
                  </div>
                </div>
                <button className="p-2.5 rounded-xl bg-indigo-400 text-slate-950 group-hover:bg-indigo-300 transition-colors shadow-sm shrink-0 border border-indigo-500">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4 Stats Cards Bento Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Card 1: Total XP */}
              <div className="p-4 rounded-[22px] bg-gradient-to-br from-cyan-100/80 to-white/95 border border-cyan-300/80 shadow-md flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-400 text-slate-950 shadow-sm shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-cyan-900 font-extrabold uppercase tracking-wider truncate">XP Total</p>
                  <p className="text-base sm:text-xl font-black text-slate-900 truncate">
                    {progress.xp.toLocaleString()} <span className="text-[10px] text-cyan-700 font-bold">XP</span>
                  </p>
                </div>
              </div>

              {/* Card 2: Precision */}
              <div className="p-4 rounded-[22px] bg-gradient-to-br from-emerald-100/80 to-white/95 border border-emerald-300/80 shadow-md flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-400 text-slate-950 shadow-sm shrink-0">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-emerald-900 font-extrabold uppercase tracking-wider truncate">Precisión</p>
                  <p className="text-base sm:text-xl font-black text-slate-900 truncate">
                    {accuracy}% <span className="text-[10px] text-slate-500 font-semibold hidden sm:inline">({progress.totalCorrect}/{progress.totalSolved})</span>
                  </p>
                </div>
              </div>

              {/* Card 3: Streak */}
              <div className="p-4 rounded-[22px] bg-gradient-to-br from-amber-100/80 to-white/95 border border-amber-300/80 shadow-md flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 shadow-sm shrink-0">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-amber-900 font-extrabold uppercase tracking-wider truncate">Racha</p>
                  <p className="text-base sm:text-xl font-black text-slate-900 truncate">
                    {progress.streakDays} {progress.streakDays === 1 ? 'Día' : 'Días'}
                  </p>
                </div>
              </div>

              {/* Card 4: Mastered Levels & Medals */}
              <div 
                onClick={() => {
                  soundEngine.playClick();
                  onOpenMedals();
                }}
                className="p-4 rounded-[22px] bg-gradient-to-br from-purple-100/80 to-white/95 border border-purple-300/80 shadow-md flex items-center gap-3 hover:border-purple-500 transition-all cursor-pointer group"
              >
                <div className="p-2.5 rounded-xl bg-purple-400 text-slate-950 group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-purple-900 font-extrabold uppercase tracking-wider truncate">Niveles</p>
                  <p className="text-base sm:text-xl font-black text-slate-900 truncate">
                    {totalMasteredLevels}/{totalPossibleLevels} <span className="text-[10px] text-purple-800 font-bold">({totalProgressPercent}%)</span>
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

