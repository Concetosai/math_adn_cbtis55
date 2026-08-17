import { ModuleId, UserProgress, LeaderboardEntry, AITutorConfig } from '../types';
import { MATH_MODULES } from '../data/mathModules';

const STORAGE_KEY = 'math_adn_progress_v2';
const LEADERBOARD_KEY = 'math_adn_leaderboard_v1';
const TUTOR_CONFIG_KEY = 'cbtis55_tutor_config_v1';

export const DEFAULT_TUTOR_CONFIG: AITutorConfig = {
  teacherName: 'Academia de Matemáticas CBTIS 55',
  pinCode: '5500',
  systemPrompt: `Eres el Tutor Virtual y Asistente Oficial de Matemáticas del CBTIS 55 (CBTIS 55 MATH).
Tu misión es orientar con paciencia, empatía y rigor pedagógico a los estudiantes de bachillerato tecnológico.

REGLAS DIDÁCTICAS:
- Utiliza el método socrático: no des las respuestas finales numéricas directamente.
- Descompón los problemas complejos en pasos pequeños y verifica que el estudiante entienda cada paso.
- Explica los fundamentos y trucos nemotécnicos (ley de signos, despejes, jerarquía PEMDAS, identidades trigonométricas, derivadas).
- Felicita los aciertos y aprovecha los errores como oportunidades constructivas de aprendizaje.`,
  customKnowledge: `REGLAMENTO Y RECOMENDACIONES DE LA ACADEMIA DE MATEMÁTICAS CBTIS 55:
- Fase Cero: Dominio total de las tablas del 2 al 12 y cálculo mental de operaciones básicas de 2 y 3 dígitos antes de presentar exámenes.
- Álgebra: En factorización por término común y trinomios x² + bx + c, siempre verificar multiplicando de vuelta.
- Ecuaciones: Al pasar términos al otro lado del signo igual, recordar que se aplica la operación inversa (no "cambio de signo" mágico).
- Trigonometría: La suma de los ángulos interiores de cualquier triángulo siempre es 180°. En el círculo unitario: cos(θ)=x, sin(θ)=y.
- Cálculo: La derivada representa la razón de cambio instantánea y la pendiente de la recta tangente. Regla de potencia: d/dx(x^n) = n·x^(n-1).`,
  teachingStyle: 'socratic',
  strictness: 'normal',
  allowDirectAnswers: false,
  enableSoundEffects: true,
  welcomeMessage: '¡Hola! Soy tu Tutor IA de Matemáticas del CBTIS 55. ¿En qué tema, fórmula o ejercicio de tu práctica te gustaría que te guíe hoy?',
};

export const loadTutorConfig = (): AITutorConfig => {
  try {
    const raw = localStorage.getItem(TUTOR_CONFIG_KEY);
    if (!raw) return DEFAULT_TUTOR_CONFIG;
    return {
      ...DEFAULT_TUTOR_CONFIG,
      ...JSON.parse(raw),
    };
  } catch (e) {
    console.error('Failed to load tutor config', e);
    return DEFAULT_TUTOR_CONFIG;
  }
};

