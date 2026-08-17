import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Video,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MathModule } from '../types';
import { soundEngine } from '../utils/audio';

interface ModuleIntroVideoModalProps {
  isOpen: boolean;
  module: MathModule | null;
  onClose: () => void;
  onStartPractice: (module: MathModule, level?: 1 | 2 | 3) => void;
  onOpenFormulas: (module: MathModule) => void;
}

export const ModuleIntroVideoModal: React.FC<ModuleIntroVideoModalProps> = ({
  isOpen,
  module,
  onClose,
  onStartPractice,
  onOpenFormulas,
}) => {
  const [videoKey, setVideoKey] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setVideoKey(0);
      setVideoEnded(false);
    }
  }, [isOpen]);

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

  if (!isOpen || !module) return null;

  const hasVideo = !!module.introVideoId;

  const handleReplay = () => {
    soundEngine.playClick();
    setVideoEnded(false);
    setVideoKey((prev) => prev + 1);
  };

  const handleContinue = () => {
    soundEngine.playClick();
    onClose();
    onStartPractice(module, 1);
  };

  const handleOpenFormulas = () => {
    soundEngine.playClick();
    onClose();
    onOpenFormulas(module);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            soundEngine.playClick();
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(0,242,255,0.1)] flex flex-col overflow-hidden max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-slate-950 shrink-0 shadow-md">
                <Video className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">
                  {module.tag}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-100 tracking-tight truncate mt-0.5">
                  {module.title}
                </h3>
              </div>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 cursor-pointer shrink-0"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Module Description */}
            <div className="text-center space-y-2">
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-lg mx-auto">
                {module.description}
              </p>
            </div>

            {/* Video Player */}
            {hasVideo ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-700 bg-black">
                <iframe
                  ref={iframeRef}
                  key={videoKey}
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${module.introVideoId}?rel=0&modestbranding=1&autoplay=0`}
                  title={module.introVideoTitle || module.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  onLoad={() => {}}
                />
                {/* Video ended overlay */}
                {videoEnded && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center space-y-3">
                      <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center mx-auto">
                        <Play className="w-7 h-7 text-cyan-400 fill-current" />
                      </div>
                      <p className="text-sm font-bold text-slate-200">Video completado</p>
                      <button
                        onClick={handleReplay}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 mx-auto border border-slate-600 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Volver a Play
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/50 flex flex-col items-center justify-center gap-3 text-center p-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Video className="w-7 h-7 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400">Video de repaso no disponible</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Revisa las fórmulas o comienza directamente con la práctica.
                  </p>
                </div>
              </div>
            )}

            {/* Quick Formulas Preview */}
            {module.formulas.length > 0 && (
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                    Fórmulas Clave del Módulo
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {module.formulas.slice(0, 4).map((f) => (
                    <span
                      key={f.id}
                      className="px-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-[10px] font-bold text-slate-300"
                    >
                      {f.title}
                    </span>
                  ))}
                  {module.formulas.length > 4 && (
                    <span className="px-2 py-1 rounded-lg bg-slate-800/50 text-[10px] font-bold text-slate-500">
                      +{module.formulas.length - 4} más
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/70 shrink-0">
            <div className="flex flex-col sm:flex-row gap-2.5">
              {/* Replay Button */}
              {hasVideo && (
                <button
                  onClick={handleReplay}
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Volver a Play</span>
                </button>
              )}

              {/* Formulas Button */}
              <button
                onClick={handleOpenFormulas}
                className={`py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  hasVideo ? '' : 'flex-1'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Ver Fórmulas</span>
              </button>

              {/* Continue to Exercise Button */}
              <button
                onClick={handleContinue}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>Continuar al Ejercicio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2.5 text-center">
              <span className="text-[10px] text-slate-500">
                {module.title} — {module.subtitle}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
