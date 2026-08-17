export type ModuleId =
  | 'base-cero'
  | 'algebra-basica'
  | 'fracciones'
  | 'ecuaciones'
  | 'geometria-analitica'
  | 'trigonometria'
  | 'calculo';

export type MedalTier = 'bronze' | 'silver' | 'gold' | 'diamond';
export type MedalCategory = 'module' | 'challenge' | 'progress' | 'tutorial';

export interface FormulaRule {
  id: string;
  title: string;
  category: string;
  formula: string;
  explanation: string;
  example: string;
  tips?: string;
  caution?: string;
}

export interface ExerciseOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Exercise {
  id: string;
  moduleId: ModuleId;
  level: 1 | 2 | 3; // 1: Fundamentos, 2: Intermedio, 3: Reto ADN
  levelName: string;
  question: string;
  mathExpression?: string;
  diagramSvg?: string;
  options: ExerciseOption[];
  solutionExplanation: string;
  steps: string[];
  hint: string;
  xpReward: number;
}

export interface MathModule {
  id: ModuleId;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  accentColor: string;
  glowColor: string;
  tag: string;
  totalLevels: number;
  formulas: FormulaRule[];
  exercises: Exercise[];
  introVideoId?: string;
  introVideoTitle?: string;
}

export interface Medal {
  id: string;
  title: string;
  description: string;
  moduleId?: ModuleId;
  category: MedalCategory;
  tier: MedalTier;
  icon: string;
  unlockedAt?: string;
  requirement: string;
}

export interface ModuleProgress {
  moduleId: ModuleId;
  completedLevels: number[]; // e.g. [1, 2]
  exercisesSolved: number;
  correctCount: number;
  wrongCount: number;
  highestStreak: number;
  lastPracticed?: string;
}

export interface TimedChallengeQuestion {
  id: string;
  topic: string;
  moduleId: ModuleId;
  question: string;
  expression?: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  xp: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  highestStreak: number;
  timeLimit: 60 | 120 | 180;
  date: string;
}

export interface InteractiveStep {
  stepNumber: number;
  title: string;
  explanation: string;
  mathExpression?: string;
  interactiveType?: 'slider' | 'select' | 'input' | 'visualizer';
  checkpointQuestion?: {
    question: string;
    options: { id: string; text: string; isCorrect: boolean }[];
    explanation: string;
  };
}

export interface TutorialLesson {
  id: string;
  moduleId: 'algebra-basica' | 'trigonometria' | 'calculo';
  title: string;
  summary: string;
  icon: string;
  steps: InteractiveStep[];
  interactiveComponentId: 'algebra-foil' | 'algebra-terms' | 'algebra-factor' | 'trig-circle' | 'trig-pythagoras' | 'trig-laws' | 'calc-derivative' | 'calc-power-rule' | 'calc-riemann';
  xpReward: number;
}

export type OperationType = 'suma' | 'resta' | 'multiplicacion' | 'division' | 'combinada';

export interface BasicOperationQuestion {
  id: string;
  level: 1 | 2 | 3;
  operationType: OperationType;
  question: string;
  expression: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  correctAnswer: string | number;
  explanation: string;
  stepByStep: string[];
  digits: 2 | 3;
}

export interface MultiplicationRow {
  factorA: number;
  factorB: number;
  product: number;
}

export interface MultiplicationTableInfo {
  number: number;
  title: string;
  trickTitle: string;
  trickExplanation: string;
  patternTip: string;
  color: string;
  rows: MultiplicationRow[];
}

export interface UserProgress {
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  soundEnabled: boolean;
  moduleProgress: Record<ModuleId, ModuleProgress>;
  unlockedMedalIds: string[];
  completedTutorialIds: string[];
  completedTables: number[]; // e.g. [2, 3, ..., 12]
  completedBasicOpLevels: number[]; // e.g. [1, 2, 3]
  basicOpBestTimes: Record<number, number>; // level -> seconds
  totalSolved: number;
  totalCorrect: number;
  timedChallengeHighScores: Record<number, number>; // 60 -> maxScore, 120 -> maxScore, etc.
  totalTimedPlayed: number;
}

export interface AITutorConfig {
  teacherName: string;
  pinCode: string;
  systemPrompt: string;
  customKnowledge: string;
  teachingStyle: 'socratic' | 'guided' | 'conceptual';
  strictness: 'normal' | 'strict_hints' | 'comprehensive';
  allowDirectAnswers: boolean;
  enableSoundEffects: boolean;
  welcomeMessage: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
  contextModule?: string;
}

