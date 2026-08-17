import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trophy, 
  Award, 
  Lock, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Sparkles, 
  Share2,
  Crown,
  Check,
  Timer,
  BookOpen,
  Compass,
  Triangle,
  Activity,
  Infinity as InfinityIcon,
  Divide,
  Equal,
  Variable
} from 'lucide-react';
import { Medal, UserProgress, MedalCategory } from '../types';
import { INITIAL_MEDALS } from '../data/medalsData';
import { soundEngine } from '../utils/audio';

interface MedalsModalProps {
  isOpen: boolean;
  progress: UserProgress;
  onClose: () => void;
}

export const MedalsModal: React.FC<MedalsModalProps> = ({
  isOpen,
  progress,
  onClose,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | MedalCategory>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unlockedSet = new Set(progress.unlockedMedalIds);
  const totalMedals = INITIAL_MEDALS.length;
  const unlockedCount = progress.unlockedMedalIds.length;
  const percentUnlocked = Math.round((unlockedCount / totalMedals) * 100);

  const filteredMedals = INITIAL_MEDALS.filter((medal) => {
    const isUnlocked = unlockedSet.has(medal.id);
    if (statusFilter === 'unlocked' && !isUnlocked) return false;
    if (statusFilter === 'locked' && isUnlocked) return false;
    if (categoryFilter !== 'all' && medal.category !== categoryFilter) return false;
    return true;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'diamond':
        return {
          border: 'border-cyan-300',
          glow: 'shadow-md',
          badge: 'bg-cyan-100 text-cyan-800 border-cyan-300',
          gradient: 'from-cyan-400 to-blue-500 text-slate-950',
          name: 'Diamante ADN',
        };
      case 'gold':
        return {
          border: 'border-amber-300',
          glow: 'shadow-md',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          gradient: 'from-amber-300 to-yellow-500 text-slate-950',
          name: 'Oro',
        };
      case 'silver':
        return {
          border: 'border-slate-300',
          glow: 'shadow-sm',
          badge: 'bg-slate-100 text-slate-700 border-slate-300',
          gradient: 'from-slate-200 to-slate-400 text-slate-900',
          name: 'Plata',
        };
      case 'bronze':
      default:
        return {
          border: 'border-orange-300',
          glow: 'shadow-sm',
          badge: 'bg-orange-100 text-orange-800 border-orange-300',
          gradient: 'from-orange-300 to-amber-600 text-slate-950',
          name: 'Bronce',
        };
    }
  };

  const getMedalIcon = (iconName: string, isUnlocked: boolean) => {
    const props = { className: "w-6 h-6" };
    switch (iconName) {
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Variable': return <Variable {...props} />;
      case 'Divide': return <Divide {...props} />;
      case 'Equal': return <Equal {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Triangle': return <Triangle {...props} />;
      case 'Infinity': return <InfinityIcon {...props} />;
      case 'Crown': return <Crown {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Trophy': return <Trophy {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'CheckCircle2': return <CheckCircle2 {...props} />;
      default: return <Award {...props} />;
    }
  };

  const handleShareCertificate = () => {
    soundEngine.playClick();
    const text = `🏆 He alcanzado ${progress.xp} XP y desbloqueado ${unlockedCount} medallas en Math ADN Practice. ¡Entrenamiento de matemáticas al máximo nivel!`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundEngine.playClick();
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[32px] bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-100 border border-amber-200 text-amber-600 shadow-sm">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Vitrina de Trofeos ADN
                </span>
                <span className="text-xs font-semibold text-slate-400">Logros & Medallas</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
                Sistema de <span className="text-amber-600">Recompensas e Insignias</span>
              </h2>
            </div>
          </div>

          <button
            id="close-medals-modal-btn"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-700 transition-colors shadow-sm cursor-pointer self-end sm:self-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Progress Bar in Medals */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs text-slate-500 font-semibold">Progreso General de Medallas:</span>
              <p className="text-base sm:text-lg font-black text-slate-900">
                {unlockedCount} de {totalMedals} Medallas Desbloqueadas ({percentUnlocked}%)
              </p>
            </div>

            {/* Quick Share / Export achievement */}
            <button
              onClick={handleShareCertificate}
              className="px-4 py-2 rounded-2xl bg-white border border-slate-200 hover:border-cyan-300 text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer shadow-sm"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">¡Copiado al portapapeles!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-cyan-600" />
                  <span>Compartir Logros</span>
                </>
              )}
            </button>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-500"
              style={{ width: `${percentUnlocked}%` }}
            />
          </div>

          {/* Filter Bars (Categories + Status) */}
          <div className="flex flex-col gap-2 pt-1">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'Todas las Categorías' },
                { id: 'module', label: 'Módulos Matemáticos' },
                { id: 'challenge', label: 'Desafíos Cronometrados' },
                { id: 'tutorial', label: 'Tutoriales' },
                { id: 'progress', label: 'Hitos & XP' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setCategoryFilter(c.id as any);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === c.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setStatusFilter('all');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                Todas ({totalMedals})
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setStatusFilter('unlocked');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === 'unlocked'
                    ? 'bg-emerald-500 text-white font-black'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                Desbloqueadas ({unlockedCount})
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setStatusFilter('locked');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === 'locked'
                    ? 'bg-rose-500 text-white font-black'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                Por Desbloquear ({totalMedals - unlockedCount})
              </button>
            </div>
          </div>
        </div>

        {/* Medals Grid */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50/50">
          {filteredMedals.map((medal) => {
            const isUnlocked = unlockedSet.has(medal.id);
            const tierStyle = getTierColor(medal.tier);
            return (
              <div
                key={medal.id}
                className={`p-4 sm:p-5 rounded-[24px] border transition-all duration-200 flex items-start gap-4 ${
                  isUnlocked
                    ? `bg-white ${tierStyle.border} ${tierStyle.glow}`
                    : 'bg-slate-100/70 border-slate-200 opacity-60'
                }`}
              >
                {/* Medal Icon Badge */}
                <div
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 border relative ${
                    isUnlocked
                      ? `bg-gradient-to-br ${tierStyle.gradient} shadow-md ${tierStyle.border}`
                      : 'bg-slate-200 border-slate-300 text-slate-400'
                  }`}
                >
                  {isUnlocked ? (
                    getMedalIcon(medal.icon, isUnlocked)
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}

                  {/* Status Indicator */}
                  {isUnlocked && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${tierStyle.badge}`}
                    >
                      {tierStyle.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {isUnlocked ? '¡Desbloqueada!' : 'Bloqueada'}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 break-words">
                    {medal.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5 mb-2 font-medium break-words">
                    {medal.description}
                  </p>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                    <span className="font-black text-cyan-700">Requisito:</span>
                    <span className="break-words">{medal.requirement}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
          Completa módulos, supera desafíos cronometrados y explora los tutoriales interactivos para ganar todas las insignias.
        </div>
      </div>
    </div>
  );
};
