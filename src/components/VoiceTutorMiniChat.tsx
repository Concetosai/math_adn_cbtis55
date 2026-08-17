import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Bot,
  X,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Trash2,
  Check,
  GraduationCap,
  Radio,
  HelpCircle,
  Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, AITutorConfig } from '../types';
import { speechEngine } from '../utils/speechEngine';
import { soundEngine } from '../utils/audio';
import { MODULE_INTRODUCTIONS, SectionIntro } from '../data/moduleIntroductions';
import { DEFAULT_TUTOR_CONFIG } from '../utils/storage';

interface VoiceTutorMiniChatProps {
  currentSectionId?: string; // e.g. 'base-cero', 'algebra-basica', etc.
  currentExerciseContext?: {
    questionText?: string;
    expression?: string;
    level?: number;
  };
  tutorConfig?: AITutorConfig;
  isOpen: boolean;
  onClose: () => void;
  onOpenFullModal?: () => void;
}

export const VoiceTutorMiniChat: React.FC<VoiceTutorMiniChatProps> = ({
  currentSectionId = 'base-cero',
  currentExerciseContext,
  tutorConfig = DEFAULT_TUTOR_CONFIG,
  isOpen,
  onClose,
  onOpenFullModal,
}) => {
  const [sectionIntro, setSectionIntro] = useState<SectionIntro>(() => {
    return MODULE_INTRODUCTIONS[currentSectionId] || MODULE_INTRODUCTIONS['base-cero'];
  });

  // Audio TTS states
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState<boolean>(() => {
    return speechEngine.getAutoPlayEnabled();
  });
  const [spokenTextPreview, setSpokenTextPreview] = useState<string>('');

  // Speech Recognition (STT) states
  const [isListening, setIsListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [isAutoSending, setIsAutoSending] = useState<boolean>(false);

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [autoSpeakReplies, setAutoSpeakReplies] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasAutoPlayedSection = useRef<Record<string, boolean>>({});

  // Update section intro data when section changes
  useEffect(() => {
    const intro = MODULE_INTRODUCTIONS[currentSectionId] || MODULE_INTRODUCTIONS['base-cero'];
    setSectionIntro(intro);

    // Initial welcome message per section
    if (messages.length === 0) {
      setMessages([
        {
          id: `welcome-${intro.id}`,
          role: 'model',
          content: `${intro.spokenScript}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }

    // Auto-play voice intro if enabled and not played in this section session
    if (isOpen && autoPlayEnabled && !hasAutoPlayedSection.current[currentSectionId]) {
      hasAutoPlayedSection.current[currentSectionId] = true;
      handleSpeakIntro(intro.spokenScript);
    }
  }, [currentSectionId, isOpen, autoPlayEnabled]);

  // Clean up speech synthesis and mic on unmount or close
  useEffect(() => {
    return () => {
      speechEngine.stop();
      speechEngine.stopSpeechRecognition();
    };
  }, []);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isListening, isLoading]);

  // Play spoken introduction via TTS
  const handleSpeakIntro = (textToSpeak?: string) => {
    const script = textToSpeak || sectionIntro.spokenScript;
    setSpokenTextPreview(script);
    setIsSpeaking(true);
    setIsPaused(false);

    speechEngine.speak(script, {
      onStart: () => {
        setIsSpeaking(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setIsPaused(false);
      },
      onError: () => {
        setIsSpeaking(false);
        setIsPaused(false);
      }
    });
  };

  // Toggle Speaker Play / Pause
  const handleToggleSpeaker = () => {
    soundEngine.playClick();
    if (isSpeaking && !isPaused) {
      speechEngine.pause();
      setIsPaused(true);
    } else if (isSpeaking && isPaused) {
      speechEngine.resume();
      setIsPaused(false);
    } else {
      handleSpeakIntro();
    }
  };

  // Stop Speaker
  const handleStopSpeaker = () => {
    soundEngine.playClick();
    speechEngine.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Checkbox toggle: No volver a reproducir automáticamente
  const handleToggleAutoPlay = (enabled: boolean) => {
    soundEngine.playClick();
    setAutoPlayEnabled(enabled);
    speechEngine.setAutoPlayEnabled(enabled);
  };

  // Send message to Gemini 3.7 API Tutor
  const handleSendMessage = async (textOverride?: string) => {
    const query = (textOverride || inputText).trim();
    if (!query || isLoading) return;

    soundEngine.playClick();
    speechEngine.stop(); // Stop any current speech
    speechEngine.stopSpeechRecognition();
    setIsListening(false);
    setLiveTranscript('');
    setIsAutoSending(false);

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextModule: sectionIntro.title,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          context: {
            currentModule: sectionIntro.title,
            currentLevel: currentExerciseContext?.level,
            currentQuestion: currentExerciseContext?.questionText
              ? `${currentExerciseContext.questionText} [Expresión: ${currentExerciseContext.expression || ''}]`
              : undefined,
          },
          adminConfig: {
            systemPrompt: tutorConfig.systemPrompt,
            customKnowledge: tutorConfig.customKnowledge,
            teachingStyle: tutorConfig.teachingStyle,
            allowDirectAnswers: tutorConfig.allowDirectAnswers,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en servidor (${response.status})`);
      }

      const data = await response.json();
      const botReply = data.reply || 'He recibido tu pregunta. ¿En qué parte específica te gustaría que profundicemos?';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now() + 1}`,
        role: 'model',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
      soundEngine.playSuccess();

      // Voice-to-Voice: If autoSpeakReplies is enabled, speak the answer with TTS female voice
      if (autoSpeakReplies) {
        setIsSpeaking(true);
        setIsPaused(false);
        speechEngine.speak(botReply, {
          onStart: () => {
            setIsSpeaking(true);
            setIsPaused(false);
          },
          onEnd: () => {
            setIsSpeaking(false);
            setIsPaused(false);
          },
          onError: () => {
            setIsSpeaking(false);
            setIsPaused(false);
          }
        });
      }

    } catch (err) {
      console.error('Error fetching AI Tutor reply:', err);
      const fallbackReply = `*Respuesta pedagógica*: Para resolver tu consulta sobre **${sectionIntro.title}**, revisa los datos clave del problema y aplica las reglas paso a paso.`;
      const fallbackMsg: ChatMessage = {
        id: `bot-fb-${Date.now()}`,
        role: 'model',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Microphone (STT) with Auto-send on speech pause
  const handleToggleMicrophone = () => {
    soundEngine.playClick();

    if (isListening) {
      speechEngine.stopSpeechRecognition();
      setIsListening(false);
      setLiveTranscript('');
      setIsAutoSending(false);
      return;
    }

    // Stop TTS when user starts recording
    speechEngine.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    setIsListening(true);
    setLiveTranscript('');

    const started = speechEngine.startSpeechRecognition({
      onResult: (transcript) => {
        setLiveTranscript(transcript);
        setInputText(transcript);
      },
      onSpeechPauseAutoSend: (finalTranscript) => {
        setIsAutoSending(true);
        soundEngine.playSuccess();
        setTimeout(() => {
          handleSendMessage(finalTranscript);
        }, 300);
      },
      onError: (err) => {
        console.warn('Speech rec error', err);
        setIsListening(false);
        setIsAutoSending(false);
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
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'model',
        content: `¡Chat reiniciado! Estoy lista para responder tus preguntas sobre **${sectionIntro.title}**. ¿Por dónde empezamos?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="cbtis55-voice-tutor-container"
        className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end max-w-[calc(100vw-24px)] pointer-events-none"
      >
        {/* Main Floating Mini-Chat Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`pointer-events-auto w-full sm:w-[410px] bg-slate-950/95 backdrop-blur-2xl border border-cyan-400/40 rounded-3xl shadow-[0_10px_40px_rgba(0,242,255,0.2)] flex flex-col overflow-hidden text-slate-100 transition-all ${
            isMinimized ? 'h-auto' : 'h-[530px] max-h-[82vh]'
          }`}
        >
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-cyan-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 shadow-[0_0_12px_rgba(0,242,255,0.4)] shrink-0">
                <Bot className="w-5 h-5" />
                {isSpeaking && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
                )}
                {isListening && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-950 animate-pulse" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-black text-slate-100 tracking-tight truncate">
                    Tutor de Voz <span className="text-cyan-400">CBTIS 55</span>
                  </h4>
                  <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[9px] font-black tracking-wider uppercase">
                    TTS • IA
                  </span>
                </div>
                <p className="text-[10px] text-cyan-300/80 truncate font-medium">
                  {sectionIntro.title}
                </p>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Speaker Play / Pause / Replay Action */}
              <button
                onClick={handleToggleSpeaker}
                className={`p-1.5 sm:p-2 rounded-xl transition-all border cursor-pointer ${
                  isSpeaking && !isPaused
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,242,255,0.3)] animate-pulse'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-cyan-400 hover:bg-slate-800'
                }`}
                title={isSpeaking ? (isPaused ? 'Reanudar voz' : 'Pausar voz') : 'Escuchar explicación de la lección'}
              >
                {isSpeaking && !isPaused ? (
                  <Volume2 className="w-4 h-4 text-cyan-300" />
                ) : isPaused ? (
                  <Play className="w-4 h-4 text-amber-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              {/* Clear Chat */}
              <button
                onClick={handleClearChat}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Limpiar conversación"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Minimize / Expand Toggle */}
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setIsMinimized(!isMinimized);
                }}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                title={isMinimized ? 'Expandir mini-chat' : 'Minimizar mini-chat'}
              >
                {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  soundEngine.playClick();
                  speechEngine.stop();
                  speechEngine.stopSpeechRecognition();
                  onClose();
                }}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Cerrar asistente de voz"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Section Audio Banner & Visualizer (Always visible or when unminimized) */}
          <div className="px-3.5 py-2 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between gap-3 text-[11px] shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1 text-cyan-400 shrink-0">
                <span className={`w-1.5 h-3 rounded-full bg-cyan-400 ${isSpeaking && !isPaused ? 'animate-bounce' : 'opacity-40'}`} style={{ animationDelay: '0ms' }} />
                <span className={`w-1.5 h-4.5 rounded-full bg-cyan-300 ${isSpeaking && !isPaused ? 'animate-bounce' : 'opacity-40'}`} style={{ animationDelay: '150ms' }} />
                <span className={`w-1.5 h-2.5 rounded-full bg-teal-400 ${isSpeaking && !isPaused ? 'animate-bounce' : 'opacity-40'}`} style={{ animationDelay: '300ms' }} />
              </div>
              <span className="truncate text-slate-300 font-medium">
                {isSpeaking
                  ? (isPaused ? 'Voz en pausa...' : 'Explicando en voz alta...')
                  : (isListening ? '🎙️ Escuchando tu pregunta...' : 'Voz Femenina Natural CBTIS 55')}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isSpeaking && (
                <button
                  onClick={handleStopSpeaker}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Square className="w-2.5 h-2.5 fill-current" />
                  <span>Detener</span>
                </button>
              )}

              {/* Auto-Speak Answers Toggle */}
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setAutoSpeakReplies(!autoSpeakReplies);
                }}
                className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  autoSpeakReplies
                    ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
                title="Activar/desactivar lectura por voz de las respuestas"
              >
                {autoSpeakReplies ? <Volume2 className="w-3 h-3 text-cyan-400" /> : <VolumeX className="w-3 h-3 text-slate-500" />}
                <span>{autoSpeakReplies ? 'Voz Activa' : 'Voz Mute'}</span>
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-0">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'model' && (
                      <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[86%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-cyan-500 text-slate-950 font-semibold rounded-tr-none shadow-md'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-inner'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">
                        {msg.content}
                      </div>

                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className={`text-[9px] ${msg.role === 'user' ? 'text-slate-800' : 'text-slate-500'}`}>
                          {msg.timestamp}
                        </span>

                        {msg.role === 'model' && (
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              speechEngine.speak(msg.content);
                              setIsSpeaking(true);
                              setIsPaused(false);
                            }}
                            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                            title="Releer en voz alta este mensaje"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5 text-[10px] font-black">
                        TÚ
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Live Listening Waveform Bubble */}
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-400/50 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-cyan-300 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                        <span>Escuchando... {isAutoSending ? '(Enviando automáticamente)' : '(Pausa para enviar)'}</span>
                      </div>
                      <Mic className="w-4 h-4 text-cyan-400 animate-pulse" />
                    </div>

                    <p className="text-xs text-slate-200 italic font-mono bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                      {liveTranscript || 'Habla tu duda ahora... (ej: "¿Cómo se factoriza este término?")'}
                    </p>
                  </motion.div>
                )}

                {/* Loading state bubble */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2.5 items-center text-slate-400 text-xs py-1"
                  >
                    <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-cyan-300 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="ml-1">Tutor IA pensando...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Context Suggestion Chips */}
              <div className="px-3 py-1.5 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
                {sectionIntro.quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    disabled={isLoading}
                    onClick={() => handleSendMessage(q.text)}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-100 border border-slate-800 text-[10px] font-medium whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <span>{q.label}</span>
                  </button>
                ))}
              </div>

              {/* Input Bar: Text + 3D Microphone Button */}
              <div className="p-3 border-t border-slate-800 bg-slate-950/95 shrink-0">
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
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={isListening ? 'Escuchando tu voz...' : 'Pregunta o escribe tu duda...'}
                      disabled={isLoading}
                      className="w-full py-2.5 px-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60"
                    />
                  </div>

                  {/* 3D Microphone Button (STT with Auto-Send) */}
                  <button
                    type="button"
                    onClick={handleToggleMicrophone}
                    className={`p-2.5 rounded-2xl font-bold transition-all shadow-md cursor-pointer shrink-0 flex items-center justify-center ${
                      isListening
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/40 border-2 border-white animate-pulse'
                        : 'bg-gradient-to-b from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 shadow-cyan-500/20 border-b-2 border-cyan-600 active:translate-y-0.5'
                    }`}
                    title={isListening ? 'Detener micrófono' : 'Hablar por micrófono (Auto-envío al pausar)'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Send Text Button */}
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="p-2.5 rounded-2xl bg-slate-800 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold transition-all border border-slate-700 hover:border-cyan-400 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                    title="Enviar pregunta"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Footer Controls: Checkbox [ ] No volver a reproducir automáticamente */}
                <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-slate-400 border-t border-slate-900 pt-1.5">
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={!autoPlayEnabled}
                      onChange={(e) => handleToggleAutoPlay(!e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400/20 accent-cyan-400 cursor-pointer"
                    />
                    <span>No reproducir voz automáticamente al ingresar</span>
                  </label>

                  {onOpenFullModal && (
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        onOpenFullModal();
                      }}
                      className="text-cyan-400 hover:text-cyan-300 underline font-semibold cursor-pointer shrink-0"
                    >
                      Pantalla completa
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
