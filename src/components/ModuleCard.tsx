import React from 'react';
import { 
  Sparkles, 
  Variable, 
  Divide, 
  Equal, 
  Compass, 
  Triangle, 
  Infinity as InfinityIcon,
  BookOpen, 
  Play, 
  CheckCircle2, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { MathModule, ModuleProgress } from '../types';
import { soundEngine } from '../utils/audio';

interface ModuleCardProps {
  module: MathModule;
  progress?: ModuleProgress;
  onOpenFormulas: (module: MathModule) => void;
  onStartPractice: (module: MathModule, level?: 1 | 2 | 3) => void;
  onOpenTutorial?: (moduleId: 'algebra-basica' | 'trigonometria' | 'calculo') => void;
  onOpenMultiplicationTables?: () => void;
  onOpenBasicOperations?: () => void;
  className?: string;
  isFeatured?: boolean;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  progress,
  onOpenFormulas,
  onStartPractice,
  onOpenTutorial,
  onOpenMultiplicationTables,
  onOpenBasicOperations,
  className = '',
  isFeatured = false,
}) => {
  const completedLevels = progress?.completedLevels || [];
  const percentComplete = Math.round((completedLevels.length / module.totalLevels) * 100);
  const isFullyMastered = completedLevels.length >= module.totalLevels;

  const hasInteractiveTutorial = ['algebra-basica', 'trigonometria', 'calculo'].includes(module.id);

  // Module color theme configuration with distinct aqua-infused palettes for every section
  const getThemeColors = () => {
    switch (module.id) {
      case 'base-cero':
        return {
          cardBg: 'bg-gradient-to-br from-emerald-100/70 via-teal-50/50 to-white/95 border-emerald-300/90 hover:border-emerald-500 shadow-[0_12px_35px_rgba(16,185,129,0.12)]',
          bgBadge: 'bg-emerald-100/90 border border-emerald-300 text-emerald-800',
          textBadge: 'text-emerald-900',
          iconBox: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20',
          titleHover: 'group-hover:text-emerald-600',
          subtitle: 'text-emerald-800',
          progressBar: 'bg-gradient-to-r from-emerald-400 to-teal-400',
          levelActive: 'bg-emerald-100 border-emerald-300 text-emerald-900 shadow-sm',
          btnPractice: 'bg-emerald-400 hover:bg-emerald-300 border-emerald-600 text-slate-950 shadow-[0_5px_0_#059669,0_0_20px_rgba(16,185,129,0.4)]',
          symbol: '0',
        };
      case 'algebra-basica':
        return {
          cardBg: 'bg-gradient-to-br from-cyan-100/70 via-sky-50/50 to-white/95 border-cyan-300/90 hover:border-cyan-500 shadow-[0_12px_35px_rgba(6,182,212,0.14)]',
          bgBadge: 'bg-cyan-100/90 border border-cyan-300 text-cyan-800',
          textBadge: 'text-cyan-900',
          iconBox: 'bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20',
          titleHover: 'group-hover:text-cyan-600',
          subtitle: 'text-cyan-800',
          progressBar: 'bg-gradient-to-r from-cyan-400 to-blue-400',
          levelActive: 'bg-cyan-100 border-cyan-300 text-cyan-900 shadow-sm',
          btnPractice: 'bg-cyan-400 hover:bg-cyan-300 border-cyan-600 text-slate-950 shadow-[0_5px_0_#0891b2,0_0_20px_rgba(6,182,212,0.45)]',
          symbol: 'x²',
        };
      case 'fracciones':
        return {
          cardBg: 'bg-gradient-to-br from-sky-100/70 via-indigo-50/50 to-white/95 border-indigo-300/90 hover:border-indigo-500 shadow-[0_12px_35px_rgba(99,102,241,0.12)]',
          bgBadge: 'bg-indigo-100/90 border border-indigo-300 text-indigo-800',
          textBadge: 'text-indigo-900',
          iconBox: 'bg-gradient-to-br from-sky-400 to-indigo-500 text-slate-950 shadow-md shadow-indigo-500/20',
          titleHover: 'group-hover:text-indigo-600',
          subtitle: 'text-indigo-800',
          progressBar: 'bg-gradient-to-r from-sky-400 to-indigo-400',
          levelActive: 'bg-indigo-100 border-indigo-300 text-indigo-900 shadow-sm',
          btnPractice: 'bg-indigo-400 hover:bg-indigo-300 border-indigo-600 text-slate-950 shadow-[0_5px_0_#4f46e5,0_0_20px_rgba(99,102,241,0.4)]',
          symbol: '½',
        };
      case 'ecuaciones':
        return {
          cardBg: 'bg-gradient-to-br from-purple-100/70 via-violet-50/50 to-white/95 border-purple-300/90 hover:border-purple-500 shadow-[0_12px_35px_rgba(168,85,247,0.12)]',
          bgBadge: 'bg-purple-100/90 border border-purple-300 text-purple-800',
          textBadge: 'text-purple-900',
          iconBox: 'bg-gradient-to-br from-purple-400 to-violet-500 text-slate-950 shadow-md shadow-purple-500/20',
          titleHover: 'group-hover:text-purple-600',
          subtitle: 'text-purple-800',
          progressBar: 'bg-gradient-to-r from-purple-400 to-violet-400',
          levelActive: 'bg-purple-100 border-purple-300 text-purple-900 shadow-sm',
          btnPractice: 'bg-purple-400 hover:bg-purple-300 border-purple-600 text-slate-950 shadow-[0_5px_0_#9333ea,0_0_20px_rgba(168,85,247,0.4)]',
          symbol: 'x=y',
        };
      case 'geometria-analitica':
        return {
          cardBg: 'bg-gradient-to-br from-pink-100/70 via-rose-50/50 to-white/95 border-pink-300/90 hover:border-pink-500 shadow-[0_12px_35px_rgba(244,63,94,0.12)]',
          bgBadge: 'bg-pink-100/90 border border-pink-300 text-pink-800',
          textBadge: 'text-pink-900',
          iconBox: 'bg-gradient-to-br from-pink-400 to-rose-500 text-slate-950 shadow-md shadow-pink-500/20',
          titleHover: 'group-hover:text-pink-600',
          subtitle: 'text-pink-800',
          progressBar: 'bg-gradient-to-r from-pink-400 to-rose-400',
          levelActive: 'bg-pink-100 border-pink-300 text-pink-900 shadow-sm',
          btnPractice: 'bg-pink-400 hover:bg-pink-300 border-pink-600 text-slate-950 shadow-[0_5px_0_#db2777,0_0_20px_rgba(244,63,94,0.4)]',
          symbol: '📐',
        };
      case 'trigonometria':
        return {
          cardBg: 'bg-gradient-to-br from-amber-100/70 via-orange-50/50 to-white/95 border-amber-300/90 hover:border-amber-500 shadow-[0_12px_35px_rgba(245,158,11,0.14)]',
          bgBadge: 'bg-amber-100/90 border border-amber-300 text-amber-900',
          textBadge: 'text-amber-950',
          iconBox: 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20',
          titleHover: 'group-hover:text-amber-600',
          subtitle: 'text-amber-900',
          progressBar: 'bg-gradient-to-r from-amber-400 to-orange-400',
          levelActive: 'bg-amber-100 border-amber-300 text-amber-950 shadow-sm',
          btnPractice: 'bg-amber-400 hover:bg-amber-300 border-amber-600 text-slate-950 shadow-[0_5px_0_#d97706,0_0_20px_rgba(245,158,11,0.45)]',
          symbol: 'sin θ',
        };
      case 'calculo':
      default:
        return {
          cardBg: 'bg-gradient-to-br from-teal-100/70 via-cyan-50/50 to-white/95 border-teal-300/90 hover:border-teal-500 shadow-[0_12px_35px_rgba(20,184,166,0.14)]',
          bgBadge: 'bg-teal-100/90 border border-teal-300 text-teal-900',
          textBadge: 'text-teal-950',
          iconBox: 'bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 shadow-md shadow-teal-500/20',
          titleHover: 'group-hover:text-teal-600',
          subtitle: 'text-teal-900',
          progressBar: 'bg-gradient-to-r from-teal-400 to-cyan-400',
          levelActive: 'bg-teal-100 border-teal-300 text-teal-950 shadow-sm',
          btnPractice: 'bg-teal-400 hover:bg-teal-300 border-teal-600 text-slate-950 shadow-[0_5px_0_#0d9488,0_0_20px_rgba(20,184,166,0.45)]',
          symbol: 'dy/dx',
        };
    }
  };

  const theme = getThemeColors();

  // Icon mapping
  const renderIcon = () => {
    const props = { className: 'w-6 h-6 text-slate-950' };
    switch (module.iconName) {
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Variable': return <Variable {...props} />;
      case 'Divide': return <Divide {...props} />;
      case 'Equal': return <Equal {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Triangle': return <Triangle {...props} />;
      case 'Infinity': return <InfinityIcon {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <div 
      id={`module-card-${module.id}`}
      className={`group relative flex flex-col justify-between rounded-[28px] sm:rounded-[32px] p-4 sm:p-6 border transition-all ${theme.cardBg} ${
        isFeatured ? 'ring-2 ring-cyan-400 shadow-[0_20px_50px_rgba(6,182,212,0.2)]' : ''
      } ${className}`}
    >
      {/* Top Header Row: Icon, Tag, Mastery Status */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            <div className={`relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-2xl ${theme.iconBox} font-black text-base group-hover:scale-105 transition-transform shrink-0`}>
              {renderIcon()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`text-[9px] sm:text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full ${theme.bgBadge}`}>
                  {module.tag}
                </span>
                {hasInteractiveTutorial && (
                  <span className="text-[9px] font-black tracking-wider uppercase text-indigo-800 bg-indigo-100/90 border border-indigo-300 px-2 py-0.5 rounded-full">
                    Tutorial Paso a Paso
                  </span>
                )}
              </div>
              <h3 className={`text-lg sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight transition-colors ${theme.titleHover}`}>
                {module.title}
              </h3>
            </div>
          </div>

          {/* Mastered Badge */}
          {isFullyMastered && (
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-black text-amber-900 bg-amber-200/90 border border-amber-400 px-2 py-0.5 sm:py-1 rounded-full shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="hidden sm:inline">Maestría</span>
            </div>
          )}
        </div>

        {/* Subtitle & Description */}
        <p className={`text-xs font-bold mb-1 ${theme.subtitle}`}>
          {module.subtitle}
        </p>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 font-medium">
          {module.description}
        </p>
      </div>

      {/* Center: Level Progress Trackers */}
      <div className="my-2 pt-3 border-t border-slate-300/60">
        <div className="flex items-center justify-between text-[11px] mb-2 font-semibold">
          <span className="text-slate-600">Niveles Superados:</span>
          <span className={`font-black ${theme.subtitle}`}>
            {completedLevels.length}/{module.totalLevels} ({percentComplete}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full bg-slate-200/90 rounded-full h-2 overflow-hidden mb-3">
          <div 
            className={`h-full rounded-full transition-all duration-500 shadow-sm ${theme.progressBar}`}
            style={{ width: `${percentComplete}%` }}
          />
        </div>

        {/* Level Clickable Selectors */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {[1, 2, 3].map((lvl) => {
            const isCompleted = completedLevels.includes(lvl);
            return (
              <button
                key={lvl}
                onClick={() => {
                  soundEngine.playClick();
                  onStartPractice(module, lvl as 1 | 2 | 3);
                }}
                className={`py-1.5 px-1 sm:px-2 rounded-xl text-[10px] sm:text-[11px] font-extrabold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                  isCompleted
                    ? theme.levelActive
                    : 'bg-white/90 border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 hover:bg-white'
                }`}
                title={`Practicar Nivel ${lvl}`}
              >
                {isCompleted ? <CheckCircle2 className="w-3 h-3 text-slate-900 shrink-0" /> : null}
                <span>Nvl {lvl}</span>
              </button>
            );
          })}
        </div>

        {/* Optional Interactive Tutorial Trigger for Algebra, Trigo & Calculus */}
        {hasInteractiveTutorial && onOpenTutorial && (
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenTutorial(module.id as any);
            }}
            className="w-full mb-3 py-1.5 px-3 rounded-xl bg-indigo-100/80 hover:bg-indigo-200/90 border border-indigo-300 text-indigo-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-700" />
            <span>Ver Tutorial Interactivo</span>
          </button>
        )}

        {/* Fase Cero Specific Quick Access Buttons */}
        {module.id === 'base-cero' && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {onOpenMultiplicationTables && (
              <button
                id="card-btn-tablas"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenMultiplicationTables();
                }}
                className="py-1.5 px-2 rounded-xl bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 text-emerald-950 text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <span>✖️ Tablas 2-12</span>
              </button>
            )}
            {onOpenBasicOperations && (
              <button
                id="card-btn-operaciones"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenBasicOperations();
                }}
                className="py-1.5 px-2 rounded-xl bg-teal-100/90 hover:bg-teal-200 border border-teal-300 text-teal-950 text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <span>⏱️ Test 20 Ops</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom: Bento Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Button 1: Reglas y Fórmulas */}
        <button
          id={`btn-rules-${module.id}`}
          onClick={() => {
            soundEngine.playClick();
            onOpenFormulas(module);
          }}
          className="bg-white/95 hover:bg-white border border-slate-300 hover:border-slate-400 py-2.5 px-2 rounded-2xl flex items-center justify-center gap-1 text-xs font-black text-slate-800 shadow-sm transition-all cursor-pointer group/btn"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-600 group-hover/btn:text-slate-900 transition-colors" />
          <span className="truncate">Fórmulas</span>
        </button>

        {/* Button 2: Practicar Ejercicios (Themed Neon Button) */}
        <button
          id={`btn-practice-${module.id}`}
          onClick={() => {
            soundEngine.playClick();
            onStartPractice(module);
          }}
          className={`py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1 text-xs uppercase font-black tracking-wider transition-all cursor-pointer group/play ${theme.btnPractice}`}
        >
          <Play className="w-3 h-3 fill-slate-950 group-hover/play:scale-110 transition-transform shrink-0" />
          <span className="truncate">Practicar</span>
          <ChevronRight className="w-3 h-3 text-slate-950/70 shrink-0" />
        </button>
      </div>
    </div>
  );
};