export const saveTutorConfig = (config: AITutorConfig) => {
  try {
    localStorage.setItem(TUTOR_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save tutor config', e);
  }
};

export const getInitialProgress = (): UserProgress => {
  const initialModuleProgress: Record<ModuleId, any> = {
    'base-cero': { moduleId: 'base-cero', completedLevels: [], exercisesSolved: 0, correctCount: 0, wrongCount: 0, highestStreak: 0 },
    'algebra-basica': { moduleId: 'algebra-basica', completedLevels: [], exercisesSolved: 0, correctCount: 0, wrongCount: 0, highestStreak: 0 },
    'fracciones': { moduleId: 'fracciones', completedLevels: [], exercisesSolved: 0, correctCount: 0, wrongCount: 0, highestStreak: 0 },
    'ecuaciones': { moduleId: 'ecuaciones', completedLevels: [], exercisesSolved: 0, correctCount: 0, wrongCount: 0, highestStreak: 0 },
    'geometria-analitica': { moduleId: 'geometria-analitica', completedLevels: [], exercisesSolved: 0, correctCount: 0, wrongCount: 0, highestStreak: 0 },
    'trigonometria': { moduleId: 'trigonometria', completedLevels: [], exercisesSolved: 0, correctCount: 0, wrongCount: 0, highestStreak: 0 },
    'calculo': { moduleId: 'calculo', completedLevels: [], exercisesSolved: 0, correctCount: 0, wrongCount: 0, highestStreak: 0 },
  };

  return {
    xp: 0,
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    soundEnabled: true,
    moduleProgress: initialModuleProgress,
    unlockedMedalIds: [],
    completedTutorialIds: [],
    completedTables: [],
    completedBasicOpLevels: [],
    basicOpBestTimes: { 1: 0, 2: 0, 3: 0 },
    totalSolved: 0,
    totalCorrect: 0,
    timedChallengeHighScores: { 60: 0, 120: 0, 180: 0 },
    totalTimedPlayed: 0,
  };
};

export const loadUserProgress = (): UserProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('math_adn_progress_v1');
    if (!raw) return getInitialProgress();
    const parsed = JSON.parse(raw);
    
    const initial = getInitialProgress();
    return {
      ...initial,
      ...parsed,
      moduleProgress: {
        ...initial.moduleProgress,
        ...(parsed.moduleProgress || {}),
      },
      unlockedMedalIds: parsed.unlockedMedalIds || [],
      completedTutorialIds: parsed.completedTutorialIds || [],
      completedTables: parsed.completedTables || [],
      completedBasicOpLevels: parsed.completedBasicOpLevels || [],
      basicOpBestTimes: {
        ...initial.basicOpBestTimes,
        ...(parsed.basicOpBestTimes || {}),
      },
      timedChallengeHighScores: {
        ...initial.timedChallengeHighScores,
        ...(parsed.timedChallengeHighScores || {}),
      },
      totalTimedPlayed: parsed.totalTimedPlayed || 0,
    };
  } catch (e) {
    console.error('Failed to load user progress', e);
    return getInitialProgress();
  }
};

export const saveUserProgress = (progress: UserProgress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress', e);
  }
};

// Default initial Leaderboard to make the community experience live and engaging!
const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb-1', playerName: 'Alex Gauss', score: 850, correctCount: 17, totalQuestions: 18, highestStreak: 12, timeLimit: 60, date: '2026-08-14' },
  { id: 'lb-2', playerName: 'Elena Noether', score: 720, correctCount: 14, totalQuestions: 15, highestStreak: 9, timeLimit: 60, date: '2026-08-14' },
  { id: 'lb-3', playerName: 'Carlos Newton', score: 610, correctCount: 12, totalQuestions: 14, highestStreak: 6, timeLimit: 60, date: '2026-08-13' },
  { id: 'lb-4', playerName: 'Sara Euler', score: 540, correctCount: 11, totalQuestions: 12, highestStreak: 5, timeLimit: 60, date: '2026-08-12' },
  { id: 'lb-5', playerName: 'Mateo Fermat', score: 480, correctCount: 10, totalQuestions: 12, highestStreak: 4, timeLimit: 60, date: '2026-08-11' },

  { id: 'lb-6', playerName: 'Elena Noether', score: 1450, correctCount: 28, totalQuestions: 30, highestStreak: 18, timeLimit: 120, date: '2026-08-14' },
  { id: 'lb-7', playerName: 'Alex Gauss', score: 1320, correctCount: 25, totalQuestions: 27, highestStreak: 14, timeLimit: 120, date: '2026-08-14' },
  { id: 'lb-8', playerName: 'Carlos Newton', score: 1100, correctCount: 22, totalQuestions: 25, highestStreak: 10, timeLimit: 120, date: '2026-08-13' },

  { id: 'lb-9', playerName: 'Elena Noether', score: 2150, correctCount: 42, totalQuestions: 44, highestStreak: 25, timeLimit: 180, date: '2026-08-14' },
  { id: 'lb-10', playerName: 'Alex Gauss', score: 1980, correctCount: 38, totalQuestions: 40, highestStreak: 20, timeLimit: 180, date: '2026-08-13' },
];

export const loadLeaderboard = (timeLimit?: 60 | 120 | 180): LeaderboardEntry[] => {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    let list: LeaderboardEntry[] = raw ? JSON.parse(raw) : DEFAULT_LEADERBOARD;
    if (timeLimit) {
      list = list.filter(entry => entry.timeLimit === timeLimit);
    }
    return list.sort((a, b) => b.score - a.score);
  } catch (e) {
    console.error('Failed to load leaderboard', e);
    return DEFAULT_LEADERBOARD;
  }
};

export const saveLeaderboardEntry = (entry: LeaderboardEntry): LeaderboardEntry[] => {
  try {
    const all = loadLeaderboard();
    const updated = [entry, ...all.filter(e => e.id !== entry.id)].sort((a, b) => b.score - a.score).slice(0, 30);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save leaderboard entry', e);
    return [];
  }
};

