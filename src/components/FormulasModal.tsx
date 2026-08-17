import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  Search, 
  Lightbulb, 
  AlertTriangle, 
  Copy, 
  Check, 
  Play, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { MathModule, FormulaRule } from '../types';
import { MATH_MODULES } from '../data/mathModules';
import { soundEngine } from '../utils/audio';
import { formatMathExpression } from '../utils/mathFormatter';

interface FormulasModalProps {
  isOpen: boolean;
  selectedModule: MathModule | null;
  onClose: () => void;
  onSelectModule: (module: MathModule) => void;
  onStartPractice: (module: MathModule) => void;
}

export const FormulasModal: React.FC<FormulasModalProps> = ({
  isOpen,
  selectedModule,
  onClose,
  onSelectModule,
  onStartPractice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  if (!isOpen || !selectedModule) return null;

  // Filter formulas by search query
  const filteredFormulas = selectedModule.formulas.filter((f) => {
    const q = searchQuery.toLowerCase();
    return (
      f.title.toLowerCase().includes(q) ||
      f.formula.toLowerCase().includes(q) ||
      f.explanation.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    );
  });

  const handleCopyFormula = (formula: FormulaRule) => {
    soundEngine.playClick();
    navigator.clipboard.writeText(`${formula.title}\nFórmula: ${formula.formula}\nEjemplo: ${formula.example}`);
    setCopiedId(formula.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundEngine.playClick();
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[32px] glass-panel-glow border border-white/90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 bg-white/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-cyan-100 border border-cyan-200 text-cyan-600 shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-700 bg-cyan-100 px-2.5 py-0.5 rounded-full border border-cyan-200">
                  {selectedModule.tag}
                </span>
                <span className="text-xs font-semibold text-slate-400">Manual ADN</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
                Reglas y Fórmulas: <span className="text-cyan-600">{selectedModule.title}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="close-formulas-modal-btn"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Module Switcher Tabs */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto flex items-center gap-2 scrollbar-none">
          {MATH_MODULES.map((mod) => (
            <button
              key={mod.id}
              onClick={() => {
                soundEngine.playClick();
                onSelectModule(mod);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedModule.id === mod.id
                  ? 'bg-cyan-500 text-slate-950 border border-cyan-400 shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {mod.title}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-4 pb-2 bg-slate-50/70">
          <div className="relative">
            <Search className="w-4 h-4 text-cyan-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Buscar fórmulas en ${selectedModule.title} (ej. PEMDAS, derivadas, signos)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Formulas Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
          {filteredFormulas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">No se encontraron fórmulas que coincidan con "{searchQuery}".</p>
            </div>
          ) : (
            filteredFormulas.map((item) => (
              <div 
                key={item.id}
                className="rounded-[28px] bg-white border border-slate-200 p-6 shadow-sm relative group hover:border-cyan-300 transition-colors"
              >
                {/* Formula Header & Category */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 bg-cyan-100 px-2.5 py-0.5 rounded-full border border-cyan-200">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">
                      {item.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleCopyFormula(item)}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-300 text-slate-500 hover:text-cyan-600 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer"
                    title="Copiar fórmula y ejemplo"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Formula Display Box */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 my-3 shadow-inner">
                  <p className="text-xs uppercase font-bold text-cyan-400 mb-1 tracking-wider">
                    Fórmula / Expresión Clave:
                  </p>
                  <pre className="text-sm sm:text-base font-bold text-[#00f2ff] font-mono whitespace-pre-wrap leading-relaxed tracking-wide">
                    {formatMathExpression(item.formula)}
                  </pre>
                </div>

                {/* Explanation */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 font-medium">
                  {item.explanation}
                </p>

                {/* Worked Example */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-800 mb-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Ejemplo Práctico Paso a Paso:</span>
                  </div>
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed font-medium">
                    {item.example}
                  </pre>
                </div>

                {/* Tips & Caution Callouts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {item.tips && (
                    <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-black text-cyan-800 uppercase tracking-wider">Tip ADN:</p>
                        <p className="text-xs text-slate-700 leading-normal font-medium">{item.tips}</p>
                      </div>
                    </div>
                  )}

                  {item.caution && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-black text-rose-800 uppercase tracking-wider">¡Ojo! Error Común:</p>
                        <p className="text-xs text-slate-700 leading-normal font-medium">{item.caution}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600 font-medium text-center sm:text-left">
            ¿Listo para poner a prueba tu entendimiento de <span className="text-slate-900 font-black">{selectedModule.title}</span>?
          </div>
          <button
            id="start-practice-from-modal-btn"
            onClick={() => {
              soundEngine.playClick();
              onStartPractice(selectedModule);
            }}
            className="neon-button py-3 px-6 rounded-2xl flex items-center justify-center gap-2 text-sm uppercase font-black tracking-wider cursor-pointer w-full sm:w-auto"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Practicar {selectedModule.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
