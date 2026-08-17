import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  RotateCcw, 
  Zap, 
  Award,
  Sparkles,
  Layers,
  Compass,
  Triangle,
  Activity,
  Infinity as InfinityIcon,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Mic,
  MicOff,
  Bot,
  Send,
  HelpCircle,
  RefreshCw,
  AlertTriangle,
  Shuffle,
  ShieldCheck,
  MoreVertical,
  Menu,
  Sliders,
  Sparkle
} from 'lucide-react';
import { TutorialLesson, ChatMessage } from '../types';
import { TUTORIAL_LESSONS } from '../data/tutorialsData';
import { generateDynamicCheckpoint, DynamicCheckpointQuestion } from '../utils/dynamicTutorialCheckpoints';
import { soundEngine } from '../utils/audio';
import { speechEngine } from '../utils/speechEngine';
import { formatMathExpression } from '../utils/mathFormatter';

interface InteractiveTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModuleId?: 'algebra-basica' | 'trigonometria' | 'calculo';
  completedTutorialIds: string[];
  onCompleteTutorial: (tutorialId: string, xpReward: number) => void;
}

export const InteractiveTutorialModal: React.FC<InteractiveTutorialModalProps> = ({
  isOpen,
  onClose,
  initialModuleId = 'algebra-basica',
  completedTutorialIds,
  onCompleteTutorial,
}) => {
  const [selectedModule, setSelectedModule] = useState<'algebra-basica' | 'trigonometria' | 'calculo'>(initialModuleId);
  const [activeTutorial, setActiveTutorial] = useState<TutorialLesson>(() => {
    return TUTORIAL_LESSONS.find(t => t.moduleId === initialModuleId) || TUTORIAL_LESSONS[0];
  });
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnsweredCheckpoint, setHasAnsweredCheckpoint] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  
  // Dynamic Checkpoint Single-Attempt System
  const [dynamicCheckpoint, setDynamicCheckpoint] = useState<DynamicCheckpointQuestion | null>(null);
  const [failedAttemptsCount, setFailedAttemptsCount] = useState(0);
  const [isRegeneratingQuestion, setIsRegeneratingQuestion] = useState(false);
  const regenTimerRef = useRef<any>(null);

  // Audio TTS & Sequential Auto-Play states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(true);
  const [autoPlayPref, setAutoPlayPref] = useState(() => speechEngine.getAutoPlayEnabled());
  const [autoPlayReplies, setAutoPlayReplies] = useState(true);

  // Drawer (Menú Lateral Desplegable 9:16)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Deep Mini-Chat (STT + Gemini) inside tutorial
  const [isMiniChatOpen, setIsMiniChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isListeningSTT, setIsListeningSTT] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');

  const autoAdvanceTimerRef = useRef<any>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const hasMountedTutorial = useRef<string | null>(null);

  // Interactive widget internal state
  // 1. Algebra Terms
  const [coeffX1, setCoeffX1] = useState(4);
  const [coeffX2, setCoeffX2] = useState(3);
  const [coeffY1, setCoeffY1] = useState(-2);
  const [coeffY2, setCoeffY2] = useState(5);

  // 2. Algebra FOIL
  const [foilA, setFoilA] = useState(3);
  const [foilB, setFoilB] = useState(4);

  // 3. Algebra Factor
  const [factorSquareA, setFactorSquareA] = useState(5);
  const [factorSquareB, setFactorSquareB] = useState(3);

  // 4. Trig Circle
  const [trigAngleDeg, setTrigAngleDeg] = useState(45);

  // 5. Trig Pythagoras
  const [catetoA, setCatetoA] = useState(6);
  const [catetoB, setCatetoB] = useState(8);

  // 6. Calc Derivative (Secant to Tangent)
  const [deltaX, setDeltaX] = useState(1.5);
  const [basePointX, setBasePointX] = useState(2);

  // 7. Calc Power Rule
  const [powerCoeff, setPowerCoeff] = useState(3);
  const [powerExp, setPowerExp] = useState(4);

  // 8. Calc Riemann
  const [riemannN, setRiemannN] = useState(6);

  // Cleanup speech & timers on unmount / close
  useEffect(() => {
    if (!isOpen) {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      if (regenTimerRef.current) clearTimeout(regenTimerRef.current);
      speechEngine.stop();
      speechEngine.stopSpeechRecognition();
      setIsSpeaking(false);
      setIsListeningSTT(false);
      setIsDrawerOpen(false);
    }
  }, [isOpen]);

  // Handle Escape key to close Drawer, Chat or Modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDrawerOpen) {
          setIsDrawerOpen(false);
        } else if (isMiniChatOpen) {
          setIsMiniChatOpen(false);
        } else {
          soundEngine.playClick();
          speechEngine.stop();
          speechEngine.stopSpeechRecognition();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDrawerOpen, isMiniChatOpen, onClose]);

  const currentStep = activeTutorial.steps[currentStepIdx] || activeTutorial.steps[0];
  const isLastStep = currentStepIdx === activeTutorial.steps.length - 1;
  const isTutorialCompleted = completedTutorialIds.includes(activeTutorial.id);
  const filteredTutorials = TUTORIAL_LESSONS.filter(t => t.moduleId === selectedModule);

  // Initialize or re-generate dynamic checkpoint whenever step changes
  useEffect(() => {
    if (currentStep.checkpointQuestion) {
      const dynamicQ = generateDynamicCheckpoint(activeTutorial.id, currentStep.stepNumber);
      setDynamicCheckpoint(dynamicQ);
    } else {
      setDynamicCheckpoint(null);
    }
    setSelectedOptionId(null);
    setHasAnsweredCheckpoint(false);
    setIsAnswerCorrect(null);
    setFailedAttemptsCount(0);
    setIsRegeneratingQuestion(false);
    if (regenTimerRef.current) clearTimeout(regenTimerRef.current);
  }, [activeTutorial.id, currentStepIdx]);

  // Generate enriched spoken text for a tutorial step
  const generateStepVoiceScript = (tutorial: TutorialLesson, stepIdx: number): string => {
    const step = tutorial.steps[stepIdx];
    if (!step) return '';
    let script = `Paso ${step.stepNumber}: ${step.title}. ${step.explanation}.`;
    if (step.mathExpression) {
      script += ` Observa la expresión en pantalla: ${step.mathExpression}.`;
    }
    if (step.checkpointQuestion) {
      script += ` Al terminar, comprueba tu comprensión en la pregunta interactiva de intento único.`;
    }
    return script;
  };

  // Play audio for a given step with optional sequential auto-advance
  const speakStepAudio = (stepIdx: number, allowAutoAdvance = autoAdvanceEnabled) => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    
    // Stop any ongoing STT or TTS
    speechEngine.stopSpeechRecognition();
    setIsListeningSTT(false);
    speechEngine.stop();

    if (!autoPlayPref) {
      setIsSpeaking(false);
      return;
    }

    const script = generateStepVoiceScript(activeTutorial, stepIdx);
    if (!script) return;

    setIsSpeaking(true);

    speechEngine.speak(script, {
      onStart: () => {
        setIsSpeaking(true);
      },
      onEnd: () => {
        setIsSpeaking(false);

        // Auto advance logic
        if (allowAutoAdvance) {
          const step = activeTutorial.steps[stepIdx];
          const isFinal = stepIdx >= activeTutorial.steps.length - 1;

          if (isFinal) {
            // Last step finished
            setTimeout(() => {
              speechEngine.speak('¡Excelente trabajo! Has completado todos los pasos de este tutorial interactivo.');
            }, 600);
          } else {
            // Check if step has an uncompleted checkpoint
            if (step.checkpointQuestion && (!hasAnsweredCheckpoint || !isAnswerCorrect)) {
              return;
            }

            // Smooth transition to next step
            autoAdvanceTimerRef.current = setTimeout(() => {
              handleNextStep(true);
            }, 1200);
          }
        }
      },
      onError: () => {
        setIsSpeaking(false);
      }
    });
  };

  // Auto-play when tutorial is first opened or switched
  useEffect(() => {
    if (isOpen && autoPlayPref) {
      const tutKey = `${activeTutorial.id}-${currentStepIdx}`;
      if (hasMountedTutorial.current !== tutKey) {
        hasMountedTutorial.current = tutKey;
        const timer = setTimeout(() => {
          speakStepAudio(currentStepIdx, autoAdvanceEnabled);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, activeTutorial.id, currentStepIdx, autoPlayPref]);

  // Reset states when changing tutorial
  const handleSelectTutorial = (tut: TutorialLesson) => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    if (regenTimerRef.current) clearTimeout(regenTimerRef.current);
    speechEngine.stop();
    soundEngine.playClick();
    setActiveTutorial(tut);
    setCurrentStepIdx(0);
    setSelectedOptionId(null);
    setHasAnsweredCheckpoint(false);
    setIsAnswerCorrect(null);
    setFailedAttemptsCount(0);
    hasMountedTutorial.current = null;
  };

  // Regenerate a brand new dynamic question after a failed single-attempt
  const handleRegenerateNewProblem = () => {
    if (regenTimerRef.current) clearTimeout(regenTimerRef.current);
    setIsRegeneratingQuestion(true);
    soundEngine.playClick();

    setTimeout(() => {
      const freshQ = generateDynamicCheckpoint(activeTutorial.id, currentStep.stepNumber);
      setDynamicCheckpoint(freshQ);
      setSelectedOptionId(null);
      setHasAnsweredCheckpoint(false);
      setIsAnswerCorrect(null);
      setIsRegeneratingQuestion(false);
    }, 300);
  };

  // Dynamic Checkpoint Single-Attempt Option Selection
  const handleOptionSelect = (optionId: string, isCorrect: boolean) => {
    if (hasAnsweredCheckpoint || isRegeneratingQuestion) return;
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    if (regenTimerRef.current) clearTimeout(regenTimerRef.current);

    setSelectedOptionId(optionId);
    setHasAnsweredCheckpoint(true);
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      soundEngine.playCorrect();
      if (autoAdvanceEnabled && !isLastStep) {
        speechEngine.speak('¡Correcto! Has resuelto este ejercicio al primer intento. Avanzando al siguiente paso.', {
          onEnd: () => {
            autoAdvanceTimerRef.current = setTimeout(() => {
              handleNextStep(true);
            }, 800);
          }
        });
      }
    } else {
      soundEngine.playWrong();
      const nextFailCount = failedAttemptsCount + 1;
      setFailedAttemptsCount(nextFailCount);

      if (nextFailCount >= 3) {
        // Safety limit reached: Pause automatic regeneration and proactively activate AI Tutor
        setIsMiniChatOpen(true);

        const proactiveTutorMsg: ChatMessage = {
          id: `tutor-pause-${Date.now()}`,
          role: 'model',
          content: `👋 ¡Hola estudiante de CBTIS 55! He notado que has tenido 3 intentos en este paso (**${currentStep.title}**). ¡No te preocupes!\n\n` +
            `• He pausado la generación automática para que repasemos con calma.\n` +
            `• Puedes escuchar nuevamente la explicación en audio o pedirme un ejemplo desglosado aquí mismo.\n` +
            `• Cuando estés listo para ponerlo a prueba, pulsa el botón **"Desbloquear y Generar Nuevo Ejercicio"**.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages(prev => [...prev, proactiveTutorMsg]);

        speechEngine.speak(
          'He pausado la generación de ejercicios tras 3 intentos. El Tutor IA está listo a tu derecha para resolver tus dudas o repasar la explicación antes de generar un nuevo ejercicio.',
          {
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
          }
        );
      } else {
        speechEngine.speak(
          nextFailCount === 2 
            ? 'Segundo intento incorrecto. Recuerda que cada ejercicio es de intento único. Generando una nueva variación dinámica...' 
            : 'Respuesta incorrecta. Recuerda: este ejercicio es de intento único. Generando un nuevo problema dinámico...'
        );

        // Automatically generate a new dynamic problem after 3.2 seconds
        regenTimerRef.current = setTimeout(() => {
          handleRegenerateNewProblem();
        }, 3200);
      }
    }
  };

  // Next step
  const handleNextStep = (isAuto = false) => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    if (regenTimerRef.current) clearTimeout(regenTimerRef.current);
    speechEngine.stop();

    if (!isLastStep) {
      if (!isAuto) soundEngine.playClick();
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      setSelectedOptionId(null);
      setHasAnsweredCheckpoint(false);
      setIsAnswerCorrect(null);
      setFailedAttemptsCount(0);
      hasMountedTutorial.current = `${activeTutorial.id}-${nextIdx}`;
      
      setTimeout(() => {
        speakStepAudio(nextIdx, autoAdvanceEnabled);
      }, 300);
    } else {
      soundEngine.playLevelUp();
      onCompleteTutorial(activeTutorial.id, activeTutorial.xpReward);
      speechEngine.speak(`¡Felicidades! Has completado el tutorial ${activeTutorial.title}. Ganaste ${activeTutorial.xpReward} puntos de experiencia.`);
    }
  };

  // Previous step (Repaso Navigation) -> Returns to previous step and IMMEDIATELY REPLAYS its audio explanation
  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      if (regenTimerRef.current) clearTimeout(regenTimerRef.current);
      speechEngine.stop();
      soundEngine.playClick();
      
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      setSelectedOptionId(null);
      setHasAnsweredCheckpoint(false);
      setIsAnswerCorrect(null);
      setFailedAttemptsCount(0);
      hasMountedTutorial.current = `${activeTutorial.id}-${prevIdx}`;

      // Re-play audio for previous step for seamless review
      setTimeout(() => {
        speakStepAudio(prevIdx, autoAdvanceEnabled);
      }, 300);
    }
  };

  // Repeat current step audio
  const handleRepeatCurrentStep = () => {
    soundEngine.playClick();
    speakStepAudio(currentStepIdx, autoAdvanceEnabled);
  };

  // Toggle audio speech playback
  const handleToggleAudioPlayback = () => {
    soundEngine.playClick();
    if (isSpeaking) {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      speechEngine.stop();
      setIsSpeaking(false);
    } else {
      speakStepAudio(currentStepIdx, autoAdvanceEnabled);
    }
  };

  // Handle Mini-Chat STT (Microphone) with Auto-Send on Pause
  const handleToggleMicrophone = () => {
    soundEngine.playClick();

    // Stop any ongoing tutorial step audio immediately
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    speechEngine.stop();
    setIsSpeaking(false);

    if (isListeningSTT) {
      speechEngine.stopSpeechRecognition();
      setIsListeningSTT(false);
      setLiveTranscript('');
      return;
    }

    setIsListeningSTT(true);
    setLiveTranscript('');

    const started = speechEngine.startSpeechRecognition({
      onResult: (transcript) => {
        setLiveTranscript(transcript);
        setChatInput(transcript);
      },
      onSpeechPauseAutoSend: (finalTranscript) => {
        soundEngine.playSuccess();
        setTimeout(() => {
          handleSendChatMessage(finalTranscript);
        }, 200);
      },
      onError: (err) => {
        console.warn('Speech rec error:', err);
        setIsListeningSTT(false);
      },
      onEnd: () => {
        setIsListeningSTT(false);
      }
    });

    if (!started) {
      setIsListeningSTT(false);
    }
  };

  // Send question to deep AI Tutor
  const handleSendChatMessage = async (textToSend?: string) => {
    const query = (textToSend ?? chatInput).trim();
    if (!query || isChatLoading) return;

    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    speechEngine.stop();
    speechEngine.stopSpeechRecognition();
    setIsListeningSTT(false);
    setLiveTranscript('');

    soundEngine.playClick();

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: chatMessages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          context: {
            currentModule: selectedModule,
            currentLevel: `Tutorial: ${activeTutorial.title} - Paso ${currentStep.stepNumber}: ${currentStep.title}`,
            currentQuestion: `Explicación actual: "${currentStep.explanation}". Expresión matemática: "${currentStep.mathExpression || 'N/A'}"`,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.reply || 'He recibido tu duda. ¿Qué parte de este paso te gustaría que desglosáramos?';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now() + 1}`,
        role: 'model',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages(prev => [...prev, botMsg]);
      soundEngine.playSuccess();

      if (autoPlayReplies) {
        setIsSpeaking(true);
        speechEngine.speak(botReply, {
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }

    } catch (err) {
      console.warn('Network issue in tutorial tutor, using backup pedagogical advice:', err);
      const fallbackReply = `Para dominar este **Paso ${currentStep.stepNumber} (${currentStep.title})**:\n• Observa con atención la regla matemática explicada.\n• Revisa los signos y el orden de las operaciones.\n• Prueba mover los controles interactivos de la pantalla para ver el efecto visual en tiempo real.`;
      
      const fallbackMsg: ChatMessage = {
        id: `bot-fb-${Date.now()}`,
        role: 'model',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
      
      if (autoPlayReplies) {
        setIsSpeaking(true);
        speechEngine.speak(fallbackReply, {
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }
    } finally {
      setIsChatLoading(false);
    }
  };

  const contextualPrompts = [
    { label: '🤔 ¿Por qué funciona esto?', text: `¿Por qué se cumple la regla o propiedad explicada en el Paso ${currentStep.stepNumber}: "${currentStep.title}"? Explícamelo con un ejemplo sencillo.` },
    { label: '🔢 Dame otro ejemplo paso a paso', text: `Dame un ejercicio similar al del Paso ${currentStep.stepNumber} (${activeTutorial.title}) y resuélvelo paso a paso explicándome cada movimiento.` },
    { label: '💡 ¿Cómo no equivocarme en los signos?', text: '¿Cuáles son los errores más comunes de signos o exponentes que suelen cometer los estudiantes en este tipo de ejercicios y cómo evitarlos?' }
  ];

  // Render Interactive Visualizer based on active tutorial
  const renderInteractiveWidget = () => {
    switch (activeTutorial.interactiveComponentId) {
      case 'algebra-terms':
        return (
          <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 rounded-2xl border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Laboratorio de Términos Semejantes
              </span>
              <span className="text-[11px] text-slate-400">Ajusta los coeficientes</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 mb-1 font-bold">Término 1 (x): {coeffX1}x</label>
                <input 
                  type="range" min="-10" max="10" value={coeffX1}
                  onChange={(e) => setCoeffX1(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 mb-1 font-bold">Término 2 (y): {coeffY1 > 0 ? `+${coeffY1}` : coeffY1}y</label>
                <input 
                  type="range" min="-10" max="10" value={coeffY1}
                  onChange={(e) => setCoeffY1(Number(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 mb-1 font-bold">Término 3 (x): {coeffX2 > 0 ? `+${coeffX2}` : coeffX2}x</label>
                <input 
                  type="range" min="-10" max="10" value={coeffX2}
                  onChange={(e) => setCoeffX2(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 mb-1 font-bold">Término 4 (y): {coeffY2 > 0 ? `+${coeffY2}` : coeffY2}y</label>
                <input 
                  type="range" min="-10" max="10" value={coeffY2}
                  onChange={(e) => setCoeffY2(Number(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-center">
              <div className="text-xs text-slate-400 mb-1">Expresión Expandida vs Simplificada:</div>
              <div className="font-mono text-sm sm:text-base font-bold text-slate-200">
                <span className="text-cyan-400">{coeffX1}x</span> {coeffY1 >= 0 ? `+ ${coeffY1}y` : `- ${Math.abs(coeffY1)}y`} {coeffX2 >= 0 ? `+ ${coeffX2}x` : `- ${Math.abs(coeffX2)}x`} {coeffY2 >= 0 ? `+ ${coeffY2}y` : `- ${Math.abs(coeffY2)}y`}
              </div>
              <div className="text-cyan-300 font-mono text-base sm:text-lg font-black mt-2">
                = <span className="text-cyan-400 font-extrabold">{coeffX1 + coeffX2}x</span> {coeffY1 + coeffY2 >= 0 ? `+ ${coeffY1 + coeffY2}y` : `- ${Math.abs(coeffY1 + coeffY2)}y`}
              </div>
            </div>
          </div>
        );

      case 'algebra-foil':
        const expandedMiddle = foilA + foilB;
        const expandedEnd = foilA * foilB;
        return (
          <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 rounded-2xl border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Cuadrícula de Áreas (x + a)(x + b)
              </span>
              <span className="text-[11px] text-slate-400">Modifica los lados a y b</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 mb-1 font-bold">Valor de a: +{foilA}</label>
                <input 
                  type="range" min="1" max="8" value={foilA}
                  onChange={(e) => setFoilA(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 mb-1 font-bold">Valor de b: +{foilB}</label>
                <input 
                  type="range" min="1" max="8" value={foilB}
                  onChange={(e) => setFoilB(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* 2x2 Area Visualization */}
            <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto text-center font-mono font-bold text-xs sm:text-sm">
              <div className="p-3 bg-cyan-950/80 border border-cyan-500/40 rounded-xl text-cyan-300">
                x · x = <span className="font-black text-cyan-200">x²</span>
              </div>
              <div className="p-3 bg-blue-950/80 border border-blue-500/40 rounded-xl text-blue-300">
                x · {foilB} = <span className="font-black text-blue-200">{foilB}x</span>
              </div>
              <div className="p-3 bg-amber-950/80 border border-amber-500/40 rounded-xl text-amber-300">
                {foilA} · x = <span className="font-black text-amber-200">{foilA}x</span>
              </div>
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300">
                {foilA} · {foilB} = <span className="font-black text-emerald-200">{expandedEnd}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-center font-mono">
              <div className="text-xs text-slate-400 mb-0.5">(x + {foilA})(x + {foilB}) =</div>
              <div className="text-cyan-300 text-base sm:text-lg font-black">
                x² + {expandedMiddle}x + {expandedEnd}
              </div>
            </div>
          </div>
        );

      case 'algebra-factor':
        return (
          <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 rounded-2xl border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Descomposición: a² - b² = (a - b)(a + b)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 mb-1 font-bold">Término a: {factorSquareA}</label>
                <input 
                  type="range" min="2" max="10" value={factorSquareA}
                  onChange={(e) => setFactorSquareA(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 mb-1 font-bold">Término b: {factorSquareB}</label>
                <input 
                  type="range" min="1" max={factorSquareA - 1} value={factorSquareB}
                  onChange={(e) => setFactorSquareB(Number(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/20 text-center font-mono">
              <div className="text-xs text-slate-400 mb-1">Diferencia de Cuadrados:</div>
              <div className="text-sm sm:text-base text-slate-200">
                {factorSquareA}² - {factorSquareB}² = <span className="text-rose-400">{factorSquareA * factorSquareA} - {factorSquareB * factorSquareB}</span> = <span className="font-bold text-white">{factorSquareA * factorSquareA - factorSquareB * factorSquareB}</span>
              </div>
              <div className="mt-2 text-cyan-300 text-sm sm:text-base font-black">
                ({factorSquareA} - {factorSquareB})({factorSquareA} + {factorSquareB}) = ({factorSquareA - factorSquareB}) × ({factorSquareA + factorSquareB}) = {factorSquareA * factorSquareA - factorSquareB * factorSquareB}
              </div>
            </div>
          </div>
        );

      case 'trig-circle':
        const rad = (trigAngleDeg * Math.PI) / 180;
        const cosVal = Math.cos(rad);
        const sinVal = Math.sin(rad);
        const tanVal = Math.abs(cosVal) < 0.0001 ? 'Indefinido' : Math.tan(rad).toFixed(3);
        
        // Coordinates for SVG circle (center 100, 100, radius 70)
        const svgCenterX = 100;
        const svgCenterY = 100;
        const svgR = 70;
        const pointX = svgCenterX + svgR * cosVal;
        const pointY = svgCenterY - svgR * sinVal; // SVG y is inverted

        return (
          <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 rounded-2xl border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> Círculo Unitario Dinámico (r = 1)
              </span>
              <span className="text-xs font-bold text-amber-300 font-mono">θ = {trigAngleDeg}° ({((trigAngleDeg * Math.PI)/180).toFixed(2)} rad)</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Interactive SVG Unit Circle */}
              <div className="relative w-48 h-48 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Axis */}
                  <line x1="20" y1="100" x2="180" y2="100" stroke="#475569" strokeWidth="1.5" />
                  <line x1="100" y1="20" x2="100" y2="180" stroke="#475569" strokeWidth="1.5" />
                  
                  {/* Unit Circle */}
                  <circle cx="100" cy="100" r={svgR} fill="none" stroke="#00f2ff" strokeWidth="2" strokeOpacity="0.4" />
                  
                  {/* Right triangle projections */}
                  <line x1="100" y1="100" x2={pointX} y2="100" stroke="#22d3ee" strokeWidth="3" />
                  <line x1={pointX} y1="100" x2={pointX} y2={pointY} stroke="#f43f5e" strokeWidth="3" />
                  <line x1="100" y1="100" x2={pointX} y2={pointY} stroke="#facc15" strokeWidth="2.5" />

                  {/* Point */}
                  <circle cx={pointX} cy={pointY} r="5" fill="#00f2ff" stroke="#ffffff" strokeWidth="2" />
                </svg>
                <span className="absolute top-1.5 left-2 text-[10px] text-slate-500 font-mono">II (+, -)</span>
                <span className="absolute top-1.5 right-2 text-[10px] text-slate-500 font-mono">I (+, +)</span>
                <span className="absolute bottom-1.5 left-2 text-[10px] text-slate-500 font-mono">III (-, -)</span>
                <span className="absolute bottom-1.5 right-2 text-[10px] text-slate-500 font-mono">IV (+, -)</span>
              </div>

              {/* Slider & Dynamic Values */}
              <div className="flex-1 w-full space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>Girar Ángulo (0° a 360°):</span>
                    <span className="text-cyan-400 font-mono">{trigAngleDeg}°</span>
                  </div>
                  <input 
                    type="range" min="0" max="360" value={trigAngleDeg}
                    onChange={(e) => setTrigAngleDeg(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  {/* Quick Angle Presets */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {[0, 30, 45, 60, 90, 180, 270, 360].map(deg => (
                      <button
                        key={deg}
                        onClick={() => setTrigAngleDeg(deg)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                          trigAngleDeg === deg ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>

                {/* Values Card */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 bg-slate-950 rounded-xl border border-cyan-500/30">
                    <span className="text-[10px] text-cyan-400 block font-bold">cos θ (X)</span>
                    <span className="text-sm font-black text-cyan-200">{cosVal.toFixed(3)}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-xl border border-rose-500/30">
                    <span className="text-[10px] text-rose-400 block font-bold">sin θ (Y)</span>
                    <span className="text-sm font-black text-rose-200">{sinVal.toFixed(3)}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-xl border border-amber-500/30">
                    <span className="text-[10px] text-amber-400 block font-bold">tan θ (Y/X)</span>
                    <span className="text-sm font-black text-amber-200">{tanVal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'trig-pythagoras':
        const hipotenusa = Math.sqrt(catetoA * catetoA + catetoB * catetoB);
        return (
          <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 rounded-2xl border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                <Triangle className="w-4 h-4" /> Teorema de Pitágoras & Identidad
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 mb-1 font-bold">Cateto a: {catetoA}</label>
                <input 
                  type="range" min="3" max="15" value={catetoA}
                  onChange={(e) => setCatetoA(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 mb-1 font-bold">Cateto b: {catetoB}</label>
                <input 
                  type="range" min="3" max="15" value={catetoB}
                  onChange={(e) => setCatetoB(Number(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/20 text-center font-mono">
              <div className="text-xs text-slate-400 mb-1">Hipotenusa c = √(a² + b²):</div>
              <div className="text-cyan-300 text-base sm:text-lg font-black">
                c = √({catetoA}² + {catetoB}²) = √({catetoA * catetoA + catetoB * catetoB}) = {hipotenusa.toFixed(2)}
              </div>
              <div className="text-[11px] text-emerald-400 font-bold mt-2">
                Identidad: ({catetoA}/{hipotenusa.toFixed(2)})² + ({catetoB}/{hipotenusa.toFixed(2)})² = 1.000 ✓
              </div>
            </div>
          </div>
        );

      case 'calc-derivative':
        // Tangent slope of f(x) = x^2 is 2x. Secant slope is ( (x+dx)^2 - x^2 ) / dx = 2x + dx
        const trueSlope = 2 * basePointX;
        const secantSlope = (Math.pow(basePointX + deltaX, 2) - Math.pow(basePointX, 2)) / deltaX;
        return (
          <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 rounded-2xl border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> De Secante a Tangente: f(x) = x²
              </span>
              <span className="text-xs text-amber-300 font-mono font-bold">En x = {basePointX}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 mb-1 font-bold">Punto Base x: {basePointX}</label>
                <input 
                  type="range" min="1" max="6" value={basePointX}
                  onChange={(e) => setBasePointX(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="flex justify-between">
                  <label className="text-slate-400 mb-1 font-bold">Incremento Δx (h → 0):</label>
                  <span className="text-cyan-400 font-mono font-bold">{deltaX.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0.05" max="3" step="0.05" value={deltaX}
                  onChange={(e) => setDeltaX(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-center">
              <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30">
                <span className="text-[10px] text-amber-400 block font-bold">Pendiente Secante (Δy / Δx)</span>
                <span className="text-base sm:text-lg font-black text-amber-300">{secantSlope.toFixed(3)}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/40">
                <span className="text-[10px] text-cyan-400 block font-bold">Derivada Exacta f'(x) = 2x</span>
                <span className="text-base sm:text-lg font-black text-cyan-300">{trueSlope.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Observa cómo al reducir <span className="text-amber-400 font-bold">Δx cerca de 0</span>, la secante se convierte en la derivada exacta.
            </p>
          </div>
        );

      case 'calc-power-rule':
        const derivedCoeff = powerCoeff * powerExp;
        const derivedExp = powerExp - 1;
        return (
          <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 rounded-2xl border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Generador de Regla de la Potencia
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 mb-1 font-bold">Coeficiente c: {powerCoeff}</label>
                <input 
                  type="range" min="1" max="12" value={powerCoeff}
                  onChange={(e) => setPowerCoeff(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 mb-1 font-bold">Exponente n: {powerExp}</label>
                <input 
                  type="range" min="2" max="8" value={powerExp}
                  onChange={(e) => setPowerExp(Number(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/20 text-center font-mono">
              <div className="text-xs text-slate-400 mb-1">Función Original: f(x) = {powerCoeff}x^{powerExp}</div>
              <div className="text-xs text-slate-400 mb-1">Paso: d/dx = {powerCoeff} · {powerExp} · x^({powerExp}-1)</div>
              <div className="text-cyan-300 text-base sm:text-lg font-black">
                f'(x) = {derivedCoeff}x{derivedExp === 1 ? '' : `^${derivedExp}`}
              </div>
            </div>
          </div>
        );

      case 'calc-riemann':
        // Area under f(x) = x^2 from 0 to 3: Exact = [x^3 / 3]_0^3 = 27/3 = 9.00
        const exactArea = 9.0;
        const dx = 3 / riemannN;
        let sumArea = 0;
        for (let i = 1; i <= riemannN; i++) {
          const x_i = i * dx;
          sumArea += (x_i * x_i) * dx;
        }

        return (
          <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 rounded-2xl border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                <InfinityIcon className="w-4 h-4" /> Sumas de Riemann para ∫₀³ x² dx
              </span>
              <span className="text-xs text-cyan-300 font-mono font-bold">n = {riemannN} rectángulos</span>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400 mb-1 font-bold">
                <span>Número de particiones (n):</span>
                <span className="text-cyan-400 font-mono font-bold">{riemannN}</span>
              </div>
              <input 
                type="range" min="2" max="40" value={riemannN}
                onChange={(e) => setRiemannN(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-center">
              <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30">
                <span className="text-[10px] text-amber-400 block font-bold">Área Estimada (Riemann)</span>
                <span className="text-base sm:text-lg font-black text-amber-300">{sumArea.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/40">
                <span className="text-[10px] text-cyan-400 block font-bold">Integral Exacta (∫₀³ x² dx)</span>
                <span className="text-base sm:text-lg font-black text-cyan-300">{exactArea.toFixed(2)}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 md:p-4 bg-slate-950/75 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundEngine.playClick();
          speechEngine.stop();
          speechEngine.stopSpeechRecognition();
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-5xl h-full sm:h-[94vh] max-h-[100vh] sm:max-h-[94vh] flex flex-col rounded-none sm:rounded-[28px] bg-slate-50 border border-slate-200/90 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ========================================================================= */}
        {/* ULTRA-COMPACT MINIMALIST HEADER (~52px) */}
        {/* ========================================================================= */}
        <div className="px-3 sm:px-5 py-2.5 bg-white/95 backdrop-blur-md border-b border-slate-200/90 flex items-center justify-between gap-2 z-30 shrink-0 shadow-xs">
          
          {/* Left: Module icon & Tutorial Title + Step Progress Pill */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-xl bg-cyan-100 border border-cyan-200 text-cyan-800 shrink-0 shadow-xs">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 truncate">
                <span className="text-cyan-800 truncate">
                  {selectedModule === 'algebra-basica' ? 'Álgebra' : selectedModule === 'trigonometria' ? 'Trigonometría' : 'Cálculo'}
                </span>
                <span>•</span>
                <span className="text-slate-700 font-bold">Paso {currentStep.stepNumber}/{activeTutorial.steps.length}</span>
              </div>
              <h2 className="text-xs sm:text-sm font-black text-slate-900 truncate tracking-tight">
                {activeTutorial.title}
              </h2>
            </div>
          </div>

          {/* Right: Quick Action Controls & Close Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Quick Voice / Audio status pill */}
            <button
              onClick={handleToggleAudioPlayback}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isSpeaking 
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black ring-2 ring-cyan-300 animate-pulse shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={isSpeaking ? "Pausar narración de voz" : "Escuchar paso con voz natural"}
            >
              {isSpeaking ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span className="hidden md:inline">{isSpeaking ? 'Explicando' : 'Audio'}</span>
            </button>

            {/* Quick Tutor IA Launcher */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsMiniChatOpen(prev => !prev);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border ${
                isMiniChatOpen 
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black ring-2 ring-cyan-400/30'
                  : 'bg-white hover:bg-slate-100 text-cyan-800 border-cyan-200'
              }`}
              title="Abrir Tutor IA"
            >
              <Bot className="w-4 h-4 text-cyan-700" />
              <span className="hidden sm:inline">Tutor IA</span>
              {chatMessages.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] flex items-center justify-center font-mono">
                  {chatMessages.length}
                </span>
              )}
            </button>

            {/* 3-Dots Menu Button: Opens Slide-Over Drawer */}
            <button
              id="tutorial-drawer-toggle-btn"
              onClick={() => {
                soundEngine.playClick();
                setIsDrawerOpen(prev => !prev);
              }}
              className={`p-2 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer border shadow-xs ${
                isDrawerOpen 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Abrir Menú de Temas y Audio (Drawer)"
            >
              <MoreVertical className="w-4 h-4" />
              <span className="hidden lg:inline font-bold">Menú</span>
            </button>

            {/* Prominent Close Modal Button (X) */}
            <button
              id="tutorial-modal-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playClick();
                speechEngine.stop();
                speechEngine.stopSpeechRecognition();
                onClose();
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all shadow-xs cursor-pointer active:scale-95 ml-1"
              title="Cerrar tutorial (Esc)"
              aria-label="Cerrar tutorial"
            >
              <X className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* Step Progress Line */}
        <div className="w-full bg-slate-200 h-1 overflow-hidden shrink-0">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 transition-all duration-300"
            style={{ width: `${((currentStepIdx + 1) / activeTutorial.steps.length) * 100}%` }}
          />
        </div>

        {/* ========================================================================= */}
        {/* SLIDE-OVER DRAWER (Temas, Lecciones y Controles de Voz) */}
        {/* ========================================================================= */}
        {isDrawerOpen && (
          <div 
            className="absolute inset-0 z-40 bg-slate-950/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
            onClick={() => setIsDrawerOpen(false)}
          >
            <div 
              className="w-full sm:w-96 max-w-[92vw] h-full bg-white/95 backdrop-blur-xl border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="p-4 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-600" />
                  <span className="font-black text-sm text-slate-900">Menú de Temas y Audio</span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
                
                {/* Section 1: Materias / Módulos */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider block">
                    1. Materia Matemática
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'algebra-basica', label: 'Álgebra' },
                      { id: 'trigonometria', label: 'Trig' },
                      { id: 'calculo', label: 'Cálculo' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          soundEngine.playClick();
                          setSelectedModule(m.id as any);
                          const first = TUTORIAL_LESSONS.find(t => t.moduleId === m.id);
                          if (first) handleSelectTutorial(first);
                        }}
                        className={`p-2 rounded-xl text-center font-bold text-xs transition-all cursor-pointer border ${
                          selectedModule === m.id
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: Lecciones del Módulo */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider block">
                    2. Lecciones Interactivas
                  </span>
                  <div className="space-y-1.5">
                    {filteredTutorials.map((tut) => {
                      const isDone = completedTutorialIds.includes(tut.id);
                      const isCurrent = activeTutorial.id === tut.id;
                      return (
                        <button
                          key={tut.id}
                          onClick={() => {
                            handleSelectTutorial(tut);
                            setIsDrawerOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-xl text-left font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer border ${
                            isCurrent
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <Sparkles className="w-4 h-4 text-cyan-500 shrink-0" />
                            )}
                            <span className="truncate">{tut.title}</span>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono shrink-0 ${
                            isCurrent ? 'bg-slate-800 text-cyan-300' : 'bg-slate-200 text-slate-600'
                          }`}>
                            +{tut.xpReward} XP
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: Audio TTS ADN Toolbar */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-cyan-950 text-cyan-100 border border-cyan-800/60 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-cyan-300 tracking-wider flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                      Audio TTS ADN
                    </span>
                    {isSpeaking && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black animate-pulse">
                        Narrando
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleToggleAudioPlayback}
                      className={`p-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSpeaking 
                          ? 'bg-cyan-400 text-slate-950 shadow-md ring-2 ring-cyan-300'
                          : 'bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/50'
                      }`}
                    >
                      {isSpeaking ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      <span>{isSpeaking ? 'Pausar' : 'Escuchar'}</span>
                    </button>

                    <button
                      onClick={handleRepeatCurrentStep}
                      className="p-2.5 rounded-xl bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Repetir</span>
                    </button>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-cyan-800/40">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={autoAdvanceEnabled}
                        onChange={(e) => {
                          soundEngine.playClick();
                          setAutoAdvanceEnabled(e.target.checked);
                        }}
                        className="w-4 h-4 rounded border-cyan-700 text-cyan-500 focus:ring-cyan-400 accent-cyan-400 cursor-pointer"
                      />
                      <span className="text-[11px] font-medium">Avance automático al terminar audio</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-200">
                      <input
                        type="checkbox"
                        checked={!autoPlayPref}
                        onChange={(e) => {
                          soundEngine.playClick();
                          const val = !e.target.checked;
                          setAutoPlayPref(val);
                          speechEngine.setAutoPlayEnabled(val);
                        }}
                        className="w-3.5 h-3.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 accent-cyan-400 cursor-pointer"
                      />
                      <span className="text-[11px]">No reproducir automáticamente</span>
                    </label>
                  </div>
                </div>

                {/* Section 4: Acceso Rápido Tutor IA */}
                <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Bot className="w-4 h-4 text-cyan-700" />
                    <span>¿Dudas sobre este paso?</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsMiniChatOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Bot className="w-4 h-4" />
                    Consultar al Tutor IA
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CANVAS PRINCIPAL INMERSIVO (85-90% DEL ÁREA INTERACTIVA) */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/50 relative">
          
          {/* Main Tutorial Scroll Canvas */}
          <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-4 pb-24 sm:pb-22">
            
            {/* Step Concept Explanation Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 text-xs flex items-center justify-center font-mono font-black shrink-0">
                    {currentStep.stepNumber}
                  </span>
                  <span className="break-words">{currentStep.title}</span>
                </h3>

                <button
                  onClick={() => speakStepAudio(currentStepIdx, false)}
                  className="px-2 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                  title="Escuchar narración de este concepto"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="hidden sm:inline">Narrar</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                {currentStep.explanation}
              </p>

              {currentStep.mathExpression && (
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200/90 font-mono text-xs sm:text-sm font-bold text-cyan-800 overflow-x-auto">
                  {formatMathExpression(currentStep.mathExpression)}
                </div>
              )}
            </div>

            {/* Interactive Lab Visualizer */}
            {renderInteractiveWidget()}

            {/* Checkpoint Question (Dynamic Single-Attempt System) */}
            {currentStep.checkpointQuestion && (
              <div className={`p-4 sm:p-5 rounded-2xl bg-white border shadow-sm space-y-3 transition-all duration-300 ${
                isRegeneratingQuestion ? 'opacity-50 scale-[0.99]' : 'opacity-100 scale-100'
              } ${
                hasAnsweredCheckpoint 
                  ? isAnswerCorrect 
                    ? 'border-emerald-300 ring-2 ring-emerald-100' 
                    : 'border-rose-300 ring-2 ring-rose-100'
                  : 'border-slate-200'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-amber-100 text-amber-800">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                      Comprobación Interactiva del Paso {currentStep.stepNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200 text-[10px] font-bold flex items-center gap-1">
                      <Shuffle className="w-3 h-3 text-cyan-600" />
                      Intento Único Dinámico
                    </span>
                    {failedAttemptsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black">
                        Reintento #{failedAttemptsCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Statement */}
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <p className="text-sm font-black text-slate-900 leading-snug">
                    {dynamicCheckpoint?.question || currentStep.checkpointQuestion.question}
                  </p>
                </div>

                {/* Options List (Single Attempt) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {(dynamicCheckpoint?.options || currentStep.checkpointQuestion.options).map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    let btnStyle = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 shadow-sm';
                    if (hasAnsweredCheckpoint) {
                      if (opt.isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-black shadow-sm ring-1 ring-emerald-300';
                      } else if (isSelected && !opt.isCorrect) {
                        btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-bold ring-1 ring-rose-300';
                      } else {
                        btnStyle = 'opacity-40 bg-slate-50 border-slate-200 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleOptionSelect(opt.id, opt.isCorrect)}
                        disabled={hasAnsweredCheckpoint || isRegeneratingQuestion}
                        className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center gap-2.5 ${btnStyle}`}
                      >
                        <span className={`w-5 h-5 rounded-lg font-mono font-bold flex items-center justify-center shrink-0 text-[11px] ${
                          hasAnsweredCheckpoint && opt.isCorrect
                            ? 'bg-emerald-600 text-white'
                            : hasAnsweredCheckpoint && isSelected && !opt.isCorrect
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {opt.id}
                        </span>
                        <span className="font-bold break-words flex-1">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Box */}
                {hasAnsweredCheckpoint && (
                  <div className="space-y-2 pt-1">
                    <div className={`p-3.5 rounded-xl text-xs font-medium border flex items-start gap-2.5 ${
                      isAnswerCorrect 
                        ? 'bg-emerald-50/90 text-emerald-900 border-emerald-200' 
                        : 'bg-rose-50/90 text-rose-900 border-rose-200'
                    }`}>
                      <div className="mt-0.5 shrink-0">
                        {isAnswerCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="font-black text-xs">
                          {isAnswerCorrect ? '¡Excelente! Respuesta correcta al primer intento' : 'Respuesta incorrecta — Intento único agotado'}
                        </div>
                        <p className="text-[11px] leading-relaxed opacity-95">
                          {dynamicCheckpoint?.explanation || currentStep.checkpointQuestion.explanation}
                        </p>
                      </div>
                    </div>

                    {/* Safety Pause Banner on 3 Consecutive Failures */}
                    {!isAnswerCorrect && failedAttemptsCount >= 3 ? (
                      <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl space-y-3 text-amber-950 shadow-sm">
                        <div className="flex items-start gap-2.5">
                          <div className="p-2 rounded-xl bg-amber-200 text-amber-900 shrink-0 mt-0.5">
                            <Bot className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs uppercase tracking-wider text-amber-900">
                                🛡️ Pausa de Aprendizaje • Tutor IA Activado
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black">
                                3 Intentos
                              </span>
                            </div>
                            <p className="text-xs text-amber-900 leading-relaxed font-medium">
                              Hemos pausado la generación automática de ejercicios para que consolides el concepto sin presión. Te recomendamos repasar el audio o pedirle al Tutor IA una explicación desglosada con ejemplos paso a paso.
                            </p>
                          </div>
                        </div>

                        {/* Direct Action Buttons for Tutor IA Support */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                          <button
                            onClick={() => speakStepAudio(currentStepIdx, false)}
                            className="px-3 py-2 rounded-xl bg-white hover:bg-amber-100/80 border border-amber-300 text-amber-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4 text-amber-700" />
                            Repasar Audio
                          </button>

                          <button
                            onClick={() => {
                              setIsMiniChatOpen(true);
                              handleSendChatMessage(`¿Puedes explicarme paso a paso cómo resolver este ejercicio de "${activeTutorial.title}" con un ejemplo claro y desglosado?`);
                            }}
                            className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                          >
                            <Bot className="w-4 h-4" />
                            Pedir Ejemplo a Tutor
                          </button>

                          <button
                            onClick={handleRegenerateNewProblem}
                            disabled={isRegeneratingQuestion}
                            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                          >
                            <Zap className="w-4 h-4 text-amber-400" />
                            Desbloquear y Probar
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Under 3 failures: Standard re-attempt flow with automatic generation countdown */
                      !isAnswerCorrect && (
                        <div className="space-y-2">
                          {failedAttemptsCount === 2 && (
                            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-2 text-xs text-amber-900">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                <span className="text-[11px] font-bold">
                                  2º intento fallido. Te sugerimos escuchar el audio antes del 3º intento.
                                </span>
                              </div>
                              <button
                                onClick={() => speakStepAudio(currentStepIdx, false)}
                                className="px-2 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-[10px] flex items-center gap-1 shrink-0 cursor-pointer"
                              >
                                <Volume2 className="w-3 h-3" />
                                Audio
                              </button>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-600" />
                              Generando nueva variación dinámica...
                            </span>
                            <button
                              onClick={handleRegenerateNewProblem}
                              disabled={isRegeneratingQuestion}
                              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              Probar Nueva Variación Ahora
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Deep Mini-Chat Panel (Collapsible / Side Drawer with STT & Auto-Send) */}
          {isMiniChatOpen && (
            <div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-slate-200 bg-white flex flex-col h-80 md:h-auto animate-in slide-in-from-right-4 duration-200">
              
              {/* Mini-Chat Header */}
              <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black tracking-tight text-cyan-300">Tutor IA Interactivo</h4>
                    <span className="text-[10px] text-slate-400 block">Explicaciones Paso a Paso</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setAutoPlayReplies(prev => !prev);
                    }}
                    className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      autoPlayReplies
                        ? 'bg-cyan-500/30 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title={autoPlayReplies ? 'Voz del tutor activada' : 'Voz del tutor silenciada'}
                  >
                    {autoPlayReplies ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setIsMiniChatOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick contextual chips */}
              <div className="p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto flex gap-1.5 text-[10px] whitespace-nowrap">
                {contextualPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChatMessage(p.text)}
                    className="px-2 py-1 rounded-lg bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 border border-slate-200 transition-all font-semibold cursor-pointer shrink-0"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Chat Message History */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 text-xs">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                    <HelpCircle className="w-8 h-8 text-cyan-500 mb-2 opacity-60" />
                    <p className="font-bold text-slate-600 mb-1">¿Tienes dudas sobre este paso?</p>
                    <p className="text-[11px] leading-relaxed">
                      Escribe tu pregunta o presiona el <span className="text-cyan-600 font-bold">micrófono</span> para consultar por voz al tutor.
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`p-2.5 rounded-2xl max-w-[88%] text-xs font-medium leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-cyan-600 text-white rounded-br-none shadow-sm'
                            : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">{msg.timestamp}</span>
                    </div>
                  ))
                )}

                {isChatLoading && (
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-500 max-w-[80%] shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse [animation-delay:0.4s]" />
                    <span className="text-[11px] font-semibold text-cyan-700">El tutor está respondiendo...</span>
                  </div>
                )}
                <div ref={chatMessagesEndRef} />
              </div>

              {/* Listening Transcript preview */}
              {isListeningSTT && (
                <div className="p-2 bg-rose-50 border-t border-rose-200 text-[11px] text-rose-800 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="font-bold">Escuchando:</span>
                    <span className="truncate italic">{liveTranscript || 'Habla ahora...'}</span>
                  </div>
                  <span className="text-[9px] text-rose-600 font-mono shrink-0 ml-1">Pausa para enviar</span>
                </div>
              )}

              {/* Chat Input & STT Controls */}
              <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5">
                <button
                  onClick={handleToggleMicrophone}
                  className={`p-2 rounded-xl transition-all cursor-pointer border ${
                    isListeningSTT
                      ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300 animate-bounce'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                  title={isListeningSTT ? 'Detener micrófono' : 'Preguntar con voz (STT)'}
                >
                  {isListeningSTT ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-cyan-600" />}
                </button>

                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChatMessage();
                    }
                  }}
                  placeholder="Escribe tu duda al tutor..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />

                <button
                  onClick={() => handleSendChatMessage()}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-sm cursor-pointer"
                  title="Enviar pregunta"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* FLOATING MINIMALIST BOTTOM NAVIGATION (ADN DESIGN - 9:16 OPTIMIZED) */}
        {/* ========================================================================= */}
        <div className="absolute bottom-2.5 sm:bottom-4 inset-x-2 sm:inset-x-6 z-30 pointer-events-none flex justify-center">
          <div className="w-full max-w-2xl px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/92 dark:bg-slate-900/92 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/10 flex items-center justify-between gap-2 pointer-events-auto">
            
            {/* Previous Step (Repaso) -> Triggers step decrement + immediate audio replay */}
            <button
              id="tutorial-prev-btn"
              onClick={handlePrevStep}
              disabled={currentStepIdx === 0}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                currentStepIdx === 0
                  ? 'opacity-40 bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-xs active:scale-95'
              }`}
              title="Repasar paso anterior con audio"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Anterior</span>
            </button>

            {/* Middle Quick Actions: Replay audio + Completed Status badge */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                id="tutorial-repeat-audio-floating-btn"
                onClick={handleRepeatCurrentStep}
                className="px-2.5 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
                title="Repetir narración del paso"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Repetir Audio</span>
              </button>

              {isTutorialCompleted && (
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-xl font-bold text-[10px] hidden md:flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Completado
                </span>
              )}
            </div>

            {/* Next / Finalize Step Button */}
            <button
              id="tutorial-next-btn"
              onClick={() => handleNextStep(false)}
              disabled={Boolean(currentStep.checkpointQuestion && (!hasAnsweredCheckpoint || !isAnswerCorrect))}
              className={`px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md ${
                currentStep.checkpointQuestion && (!hasAnsweredCheckpoint || !isAnswerCorrect)
                  ? 'opacity-45 bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : isLastStep
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black'
              }`}
            >
              {isLastStep ? (
                <>
                  <Award className="w-4 h-4" />
                  <span>¡Finalizar! (+{activeTutorial.xpReward} XP)</span>
                </>
              ) : (
                <>
                  <span>Siguiente Paso</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
