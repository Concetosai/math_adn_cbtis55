import { Medal } from '../types';

export const INITIAL_MEDALS: Medal[] = [
  // ==========================================
  // 1. MEDALLAS POR FASE CERO Y MÓDULOS
  // ==========================================
  {
    id: 'tablas-master',
    title: 'Maestro de las Tablas (2 al 12)',
    description: 'Explora y domina los ejercicios de las tablas de multiplicar del 2 al 12.',
    moduleId: 'base-cero',
    category: 'module',
    tier: 'silver',
    icon: 'Sparkles',
    requirement: 'Practica y supera ejercicios de las tablas del 2 al 12'
  },
  {
    id: 'operaciones-basicas-master',
    title: 'Nivelación ADN Superada',
    description: 'Supera el test de 20 ejercicios de operaciones básicas asegurando tu preparación para toda la app.',
    moduleId: 'base-cero',
    category: 'module',
    tier: 'gold',
    icon: 'CheckCircle2',
    requirement: 'Completa los 20 ejercicios cronometrados de Operaciones Básicas'
  },
  {
    id: 'base-cero-master',
    title: 'Pionero Base Cero',
    description: 'Domina las operaciones fundamentales, signos y jerarquía aritmética.',
    moduleId: 'base-cero',
    category: 'module',
    tier: 'bronze',
    icon: 'Sparkles',
    requirement: 'Completa todos los niveles de Base Cero'
  },
  {
    id: 'algebra-master',
    title: 'Mente Algebraica',
    description: 'Factoriza y simplifica expresiones algebraicas como un experto.',
    moduleId: 'algebra-basica',
    category: 'module',
    tier: 'silver',
    icon: 'Variable',
    requirement: 'Completa todos los niveles de Álgebra Básica'
  },
  {
    id: 'fracciones-master',
    title: 'Arquitecto Fraccionario',
    description: 'Resuelve operaciones con fracciones de distinto denominador a la perfección.',
    moduleId: 'fracciones',
    category: 'module',
    tier: 'bronze',
    icon: 'Divide',
    requirement: 'Completa todos los niveles de Fracciones'
  },
  {
    id: 'ecuaciones-master',
    title: 'Despejador Maestro',
    description: 'Encuentra las incógnitas en ecuaciones lineales y cuadráticas.',
    moduleId: 'ecuaciones',
    category: 'module',
    tier: 'silver',
    icon: 'Equal',
    requirement: 'Completa todos los niveles de Ecuaciones'
  },
  {
    id: 'geometria-master',
    title: 'Geómetra del Plano',
    description: 'Calcula distancias, pendientes y rectas analíticas sin dudar.',
    moduleId: 'geometria-analitica',
    category: 'module',
    tier: 'gold',
    icon: 'Compass',
    requirement: 'Completa todos los niveles de Geometría Analítica'
  },
  {
    id: 'trigo-master',
    title: 'Señor de los Triángulos',
    description: 'Aplica identidades, razones trigonométricas y Teorema de Pitágoras.',
    moduleId: 'trigonometria',
    category: 'module',
    tier: 'gold',
    icon: 'Triangle',
    requirement: 'Completa todos los niveles de Trigonometría'
  },
  {
    id: 'calculo-master',
    title: 'Titán del Cálculo',
    description: 'Deriva e integra funciones con rigor y precisión.',
    moduleId: 'calculo',
    category: 'module',
    tier: 'diamond',
    icon: 'Infinity',
    requirement: 'Completa todos los niveles de Cálculo'
  },
  {
    id: 'grand-master',
    title: 'Gran Maestro ADN',
    description: 'Supera el 100% de los 7 módulos del sistema.',
    category: 'module',
    tier: 'diamond',
    icon: 'Crown',
    requirement: 'Completa los 7 módulos matemáticos'
  },

  // ==========================================
  // 2. MEDALLAS POR DESAFÍOS CRONOMETRADOS
  // ==========================================
  {
    id: 'speed-5',
    title: 'Relámpago de Bronce',
    description: 'Responde 5 preguntas correctas en una partida de Desafío Cronometrado.',
    category: 'challenge',
    tier: 'bronze',
    icon: 'Zap',
    requirement: 'Logra 5 aciertos en Desafío Cronometrado'
  },
  {
    id: 'speed-10',
    title: 'Velocidad Supersónica',
    description: 'Responde 10 preguntas correctas en una partida contrarreloj.',
    category: 'challenge',
    tier: 'silver',
    icon: 'Flame',
    requirement: 'Logra 10 aciertos en Desafío Cronometrado'
  },
  {
    id: 'combo-master',
    title: 'Combo ADN x3.0',
    description: 'Alcanza el multiplicador de racha máxima x3.0 en Contrarreloj.',
    category: 'challenge',
    tier: 'gold',
    icon: 'Award',
    requirement: 'Alcanza una racha de combo x3.0 en Desafío'
  },
  {
    id: 'score-legend',
    title: 'Puntuación Legendaria',
    description: 'Supera los 800 puntos en cualquier modo de Desafío Cronometrado.',
    category: 'challenge',
    tier: 'diamond',
    icon: 'Trophy',
    requirement: 'Obtén 800+ puntos en la Tabla de Clasificación'
  },

  // ==========================================
  // 3. MEDALLAS POR TUTORIALES INTERACTIVOS
  // ==========================================
  {
    id: 'tut-algebra',
    title: 'Iniciado en Álgebra Interactiva',
    description: 'Completa los tutoriales paso a paso de Álgebra Básica.',
    category: 'tutorial',
    tier: 'bronze',
    icon: 'Variable',
    requirement: 'Completa al menos 1 tutorial interactivo de Álgebra'
  },
  {
    id: 'tut-trigo',
    title: 'Explorador Trigonométrico',
    description: 'Completa la exploración interactiva del Círculo Unitario y Pitágoras.',
    category: 'tutorial',
    tier: 'silver',
    icon: 'Compass',
    requirement: 'Completa al menos 1 tutorial interactivo de Trigonometría'
  },
  {
    id: 'tut-calculo',
    title: 'Pionero del Cálculo Diferencial',
    description: 'Completa los tutoriales de Derivadas e Integrales con visualizadores.',
    category: 'tutorial',
    tier: 'gold',
    icon: 'Activity',
    requirement: 'Completa al menos 1 tutorial interactivo de Cálculo'
  },
  {
    id: 'tut-trinity',
    title: 'Trinidad del Saber',
    description: 'Completa todos los tutoriales interactivos de Álgebra, Trigonometría y Cálculo.',
    category: 'tutorial',
    tier: 'diamond',
    icon: 'CheckCircle2',
    requirement: 'Completa los tutoriales de las 3 ramas interactivas'
  },

  // ==========================================
  // 4. HITOS DE PROGRESO Y RACHAS
  // ==========================================
  {
    id: 'first-victory',
    title: 'Primer Paso Cuántico',
    description: 'Resuelve tu primer ejercicio de matemáticas con éxito.',
    category: 'progress',
    tier: 'bronze',
    icon: 'CheckCircle2',
    requirement: 'Resuelve 1 ejercicio correctamente'
  },
  {
    id: 'streak-fire-5',
    title: 'Racha Imparable',
    description: 'Consigue una racha de 5 respuestas correctas seguidas en práctica.',
    category: 'progress',
    tier: 'silver',
    icon: 'Flame',
    requirement: 'Alcanza una racha de 5 aciertos'
  },
  {
    id: 'xp-500',
    title: 'Mente Brillante (500 XP)',
    description: 'Acumula más de 500 puntos de experiencia matemática.',
    category: 'progress',
    tier: 'bronze',
    icon: 'Zap',
    requirement: 'Alcanza 500 XP en tu perfil'
  },
  {
    id: 'xp-1000',
    title: 'ADN Cuántico (1,000 XP)',
    description: 'Acumula más de 1,000 puntos de experiencia matemática.',
    category: 'progress',
    tier: 'gold',
    icon: 'Zap',
    requirement: 'Alcanza 1,000 XP en tu perfil'
  },
  {
    id: 'xp-3000',
    title: 'Genio Universal (3,000 XP)',
    description: 'Acumula más de 3,000 puntos de experiencia en Math ADN.',
    category: 'progress',
    tier: 'diamond',
    icon: 'Crown',
    requirement: 'Alcanza 3,000 XP en tu perfil'
  }
];
