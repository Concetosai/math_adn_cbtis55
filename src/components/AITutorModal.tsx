import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  Lightbulb, 
  BookOpen, 
  HelpCircle, 
  ChevronRight, 
  RotateCcw,
  GraduationCap,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, AITutorConfig } from '../types';
import { DEFAULT_TUTOR_CONFIG } from '../utils/storage';
import { soundEngine } from '../utils/audio';
import { speechEngine } from '../utils/speechEngine';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: AITutorConfig;
  currentContext?: {
    moduleId?: string;
    moduleTitle?: string;
    level?: number;
    questionText?: string;
    expression?: string;
  };
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  config = DEFAULT_TUTOR_CONFIG,
  currentContext,
}) => {
  const effectiveConfig = config || DEFAULT_TUTOR_CONFIG;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'model',
        content: effectiveConfig.welcomeMessage || DEFAULT_TUTOR_CONFIG.welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Audio Voice (TTS & STT) states
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [autoSpeakReplies, setAutoSpeakReplies] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
        inputRef.current?.focus();
      }, 100);
    } else {
      speechEngine.stop();
      speechEngine.stopSpeechRecognition();
    }
  }, [isOpen, messages]);

  // Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playClick();
        speechEngine.stop();
        speechEngine.stopSpeechRecognition();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Send question to server API
  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputPrompt).trim();
    if (!text || isLoading) return;

    soundEngine.playClick();
    speechEngine.stop();
    speechEngine.stopSpeechRecognition();
    setIsListening(false);
    setLiveTranscript('');
    setErrorMsg(null);

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextModule: currentContext?.moduleTitle,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          context: {
            currentModule: currentContext?.moduleTitle || currentContext?.moduleId || 'General CBTIS 55 MATH',
            currentLevel: currentContext?.level,
            currentQuestion: currentContext?.questionText ? `${currentContext.questionText} [Expresión: ${currentContext.expression || ''}]` : undefined,
          },
          adminConfig: {
            systemPrompt: effectiveConfig.systemPrompt,
            customKnowledge: effectiveConfig.customKnowledge,
            teachingStyle: effectiveConfig.teachingStyle,
            allowDirectAnswers: effectiveConfig.allowDirectAnswers,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor (${response.status})`);
      }

      const data = await response.json();
      const botReply = data.reply || 'He recibido tu consulta. ¿Qué parte te gustaría desglosar primero?';
      
      const botMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
      soundEngine.playSuccess();

      // Read reply out loud if autoSpeak is active
      if (autoSpeakReplies) {
        setIsSpeaking(true);
        speechEngine.speak(botReply, {
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }

    } catch (err: any) {
      console.error('Error in AI Tutor chat:', err);
      setErrorMsg('No se pudo conectar con el Tutor IA. Revisa tu conexión a internet o el estado del servidor.');
      
      // Fallback local pedagogical reply
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        content: `*Modo Local*: Para resolver tu duda sobre **${currentContext?.moduleTitle || 'Matemáticas'}**:
1. Identifica los datos conocidos y la incógnita.
2. Aplica las leyes y fórmulas correspondientes al tema.
3. Realiza las operaciones respetando la jerarquía de signos y paréntesis.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Microphone (STT) with auto-send on pause
  const handleToggleMicrophone = () => {
    soundEngine.playClick();

    if (isListening) {
      speechEngine.stopSpeechRecognition();
      setIsListening(false);
      setLiveTranscript('');
      return;
    }

    speechEngine.stop();
    setIsSpeaking(false);
    setIsListening(true);
    setLiveTranscript('');

    const started = speechEngine.startSpeechRecognition({
      onResult: (transcript) => {
        setLiveTranscript(transcript);
        setInputPrompt(transcript);
      },
      onSpeechPauseAutoSend: (finalTranscript) => {
        soundEngine.playSuccess();
        setTimeout(() => {
          handleSendMessage(finalTranscript);
        }, 200);
      },
      onError: (err) => {
        console.warn('Speech rec error', err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (!started) {
      setIsListening(false);
    }
  };

  const handleClearChat = () => {
    soundEngine.playClick();
    speechEngine.stop();
    setIsSpeaking(false);
    setMessages([
      {
        id: 'msg-welcome-reset',
        role: 'model',
        content: effectiveConfig.welcomeMessage || '¡Chat reiniciado! ¿En qué ejercicio o fórmula de CBTIS 55 puedo orientarte?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  // Context-aware Quick Chips
  const getContextChips = () => {
    if (currentContext?.questionText) {
      return [
        { label: '💡 Dame una pista para este problema', text: `Estoy resolviendo el ejercicio: "${currentContext.questionText}". Dame una pista paso a paso sin darme la respuesta final.` },
        { label: '📐 ¿Qué fórmula debo aplicar aquí?', text: `¿Qué fórmula, regla o concepto matemático debo utilizar para resolver: "${currentContext.questionText}"?` },
        { label: '🔍 Explícame un ejemplo similar', text: `Muéstrame un ejemplo resuelto similar a: "${currentContext.questionText}" con otros números para entender el procedimiento.` },
      ];
    }

    if (currentContext?.moduleId === 'base-cero') {
      return [
        { label: '🔢 Truco para las tablas del 7 y 8', text: '¿Qué trucos nemotécnicos me recomiendas para memorizar las tablas de multiplicar del 7 y del 8?' },
        { label: '⏱️ Consejo para calcular operaciones rápido', text: '¿Cómo puedo agilizar mi cálculo mental en sumas y restas de 2 y 3 dígitos?' },
        { label: '➕ Jerarquía de operaciones PEMDAS', text: '¿Cómo funciona la jerarquía de operaciones en operaciones combinadas?' },
      ];
    }

    return [
      { label: '✨ ¿Cómo resolver ecuaciones paso a paso?', text: '¿Cuáles son los pasos clave para despejar una incógnita en una ecuación lineal?' },
      { label: '📐 Regla de los signos explicada', text: '¿Por qué menos por menos es más? Explícamelo con un ejemplo sencillo y visual.' },
      { label: '🎯 ¿Cómo interpretar la derivada?', text: '¿Qué significa geométricamente la derivada de una función en un punto?' },
      { label: '🍕 Suma de fracciones con diferente denominador', text: '¿Cómo encuentro el mínimo común múltiplo para sumar fracciones heterogéneas?' },
    ];
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundEngine.playClick();
          speechEngine.stop();
          speechEngine.stopSpeechRecognition();
          onClose();
        }
      }}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="w-full max-w-2xl h-[88vh] max-h-[750px] bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(0,242,255,0.15)] flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(0,242,255,0.4)]">
              <Bot className="w-6 h-6" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-100 tracking-tight">
                  Tutor IA & Voz <span className="text-cyan-400">CBTIS 55</span>
                </h3>
                <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  TTS • STT • GEMINI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Orientación socrática y por voz interactiva en tiempo real.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Auto-Speak Answers Toggle Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                if (isSpeaking) {
                  speechEngine.stop();
                  setIsSpeaking(false);
                }
                setAutoSpeakReplies(!autoSpeakReplies);
              }}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                autoSpeakReplies
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
              title={autoSpeakReplies ? 'Voz TTS activa para respuestas' : 'Voz silenciada'}
            >
              {autoSpeakReplies ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {isSpeaking && (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  speechEngine.stop();
                  setIsSpeaking(false);
                }}
                className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors cursor-pointer"
                title="Detener voz"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            )}

            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Limpiar conversación"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                speechEngine.stop();
                speechEngine.stopSpeechRecognition();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Cerrar Tutor IA"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Active Context Banner if available */}
        {currentContext?.moduleTitle && (
          <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-300">
            <div className="flex items-center gap-2 truncate">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">
                Módulo Activo: <strong>{currentContext.moduleTitle}</strong>
                {currentContext.level ? ` • Nivel ${currentContext.level}` : ''}
              </span>
            </div>
            {currentContext.questionText && (
              <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 shrink-0 text-[10px] font-bold">
                Ejercicio Detectado
              </span>
            )}
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(0,242,255,0.2)]">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none shadow-md'
                    : 'bg-slate-950/70 border border-slate-800 text-slate-200 rounded-tl-none space-y-2 shadow-inner'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                <div className={`text-[10px] flex items-center justify-between gap-2 pt-1 ${msg.role === 'user' ? 'text-slate-800 justify-end' : 'text-slate-500'}`}>
                  <span>{msg.timestamp}</span>

                  {msg.role === 'model' && (
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        speechEngine.speak(msg.content);
                        setIsSpeaking(true);
                      }}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      title="Escuchar este mensaje en voz alta"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <span className="text-xs font-black">TÚ</span>
                </div>
              )}
            </motion.div>
          ))}

          {/* Live Listening Waveform Bubble */}
          {isListening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-2xl bg-cyan-950/50 border border-cyan-400/50 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between text-cyan-300 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>Escuchando tu voz... (Pausa al hablar para enviar automáticamente)</span>
                </div>
                <Mic className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>

              <p className="text-xs text-slate-200 italic font-mono bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                {liveTranscript || 'Habla tu duda ahora...'}
              </p>
            </motion.div>
          )}

          {/* Loading bubble */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 items-center text-slate-400 text-xs py-2"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-2 text-cyan-300 font-medium">Analizando consulta pedagógica...</span>
              </div>
            </motion.div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 overflow-x-auto flex items-center gap-2 no-scrollbar">
          {getContextChips().map((chip, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSendMessage(chip.text)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-slate-700/80 text-[11px] font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Input Bar with 3D Mic & Text Input */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={isListening ? 'Escuchando tu voz...' : 'Escribe tu duda sobre fórmulas, despejes o ejercicios...'}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60"
              />
            </div>

            {/* 3D Mic Button */}
            <button
              type="button"
              onClick={handleToggleMicrophone}
              className={`p-3 rounded-2xl font-bold transition-all shadow-lg cursor-pointer shrink-0 flex items-center justify-center ${
                isListening
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/40 border-2 border-white animate-pulse'
                  : 'bg-gradient-to-b from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 shadow-cyan-500/20 border-b-2 border-cyan-600 active:translate-y-0.5'
              }`}
              title={isListening ? 'Detener micrófono' : 'Hablar por micrófono (Auto-envío al pausar)'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              title="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-1.5 text-center">
            <span className="text-[10px] text-slate-500">
              Tutor pedagógico CBTIS 55 MATH impulsado por Inteligencia Artificial y Voz Natural.
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

