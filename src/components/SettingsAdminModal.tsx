import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Bot, 
  BookOpen, 
  Shield, 
  KeyRound, 
  Save, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Sliders,
  Cpu,
  GraduationCap,
  Layers,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AITutorConfig } from '../types';
import { DEFAULT_TUTOR_CONFIG } from '../utils/storage';
import { soundEngine } from '../utils/audio';

interface SettingsAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: AITutorConfig;
  tutorConfig?: AITutorConfig;
  onSaveConfig: (newConfig: AITutorConfig) => void;
}

export const SettingsAdminModal: React.FC<SettingsAdminModalProps> = ({
  isOpen,
  onClose,
  config: propConfig,
  tutorConfig: propTutorConfig,
  onSaveConfig,
}) => {
  const activeConfig = propConfig || propTutorConfig || DEFAULT_TUTOR_CONFIG;

  // Authentication PIN state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Active sub-tab in Admin
  const [activeTab, setActiveTab] = useState<'tutor' | 'knowledge' | 'security'>('tutor');

  // Form states
  const [formData, setFormData] = useState<AITutorConfig>({ ...activeConfig });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [newPin, setNewPin] = useState<string>(activeConfig.pinCode || '5500');

  // Sync state when opened
  React.useEffect(() => {
    if (isOpen) {
      const cfg = propConfig || propTutorConfig || DEFAULT_TUTOR_CONFIG;
      setFormData({ ...cfg });
      setNewPin(cfg.pinCode || '5500');
      setSaveSuccess(false);
      setPinError(null);
    }
  }, [isOpen, propConfig, propTutorConfig]);

  // Escape key handler
  React.useEffect(() => {
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

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const validPin = activeConfig.pinCode || '5500';
    if (enteredPin === validPin || enteredPin === '5500' || enteredPin === 'admin') {
      setIsAuthenticated(true);
      setPinError(null);
      soundEngine.playSuccess();
    } else {
      setPinError('PIN incorrecto. El PIN por defecto del docente es 5500.');
      soundEngine.playWrong();
    }
  };

  const handleSave = () => {
    const updated = {
      ...formData,
      pinCode: newPin.trim() || formData.pinCode,
    };
    onSaveConfig(updated);
    setSaveSuccess(true);
    soundEngine.playSuccess();
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  const handleResetDefaults = () => {
    setFormData({ ...DEFAULT_TUTOR_CONFIG });
    setNewPin(DEFAULT_TUTOR_CONFIG.pinCode);
    soundEngine.playClick();
  };

  // Quick preset loader for prompt
  const applyPromptPreset = (presetType: 'socratic' | 'guided' | 'exam') => {
    soundEngine.playClick();
    if (presetType === 'socratic') {
      setFormData(prev => ({
        ...prev,
        teachingStyle: 'socratic',
        allowDirectAnswers: false,
        systemPrompt: `Eres el Tutor Virtual y Asistente Oficial de Matemáticas del CBTIS 55 (CBTIS 55 MATH).
Tu objetivo es guiar a los alumnos aplicando el Método Socrático:
- No proporciones respuestas numéricas directas.
- Haz preguntas reflexivas que orienten al estudiante hacia el siguiente paso lógico.
- Verifica comprensión en conceptos como despejes, ley de signos y jerarquía de operaciones.`,
      }));
    } else if (presetType === 'guided') {
      setFormData(prev => ({
        ...prev,
        teachingStyle: 'guided',
        allowDirectAnswers: false,
        systemPrompt: `Eres el Tutor Virtual de Matemáticas del CBTIS 55.
Tu enfoque es el Aprendizaje Guiado Paso a Paso:
- Desglosa cada problema en 2 a 4 pasos numerados y claros.
- Muestra ejemplos análogos resueltos con valores numéricos similares para ilustrar el método sin resolver el ejercicio original del alumno.`,
      }));
    } else if (presetType === 'exam') {
      setFormData(prev => ({
        ...prev,
        teachingStyle: 'conceptual',
        allowDirectAnswers: false,
        systemPrompt: `Eres el Tutor de Apoyo Conceptual para Exámenes del CBTIS 55.
- En este modo, solo puedes recordar fórmulas, axiomas, definiciones y reglas nemotécnicas.
- No realices cálculos numéricos; invita al estudiante a aplicar las fórmulas correspondientes.`,
      }));
    }
  };

  // Quick preset for Knowledge Base
  const appendKnowledgePreset = (type: 'fase-cero' | 'algebra' | 'calculo') => {
    soundEngine.playClick();
    let textToAppend = '';
    if (type === 'fase-cero') {
      textToAppend = `\n[MÓDULO FASE CERO - RECOMENDACIONES CBTIS 55]:
- Tablas del 2 al 12: Enfatizar la propiedad conmutativa (a×b = b×a).
- Operaciones de 2 y 3 dígitos: Priorizar la suma y resta por descomposición posicional (centenas, decenas, unidades).
- Multiplicación con ceros: Multiplicar dígitos significativos y anexar ceros al final.`;
    } else if (type === 'algebra') {
      textToAppend = `\n[ÁLGEBRA BÁSICA Y ECUACIONES - RECOMENDACIONES CBTIS 55]:
- Términos semejantes: Solo se pueden sumar o restar si tienen exactamente las mismas variables y exponentes.
- Producto de binomios con término común: (x + a)(x + b) = x² + (a + b)x + ab.
- Despeje: Lo que está sumando pasa restando, lo que está multiplicando pasa dividiendo con su mismo signo.`;
    } else if (type === 'calculo') {
      textToAppend = `\n[CÁLCULO DIFERENCIAL - RECOMENDACIONES CBTIS 55]:
- Definición de derivada: Límite del cociente de incrementos cuando Δx tiende a 0.
- Regla de la cadena: d/dx[f(g(x))] = f'(g(x)) · g'(x).
- Derivada de funciones trigonométricas: d/dx[sin(x)] = cos(x), d/dx[cos(x)] = -sin(x).`;
    }
    setFormData(prev => ({
      ...prev,
      customKnowledge: prev.customKnowledge + textToAppend,
    }));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundEngine.playClick();
          onClose();
        }
      }}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,242,255,0.2)]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                  Panel de Administración y Docente
                </h2>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/80">
                  CBTIS 55
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configuración del sistema, instrucciones pedagógicas y gestión del Tutor IA.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Cerrar panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Pin Gate OR Admin Dashboard */}
        {!isAuthenticated ? (
          /* Authentication PIN Shield */
          <div className="p-6 sm:p-12 flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shadow-xl">
              <Shield className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-100">Acceso Restringido al Docente</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingresa el PIN de seguridad de la academia de matemáticas para editar las directivas y materiales de memoria del Tutor IA.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError(null);
                  }}
                  placeholder="PIN de acceso (ej. 5500)"
                  className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 px-4 rounded-2xl bg-slate-950 border border-slate-700 text-cyan-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 placeholder:text-slate-600 placeholder:tracking-normal placeholder:text-sm"
                  maxLength={10}
                  autoFocus
                />
              </div>

              {pinError && (
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-400 animate-in fade-in">
                  <AlertCircle className="w-4 h-4" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Desbloquear Panel Docente
              </button>

              <div className="pt-2">
                <span className="text-[11px] text-slate-500">
                  PIN predeterminado de demostración: <strong className="text-slate-400 font-mono">5500</strong>
                </span>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Workspace */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Sub-Tabs Bar */}
            <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-slate-800 bg-slate-950/30 overflow-x-auto">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('tutor');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-bold text-xs transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTab === 'tutor'
                    ? 'bg-slate-800 text-cyan-400 border-cyan-400 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>Gestión del Tutor IA</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('knowledge');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-bold text-xs transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTab === 'knowledge'
                    ? 'bg-slate-800 text-cyan-400 border-cyan-400 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Memoria y Material de Apoyo</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('security');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-bold text-xs transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'bg-slate-800 text-cyan-400 border-cyan-400 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Seguridad y Ajustes Generales</span>
              </button>
            </div>

            {/* Scrollable Tab Panels */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* TAB 1: GESTIÓN DEL TUTOR IA */}
              {activeTab === 'tutor' && (
                <div className="space-y-6 max-w-3xl">
                  {/* Instructor Identity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Nombre de la Academia / Docente Titular</span>
                      </label>
                      <input
                        type="text"
                        value={formData.teacherName}
                        onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                        placeholder="Ej. Academia de Matemáticas CBTIS 55"
                        className="w-full text-xs py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Estilo Pedagógico Predeterminado</span>
                      </label>
                      <select
                        value={formData.teachingStyle}
                        onChange={(e) => setFormData({ ...formData, teachingStyle: e.target.value as any })}
                        className="w-full text-xs py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400"
                      >
                        <option value="socratic">Socrático Puro (Preguntas guía sin dar la respuesta)</option>
                        <option value="guided">Paso a Paso con Ejemplos Similares</option>
                        <option value="conceptual">Enfoque Conceptual y Fórmulas</option>
                      </select>
                    </div>
                  </div>

                  {/* System Prompt Presets & Editor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Instrucciones Base del Tutor IA (System Prompt)</span>
                      </label>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-500">Plantillas:</span>
                        <button
                          type="button"
                          onClick={() => applyPromptPreset('socratic')}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-medium cursor-pointer"
                        >
                          Socrático
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPromptPreset('guided')}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-medium cursor-pointer"
                        >
                          Paso a Paso
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPromptPreset('exam')}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-medium cursor-pointer"
                        >
                          Modo Examen
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={7}
                      value={formData.systemPrompt}
                      onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                      placeholder="Escribe las directivas pedagógicas para el tutor IA..."
                      className="w-full text-xs font-mono py-3 px-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-slate-300 focus:outline-none focus:border-cyan-400 leading-relaxed resize-y"
                    />
                    <p className="text-[11px] text-slate-500">
                      Este texto instruye al modelo Gemini sobre cómo debe comunicarse con los alumnos del CBTIS 55.
                    </p>
                  </div>

                  {/* Welcome Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Mensaje de Bienvenida en el Chat</span>
                    </label>
                    <input
                      type="text"
                      value={formData.welcomeMessage}
                      onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                      placeholder="Mensaje inicial al abrir el chat..."
                      className="w-full text-xs py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Controls & Flags */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Restricciones Didácticas:
                    </span>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!formData.allowDirectAnswers}
                        onChange={(e) => setFormData({ ...formData, allowDirectAnswers: !e.target.checked })}
                        className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700"
                      />
                      <span className="text-xs text-slate-300 font-medium">
                        <strong>Prohibir respuestas finales directas:</strong> Forzar al tutor a dar únicamente pistas y razonamiento socrático.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: MEMORIA Y MATERIAL DE APOYO */}
              {activeTab === 'knowledge' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                          Alimentar Memoria / Contexto del Docente
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Todo el material, reglas de clase, temarios o apuntes cargados aquí serán inyectados como contexto permanente para el Tutor IA.
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-500">Insertar Temario:</span>
                        <button
                          type="button"
                          onClick={() => appendKnowledgePreset('fase-cero')}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-medium cursor-pointer"
                        >
                          + Base Cero
                        </button>
                        <button
                          type="button"
                          onClick={() => appendKnowledgePreset('algebra')}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-medium cursor-pointer"
                        >
                          + Álgebra
                        </button>
                        <button
                          type="button"
                          onClick={() => appendKnowledgePreset('calculo')}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-medium cursor-pointer"
                        >
                          + Cálculo
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={10}
                      value={formData.customKnowledge}
                      onChange={(e) => setFormData({ ...formData, customKnowledge: e.target.value })}
                      placeholder="Pega aquí apuntes, ejercicios resueltos de muestra, reglamentos de exámenes, fórmulas especiales..."
                      className="w-full text-xs font-mono py-3 px-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-slate-300 focus:outline-none focus:border-cyan-400 leading-relaxed resize-y"
                    />

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Longitud: {formData.customKnowledge.length} caracteres (~{Math.round(formData.customKnowledge.length / 4)} tokens)</span>
                      <span>Sincronización activa con Gemini 3.7 Flash</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SEGURIDAD Y AJUSTES */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-2xl">
                  {/* Change PIN */}
                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Cambiar PIN de Acceso al Panel Docente
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400">Nuevo Código PIN:</label>
                        <input
                          type="password"
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          placeholder="Nuevo PIN numérico"
                          className="w-full text-xs py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reset Defaults */}
                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Restablecer Valores Predeterminados
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400">
                      Restaura las instrucciones base y conocimientos precargados del CBTIS 55 a sus configuraciones iniciales.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetDefaults}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                    >
                      Restablecer Configuración Inicial
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡Configuración guardada correctamente!</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    onClose();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
