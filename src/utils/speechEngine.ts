/**
 * CBTIS 55 MATH - Motor de Síntesis de Voz (TTS) y Reconocimiento de Voz (STT)
 * Optimizado para voz femenina natural en español (Edge TTS, Google Español, Microsoft Sabina / Dalia, etc.)
 */

const AUTOPLAY_STORAGE_KEY = 'cbtis55_voice_autoplay_pref_v1';

export class SpeechEngine {
  private static instance: SpeechEngine;
  private synth: SpeechSynthesis | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;
  private isPausedState: boolean = false;
  private autoPlayEnabled: boolean = true;
  private recognition: any = null;
  private isListeningState: boolean = false;
  private silenceTimer: any = null;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }

    // Load user preference for auto-play
    if (typeof window !== 'undefined') {
      const savedPref = localStorage.getItem(AUTOPLAY_STORAGE_KEY);
      if (savedPref !== null) {
        this.autoPlayEnabled = savedPref === 'true';
      }
    }
  }

  public static getInstance(): SpeechEngine {
    if (!SpeechEngine.instance) {
      SpeechEngine.instance = new SpeechEngine();
    }
    return SpeechEngine.instance;
  }

  /**
   * Carga y selecciona la mejor voz femenina natural disponible en español
   */
  private loadVoices(): void {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    // Prioridad de voces femeninas naturales en español
    const femaleSpanishKeywords = [
      'sabina', 'dalia', 'paloma', 'paulina', 'monica', 'mónica',
      'luciana', 'penelope', 'penélope', 'sofia', 'sofía', 'elena',
      'carmen', 'rosa', 'mia', 'mía', 'google español', 'mexico',
      'natural', 'online', 'neural'
    ];

    const spanishVoices = voices.filter(v => 
      v.lang.startsWith('es') || v.lang.includes('ES') || v.lang.includes('MX')
    );

    // 1. Buscar voz femenina en español mexicano o latino con palabras clave
    let bestVoice = spanishVoices.find(v => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      const isFemaleKeyword = femaleSpanishKeywords.some(kw => name.includes(kw));
      const isMexicanOrLatAm = lang.includes('mx') || lang.includes('419') || lang.includes('us');
      return isFemaleKeyword && isMexicanOrLatAm;
    });

    // 2. Si no, buscar cualquier voz con palabra clave femenina en español
    if (!bestVoice) {
      bestVoice = spanishVoices.find(v => {
        const name = v.name.toLowerCase();
        return femaleSpanishKeywords.some(kw => name.includes(kw));
      });
    }

    // 3. Si no, cualquier voz en español mexicano (es-MX)
    if (!bestVoice) {
      bestVoice = spanishVoices.find(v => v.lang.toLowerCase().includes('mx'));
    }

    // 4. Si no, la primera voz en español disponible
    if (!bestVoice && spanishVoices.length > 0) {
      bestVoice = spanishVoices[0];
    }

    this.selectedVoice = bestVoice || null;
  }

  /**
   * Obtiene la preferencia de autoreproducción
   */
  public getAutoPlayEnabled(): boolean {
    return this.autoPlayEnabled;
  }

  /**
   * Guarda la preferencia de no volver a reproducir automáticamente
   */
  public setAutoPlayEnabled(enabled: boolean): void {
    this.autoPlayEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTOPLAY_STORAGE_KEY, String(enabled));
    }
  }

  /**
   * Limpia texto con notación matemática para una locución fluida y natural
   */
  public cleanTextForSpeech(rawText: string): string {
    let clean = rawText
      // Remove markdown bold/italic
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/#+\s/g, '')
      // Math friendly phonetic replacements
      .replace(/\^2/g, ' al cuadrado ')
      .replace(/\^3/g, ' al cubo ')
      .replace(/\^(\d+)/g, ' elevado a la $1 ')
      .replace(/x\^2/g, ' x al cuadrado ')
      .replace(/x\^3/g, ' x al cubo ')
      .replace(/√(\w+|\d+)/g, ' raíz cuadrada de $1 ')
      .replace(/sqrt\((.*?)\)/g, ' raíz cuadrada de $1 ')
      .replace(/dy\/dx/g, ' derivada de y respecto a x ')
      .replace(/f'\(x\)/g, ' f prima de x ')
      .replace(/∫/g, ' integral de ')
      .replace(/π/g, ' pi ')
      .replace(/θ/g, ' theta ')
      .replace(/°/g, ' grados ')
      .replace(/≤/g, ' menor o igual que ')
      .replace(/≥/g, ' mayor o igual que ')
      .replace(/≠/g, ' diferente de ')
      .replace(/≈/g, ' aproximadamente ')
      .replace(/±/g, ' más o menos ')
      .replace(/\s+/g, ' ')
      .trim();

    return clean;
  }

  /**
   * Reproduce una explicación por voz TTS femenina natural
   */
  public speak(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err?: any) => void;
      rate?: number;
      pitch?: number;
    }
  ): void {
    if (!this.synth) {
      options?.onError?.(new Error('SpeechSynthesis no soportado en este navegador'));
      return;
    }

    // Stop any ongoing speech
    this.stop();

    if (!this.selectedVoice) {
      this.loadVoices();
    }

    const spokenText = this.cleanTextForSpeech(text);
    if (!spokenText) return;

    try {
      const utterance = new SpeechSynthesisUtterance(spokenText);
      
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
        utterance.lang = this.selectedVoice.lang || 'es-MX';
      } else {
        utterance.lang = 'es-MX';
      }

      // Parámetros acústicos optimizados para voz femenina cálida y pedagógica
      utterance.rate = options?.rate ?? 0.96;
      utterance.pitch = options?.pitch ?? 1.08;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        this.isSpeakingState = true;
        this.isPausedState = false;
        options?.onStart?.();
      };

      utterance.onend = () => {
        this.isSpeakingState = false;
        this.isPausedState = false;
        this.currentUtterance = null;
        options?.onEnd?.();
      };

      utterance.onerror = (e) => {
        // 'interrupted' or 'canceled' are normal when user changes screen or pauses
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('TTS Speech error:', e);
        }
        this.isSpeakingState = false;
        this.isPausedState = false;
        this.currentUtterance = null;
        options?.onError?.(e);
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch (e) {
      console.error('TTS execution error', e);
      this.isSpeakingState = false;
      options?.onError?.(e);
    }
  }

  /**
   * Pausa la locución actual
   */
  public pause(): void {
    if (this.synth && this.isSpeakingState && !this.isPausedState) {
      this.synth.pause();
      this.isPausedState = true;
    }
  }

  /**
   * Reanuda la locución pausada
   */
  public resume(): void {
    if (this.synth && this.isPausedState) {
      this.synth.resume();
      this.isPausedState = false;
    }
  }

  /**
   * Detiene por completo la locución
   */
  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeakingState = false;
    this.isPausedState = false;
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public isPaused(): boolean {
    return this.isPausedState;
  }

  /**
   * Reconocimiento de voz (STT) con auto-envío al detectar pausa en el habla
   */
  public startSpeechRecognition(callbacks: {
    onResult: (transcript: string, isFinal: boolean) => void;
    onSpeechPauseAutoSend: (finalTranscript: string) => void;
    onError: (error: string) => void;
    onEnd: () => void;
  }): boolean {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      callbacks.onError('El reconocimiento de voz no está soportado en este navegador. Usa Chrome o Edge.');
      return false;
    }

    try {
      this.stopSpeechRecognition();
      // Stop TTS if speaking so mic doesn't record the tutor's own voice
      this.stop();

      const rec = new SpeechRec();
      rec.lang = 'es-MX';
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      let accumulatedFinal = '';
      let latestTranscript = '';

      const triggerAutoSend = () => {
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
        const textToSend = (accumulatedFinal || latestTranscript).trim();
        if (textToSend.length > 0) {
          this.stopSpeechRecognition();
          callbacks.onSpeechPauseAutoSend(textToSend);
        }
      };

      const resetSilenceTimer = () => {
        if (this.silenceTimer) clearTimeout(this.silenceTimer);
        // Si el usuario deja de hablar durante 1300ms, se envía de inmediato
        this.silenceTimer = setTimeout(() => {
          triggerAutoSend();
        }, 1300);
      };

      rec.onstart = () => {
        this.isListeningState = true;
      };

      rec.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            accumulatedFinal += (accumulatedFinal ? ' ' : '') + transcript;
          } else {
            interim += transcript;
          }
        }

        latestTranscript = accumulatedFinal + (interim ? ' ' + interim : '');
        callbacks.onResult(latestTranscript, false);

        // Reset timer upon hearing active speech
        resetSilenceTimer();
      };

      rec.onspeechend = () => {
        // User stopped speaking detected by browser engine
        resetSilenceTimer();
      };

      rec.onerror = (e: any) => {
        console.warn('SpeechRecognition error:', e);
        if (e.error !== 'no-speech' && e.error !== 'aborted') {
          callbacks.onError(`Error de micrófono: ${e.error}`);
        }
      };

      rec.onend = () => {
        this.isListeningState = false;
        callbacks.onEnd();
      };

      this.recognition = rec;
      rec.start();
      return true;
    } catch (err: any) {
      console.error('Error starting recognition', err);
      callbacks.onError('No se pudo acceder al micrófono.');
      return false;
    }
  }

  public stopSpeechRecognition(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.recognition = null;
    }
    this.isListeningState = false;
  }

  public isListening(): boolean {
    return this.isListeningState;
  }
}

export const speechEngine = SpeechEngine.getInstance();