export const checkNewlyUnlockedMedals = (
  progress: UserProgress,
  lastChallengeStats?: { correct: number; score: number; maxStreak: number }
): string[] => {
  const newUnlocks: string[] = [];
  const currentUnlocked = new Set(progress.unlockedMedalIds);

  // 1. First victory & XP milestones
  if (!currentUnlocked.has('first-victory') && progress.totalCorrect >= 1) {
    newUnlocks.push('first-victory');
  }
  if (!currentUnlocked.has('xp-500') && progress.xp >= 500) {
    newUnlocks.push('xp-500');
  }
  if (!currentUnlocked.has('xp-1000') && progress.xp >= 1000) {
    newUnlocks.push('xp-1000');
  }
  if (!currentUnlocked.has('xp-3000') && progress.xp >= 3000) {
    newUnlocks.push('xp-3000');
  }

  // 2. Highest streak check across modules
  const maxStreak = Math.max(
    ...Object.values(progress.moduleProgress).map(m => m.highestStreak || 0),
    lastChallengeStats?.maxStreak || 0
  );
  if (!currentUnlocked.has('streak-fire-5') && maxStreak >= 5) {
    newUnlocks.push('streak-fire-5');
  }

  // 2b. Fase Cero: Tablas y Operaciones Básicas
  if (!currentUnlocked.has('tablas-master') && (progress.completedTables || []).length >= 1) {
    newUnlocks.push('tablas-master');
  }
  if (!currentUnlocked.has('operaciones-basicas-master') && (progress.completedBasicOpLevels || []).length >= 1) {
    newUnlocks.push('operaciones-basicas-master');
  }

  // 3. Module specific completions
  MATH_MODULES.forEach(mod => {
    const medalId = `${mod.id === 'algebra-basica' ? 'algebra' : mod.id === 'trigonometria' ? 'trigo' : mod.id === 'geometria-analitica' ? 'geometria' : mod.id}-master`;
    if (!currentUnlocked.has(medalId)) {
      const p = progress.moduleProgress[mod.id];
      if (p && p.completedLevels && p.completedLevels.length >= mod.totalLevels) {
        newUnlocks.push(medalId);
      }
    }
  });

  // 4. Grand Master (all 7 completed)
  if (!currentUnlocked.has('grand-master')) {
    const allCompleted = MATH_MODULES.every(mod => {
      const p = progress.moduleProgress[mod.id];
      return p && p.completedLevels && p.completedLevels.length >= mod.totalLevels;
    });
    if (allCompleted) {
      newUnlocks.push('grand-master');
    }
  }

  // 5. Timed Challenge Achievements
  if (lastChallengeStats) {
    if (!currentUnlocked.has('speed-5') && lastChallengeStats.correct >= 5) {
      newUnlocks.push('speed-5');
    }
    if (!currentUnlocked.has('speed-10') && lastChallengeStats.correct >= 10) {
      newUnlocks.push('speed-10');
    }
    if (!currentUnlocked.has('combo-master') && lastChallengeStats.maxStreak >= 10) {
      newUnlocks.push('combo-master');
    }
    if (!currentUnlocked.has('score-legend') && lastChallengeStats.score >= 800) {
      newUnlocks.push('score-legend');
    }
  }

  // 6. Tutorial completion Achievements
  const completedTuts = new Set(progress.completedTutorialIds || []);
  if (!currentUnlocked.has('tut-algebra') && (completedTuts.has('algebra-terms') || completedTuts.has('algebra-foil') || completedTuts.has('algebra-factor'))) {
    newUnlocks.push('tut-algebra');
  }
  if (!currentUnlocked.has('tut-trigo') && (completedTuts.has('trig-circle') || completedTuts.has('trig-pythagoras'))) {
    newUnlocks.push('tut-trigo');
  }
  if (!currentUnlocked.has('tut-calculo') && (completedTuts.has('calc-derivative') || completedTuts.has('calc-power-rule') || completedTuts.has('calc-riemann'))) {
    newUnlocks.push('tut-calculo');
  }
  if (!currentUnlocked.has('tut-trinity')) {
    const hasAlgebra = completedTuts.has('algebra-terms') || completedTuts.has('algebra-foil') || completedTuts.has('algebra-factor');
    const hasTrigo = completedTuts.has('trig-circle') || completedTuts.has('trig-pythagoras');
    const hasCalculo = completedTuts.has('calc-derivative') || completedTuts.has('calc-power-rule') || completedTuts.has('calc-riemann');
    if (hasAlgebra && hasTrigo && hasCalculo) {
      newUnlocks.push('tut-trinity');
    }
  }

  return newUnlocks;
};
