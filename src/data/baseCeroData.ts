import { MultiplicationTableInfo, BasicOperationQuestion } from '../types';

// ============================================================================
// 1. TABLAS DE MULTIPLICAR DEL 2 AL 12 (DATOS, TRUCOS Y FILAS)
// ============================================================================
export const MULTIPLICATION_TABLES: MultiplicationTableInfo[] = [
  {
    number: 2,
    title: 'Tabla del 2',
    trickTitle: 'El Truco del Doble',
    trickExplanation: 'Multiplicar por 2 es simplemente sumar el número consigo mismo (n + n). Todos los resultados terminan en números pares: 0, 2, 4, 6, u 8.',
    patternTip: '2 × 7 = 7 + 7 = 14. Siempre genera números pares.',
    color: 'emerald',
    rows: Array.from({ length: 12 }, (_, i) => ({
      factorA: 2,
      factorB: i + 1,
      product: 2 * (i + 1),
    })),
  },
  {
    number: 3,
    title: 'Tabla del 3',
    trickTitle: 'Suma de Dígitos Múltiplo de 3',
    trickExplanation: 'Si sumas los dígitos del resultado, siempre obtienes 3, 6 o 9 (o un múltiplo de 3). Ej: 3 × 9 = 27 (2 + 7 = 9).',
    patternTip: 'Visualiza saltos de 3 en 3: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36.',
    color: 'teal',
    rows: Array.from({ length: 12 }, (_, i) => ({
      factorA: 3,
      factorB: i + 1,
      product: 3 * (i + 1),
    })),
  },
  {
    number: 4,
    title: 'Tabla del 4',
    trickTitle: 'El Doble del Doble',
    trickExplanation: 'Para multiplicar por 4, calcula el doble y vuelve a duplicarlo. Ej: 4 × 7 → doble de 7 es 14, doble de 14 es 28.',
    patternTip: '4 × n = 2 × (2 × n). Todos los resultados terminan en 0, 2, 4, 6 u 8.',
    color: 'cyan',
    rows: Array.from({ length: 12 }, (_, i) => ({
      factorA: 4,
      factorB: i + 1,
      product: 4 * (i + 1),
    })),
  },
  {
    number: 5,
    title: 'Tabla del 5',
    trickTitle: 'Terminación 0 y 5 (La Mitad de 10)',
    trickExplanation: 'Todos los múltiplos de 5 terminan estrictamente en 0 (si se multiplica por par) o en 5 (si se multiplica por impar). También es la mitad de multiplicar por 10.',
    patternTip: '5 × 8 = (10 × 8) / 2 = 80 / 2 = 40.',
    color: 'blue',
    rows: Array.from({ length: 12 }, (_, i) => ({
      factorA: 5,
      factorB: i + 1,
      product: 5 * (i + 1),
    })),
  },
  {
    number: 6,
    title: 'Tabla del 6',
    trickTitle: 'La Tabla del 5 + Una Vez el Número',
    trickExplanation: 'Multiplicar por 6 es igual a multiplicar por 5 y sumarle el número una vez: 6 × n = (5 × n) + n. Con pares: 6 × 4 = 24 (termina en 4, decena es la mitad 2).',
    patternTip: '6 × 8 = (5 × 8) + 8 = 40 + 8 = 48. La decena es 4 (mitad de 8) y termina en 8.',
    color: 'indigo',
    rows: Array.from({ length: 12 }, (_, i) => ({
      factorA: 6,
      factorB: i + 1,
      product: 6 * (i + 1),
    })),
  },
  {
    number: 7,
    title: 'Tabla del 7',
    trickTitle: 'Descomposición 5 + 2',
    trickExplanation: 'El 7 es el número más retador para memorizar, pero puedes descomponerlo en 5 + 2: 7 × n = (5 × n) + (2 × n). Ej: 7 × 8 = (5×8) + (2×8) = 40 + 16 = 56.',
    patternTip: 'Secuencia famosa: 5, 6, 7, 8 → 56 = 7 × 8.',
    color: 'violet',
    rows: Array.from({ length: 12 }, (_, i) => ({
      factorA: 7,
      factorB: i + 1,
      product: 7 * (i + 1),
    })),
  },
  {
    number: 8,
    title: 'Tabla del 8',
    trickTitle: 'Triple Doble (2 × 2 × 2)',
    trickExplanation: 'Multiplicar por 8 es duplicar tres veces consecutivas. Ej: 8 × 6 → doble de 6 es 12, doble de 12 es 24, doble de 24 es 48.',
    patternTip: 'También puedes hacer (10 × n) - (2 × n): 8 × 9 = 90 - 18 = 72.',
    color: 'purple',
    rows: Array.from({ length: 12 }, (_, i) => ({
      factorA: 8,
      factorB: i + 1,
      product: 8 * (i + 1),
    })),
  },
  {
    number: 9,
    title: 'Tabla del 9',
    trickTitle: 'El Truco de las Manos y Suma 9',
    trickExplanation: 'La suma de las cifras del resultado siempre da 9 (ej: 9×4=36, 3+6=9). Además, la cifra de las decenas siempre es (n - 1) y las unidades son 9 - decenas.',
    patternTip: 'Para 9 × 7: Decenas = 7 - 1 = 6. Unidades = 9 - 6 = 3. Resultado: 63.',
    color: 'pink',
    rows: Array.from({ length: 12 }, (_, i) => ({
      factorA: 9,
      factorB: i + 1,
      product: 9 * (i + 1),
    })),
  },
  {
    number: 10,
    title: 'Tabla del 10',
    trickTitle: 'La Regla del Cero a la Derecha',
    trickExplanation: 'En nuestro sistema decimal, multiplicar cualquier número entero por 10 consiste únicamente en añadir un cero a la derecha.',
    patternTip: '10 × 12 = 120. ¡La tabla base de todo cálculo rápido!',
    color: 'amber',
    rows: Array.from({ length: 12 }, (_, i) => ({
      factorA: 10,
      factorB: i + 1,
      product: 10 * (i + 1),
    })),
  },
  {
    number: 11,
    title: 'Tabla del 11',
    trickTitle: 'Dígitos Gemelos y Suma Central',
    trickExplanation: 'Del 1 al 9 simplemente se repite el dígito dos veces: 11 × 7 = 77. Para dos dígitos (ej. 11 × 12): se suman los dígitos (1+2=3) y se pone en medio → 132.',
    patternTip: '11 × 11 = 1(1+1)1 = 121. 11 × 12 = 1(1+2)2 = 132.',
    color: 'orange',
    rows: Array.from({ length: 12 }, (_, i) => ({
      factorA: 11,
      factorB: i + 1,
      product: 11 * (i + 1),
    })),
  },
  {
    number: 12,
    title: 'Tabla del 12',
    trickTitle: 'Base Docena: Tabla del 10 + Tabla del 2',
    trickExplanation: 'Multiplicar por 12 se resuelve rápidamente sumando la tabla del 10 más la tabla del 2: 12 × n = (10 × n) + (2 × n).',
    patternTip: '12 × 9 = (10 × 9) + (2 × 9) = 90 + 18 = 108.',
    color: 'rose',
    rows: Array.from({ length: 12 }, (_, i) => ({
      factorA: 12,
      factorB: i + 1,
      product: 12 * (i + 1),
    })),
  },
];

// Generador de opciones múltiples para tablas
export const generateTableQuestion = (tableNum?: number) => {
  const factorA = tableNum || Math.floor(Math.random() * 11) + 2; // 2 to 12
  const factorB = Math.floor(Math.random() * 12) + 1; // 1 to 12
  const correctProduct = factorA * factorB;

  const wrongOptions = new Set<number>();
  wrongOptions.add(correctProduct + factorA);
  wrongOptions.add(Math.max(1, correctProduct - factorA));
  wrongOptions.add(correctProduct + (Math.random() > 0.5 ? 2 : -2));
  wrongOptions.add((factorA + 1) * factorB);
  wrongOptions.add(factorA * (factorB + (Math.random() > 0.5 ? 2 : -1)));

  const filteredWrong = Array.from(wrongOptions).filter((n) => n !== correctProduct && n > 0).slice(0, 3);
  while (filteredWrong.length < 3) {
    const r = correctProduct + Math.floor(Math.random() * 10) - 5;
    if (r !== correctProduct && r > 0 && !filteredWrong.includes(r)) {
      filteredWrong.push(r);
    }
  }

  const allAnswers = [correctProduct, ...filteredWrong].sort(() => Math.random() - 0.5);

  return {
    id: `table-q-${factorA}x${factorB}-${Date.now()}-${Math.random()}`,
    factorA,
    factorB,
    question: `¿Cuánto es ${factorA} × ${factorB}?`,
    expression: `${factorA} \\times ${factorB}`,
    correctProduct,
    options: allAnswers.map((val, idx) => ({
      id: String.fromCharCode(97 + idx),
      text: val.toString(),
      isCorrect: val === correctProduct,
    })),
    explanation: `${factorA} × ${factorB} = ${correctProduct}. Recuerda: sumando ${factorB} veces ${factorA} o aplicando la propiedad distributiva.`,
  };
};

// ============================================================================
// 2. SECCIÓN DE PRÁCTICA: OPERACIONES BÁSICAS (3 NIVELES - 20 EJERCICIOS CADA UNO)
// ============================================================================

export const CURATED_BASIC_OPERATIONS_LEVEL_1: BasicOperationQuestion[] = [
  // 1. Suma 2 dígitos
  {
    id: 'bo-l1-1',
    level: 1,
    digits: 2,
    operationType: 'suma',
    question: 'Resuelve la suma de dos dígitos:',
    expression: '34 + 48',
    correctAnswer: 82,
    options: [
      { id: 'a', text: '82', isCorrect: true },
      { id: 'b', text: '72', isCorrect: false },
      { id: 'c', text: '84', isCorrect: false },
      { id: 'd', text: '78', isCorrect: false },
    ],
    explanation: '4 + 8 = 12 (escribes 2 y llevas 1). 3 + 4 + 1 = 8. Resultado: 82.',
    stepByStep: ['Unidades: 4 + 8 = 12 → 2 con acarreo de 1', 'Decenas: 3 + 4 + 1 = 8', 'Total = 82'],
  },
  // 2. Resta 2 dígitos
  {
    id: 'bo-l1-2',
    level: 1,
    digits: 2,
    operationType: 'resta',
    question: 'Calcula la resta con préstamo:',
    expression: '75 - 29',
    correctAnswer: 46,
    options: [
      { id: 'a', text: '56', isCorrect: false },
      { id: 'b', text: '46', isCorrect: true },
      { id: 'c', text: '44', isCorrect: false },
      { id: 'd', text: '54', isCorrect: false },
    ],
    explanation: 'Como 5 es menor que 9, pedimos prestado 1 a la decena: 15 - 9 = 6. La decena queda en 6: 6 - 2 = 4. Resultado: 46.',
    stepByStep: ['Unidades: 15 - 9 = 6', 'Decenas: 6 - 2 = 4', 'Total = 46'],
  },
  // 3. Multiplicación 2 dígitos
  {
    id: 'bo-l1-3',
    level: 1,
    digits: 2,
    operationType: 'multiplicacion',
    question: 'Calcula el producto:',
    expression: '14 \\times 6',
    correctAnswer: 84,
    options: [
      { id: 'a', text: '74', isCorrect: false },
      { id: 'b', text: '84', isCorrect: true },
      { id: 'c', text: '94', isCorrect: false },
      { id: 'd', text: '88', isCorrect: false },
    ],
    explanation: '14 × 6 = (10 × 6) + (4 × 6) = 60 + 24 = 84.',
    stepByStep: ['Descomponer 14 en 10 + 4', '10 × 6 = 60', '4 × 6 = 24', '60 + 24 = 84'],
  },
  // 4. División 2 dígitos exacta
  {
    id: 'bo-l1-4',
    level: 1,
    digits: 2,
    operationType: 'division',
    question: 'Encuentra el cociente exacto:',
    expression: '84 \\div 4',
    correctAnswer: 21,
    options: [
      { id: 'a', text: '21', isCorrect: true },
      { id: 'b', text: '22', isCorrect: false },
      { id: 'c', text: '18', isCorrect: false },
      { id: 'd', text: '24', isCorrect: false },
    ],
    explanation: '80 ÷ 4 = 20 y 4 ÷ 4 = 1. Por tanto 20 + 1 = 21.',
    stepByStep: ['Dividir decenas: 8 ÷ 4 = 2', 'Dividir unidades: 4 ÷ 4 = 1', 'Cociente = 21'],
  },
  // 5. Suma 2 dígitos
  {
    id: 'bo-l1-5',
    level: 1,
    digits: 2,
    operationType: 'suma',
    question: 'Calcula la suma:',
    expression: '67 + 25',
    correctAnswer: 92,
    options: [
      { id: 'a', text: '92', isCorrect: true },
      { id: 'b', text: '82', isCorrect: false },
      { id: 'c', text: '95', isCorrect: false },
      { id: 'd', text: '88', isCorrect: false },
    ],
    explanation: '7 + 5 = 12 (llevas 1). 6 + 2 + 1 = 9. Total: 92.',
    stepByStep: ['Unidades: 7 + 5 = 12', 'Decenas: 6 + 2 + 1 = 9', 'Total = 92'],
  },
  // 6. Resta 2 dígitos
  {
    id: 'bo-l1-6',
    level: 1,
    digits: 2,
    operationType: 'resta',
    question: 'Resuelve la sustracción:',
    expression: '92 - 47',
    correctAnswer: 45,
    options: [
      { id: 'a', text: '55', isCorrect: false },
      { id: 'b', text: '45', isCorrect: true },
      { id: 'c', text: '47', isCorrect: false },
      { id: 'd', text: '35', isCorrect: false },
    ],
    explanation: '12 - 7 = 5. Decena 8 - 4 = 4. Resultado: 45.',
    stepByStep: ['Unidades: 12 - 7 = 5', 'Decenas: 8 - 4 = 4', 'Total = 45'],
  },
  // 7. Multiplicación 2 dígitos
  {
    id: 'bo-l1-7',
    level: 1,
    digits: 2,
    operationType: 'multiplicacion',
    question: 'Resuelve la multiplicación:',
    expression: '23 \\times 4',
    correctAnswer: 92,
    options: [
      { id: 'a', text: '82', isCorrect: false },
      { id: 'b', text: '92', isCorrect: true },
      { id: 'c', text: '96', isCorrect: false },
      { id: 'd', text: '88', isCorrect: false },
    ],
    explanation: '20 × 4 = 80, 3 × 4 = 12. 80 + 12 = 92.',
    stepByStep: ['20 × 4 = 80', '3 × 4 = 12', '80 + 12 = 92'],
  },
  // 8. División 2 dígitos
  {
    id: 'bo-l1-8',
    level: 1,
    digits: 2,
    operationType: 'division',
    question: 'Calcula el cociente:',
    expression: '96 \\div 6',
    correctAnswer: 16,
    options: [
      { id: 'a', text: '16', isCorrect: true },
      { id: 'b', text: '14', isCorrect: false },
      { id: 'c', text: '18', isCorrect: false },
      { id: 'd', text: '15', isCorrect: false },
    ],
    explanation: '96 = 60 + 36. 60 ÷ 6 = 10; 36 ÷ 6 = 6. 10 + 6 = 16.',
    stepByStep: ['60 ÷ 6 = 10', '36 ÷ 6 = 6', '10 + 6 = 16'],
  },
  // 9. Suma 2 dígitos
  {
    id: 'bo-l1-9',
    level: 1,
    digits: 2,
    operationType: 'suma',
    question: 'Efectúa la adición:',
    expression: '58 + 74',
    correctAnswer: 132,
    options: [
      { id: 'a', text: '122', isCorrect: false },
      { id: 'b', text: '132', isCorrect: true },
      { id: 'c', text: '134', isCorrect: false },
      { id: 'd', text: '142', isCorrect: false },
    ],
    explanation: '8 + 4 = 12. 5 + 7 + 1 = 13. Total: 132.',
    stepByStep: ['8 + 4 = 12 (acarreo 1)', '5 + 7 + 1 = 13', 'Resultado = 132'],
  },
  // 10. Resta 2 dígitos
  {
    id: 'bo-l1-10',
    level: 1,
    digits: 2,
    operationType: 'resta',
    question: 'Calcula la diferencia:',
    expression: '84 - 38',
    correctAnswer: 46,
    options: [
      { id: 'a', text: '46', isCorrect: true },
      { id: 'b', text: '56', isCorrect: false },
      { id: 'c', text: '44', isCorrect: false },
      { id: 'd', text: '38', isCorrect: false },
    ],
    explanation: '14 - 8 = 6. 7 - 3 = 4. Resultado: 46.',
    stepByStep: ['14 - 8 = 6', '7 - 3 = 4', 'Resultado = 46'],
  },
  // 11. Multiplicación 2 dígitos
  {
    id: 'bo-l1-11',
    level: 1,
    digits: 2,
    operationType: 'multiplicacion',
    question: 'Multiplica los factores:',
    expression: '18 \\times 5',
    correctAnswer: 90,
    options: [
      { id: 'a', text: '80', isCorrect: false },
      { id: 'b', text: '90', isCorrect: true },
      { id: 'c', text: '85', isCorrect: false },
      { id: 'd', text: '95', isCorrect: false },
    ],
    explanation: '18 × 5 = (18 × 10) / 2 = 180 / 2 = 90.',
    stepByStep: ['10 × 5 = 50', '8 × 5 = 40', '50 + 40 = 90'],
  },
  // 12. División 2 dígitos
  {
    id: 'bo-l1-12',
    level: 1,
    digits: 2,
    operationType: 'division',
    question: 'Resuelve la división exacta:',
    expression: '72 \\div 3',
    correctAnswer: 24,
    options: [
      { id: 'a', text: '24', isCorrect: true },
      { id: 'b', text: '26', isCorrect: false },
      { id: 'c', text: '21', isCorrect: false },
      { id: 'd', text: '23', isCorrect: false },
    ],
    explanation: '60 ÷ 3 = 20 y 12 ÷ 3 = 4. 20 + 4 = 24.',
    stepByStep: ['60 ÷ 3 = 20', '12 ÷ 3 = 4', 'Cociente = 24'],
  },
  // 13. Suma 2 dígitos
  {
    id: 'bo-l1-13',
    level: 1,
    digits: 2,
    operationType: 'suma',
    question: 'Suma de dos números de dos dígitos:',
    expression: '49 + 36',
    correctAnswer: 85,
    options: [
      { id: 'a', text: '85', isCorrect: true },
      { id: 'b', text: '75', isCorrect: false },
      { id: 'c', text: '84', isCorrect: false },
      { id: 'd', text: '95', isCorrect: false },
    ],
    explanation: '49 + 36 = 50 + 35 = 85 (redondeando 49 a 50).',
    stepByStep: ['9 + 6 = 15', '4 + 3 + 1 = 8', 'Total = 85'],
  },
  // 14. Resta 2 dígitos
  {
    id: 'bo-l1-14',
    level: 1,
    digits: 2,
    operationType: 'resta',
    question: 'Realiza la resta:',
    expression: '63 - 27',
    correctAnswer: 36,
    options: [
      { id: 'a', text: '36', isCorrect: true },
      { id: 'b', text: '46', isCorrect: false },
      { id: 'c', text: '34', isCorrect: false },
      { id: 'd', text: '26', isCorrect: false },
    ],
    explanation: '13 - 7 = 6. 5 - 2 = 3. Resultado: 36.',
    stepByStep: ['13 - 7 = 6', '5 - 2 = 3', 'Total = 36'],
  },
  // 15. Multiplicación 2 dígitos
  {
    id: 'bo-l1-15',
    level: 1,
    digits: 2,
    operationType: 'multiplicacion',
    question: 'Calcula el producto mentalmente:',
    expression: '16 \\times 7',
    correctAnswer: 112,
    options: [
      { id: 'a', text: '102', isCorrect: false },
      { id: 'b', text: '112', isCorrect: true },
      { id: 'c', text: '114', isCorrect: false },
      { id: 'd', text: '122', isCorrect: false },
    ],
    explanation: '10 × 7 = 70 y 6 × 7 = 42. 70 + 42 = 112.',
    stepByStep: ['10 × 7 = 70', '6 × 7 = 42', '70 + 42 = 112'],
  },
  // 16. División 2 dígitos
  {
    id: 'bo-l1-16',
    level: 1,
    digits: 2,
    operationType: 'division',
    question: 'Efectúa la división:',
    expression: '65 \\div 5',
    correctAnswer: 13,
    options: [
      { id: 'a', text: '13', isCorrect: true },
      { id: 'b', text: '15', isCorrect: false },
      { id: 'c', text: '12', isCorrect: false },
      { id: 'd', text: '14', isCorrect: false },
    ],
    explanation: '50 ÷ 5 = 10 y 15 ÷ 5 = 3. 10 + 3 = 13.',
    stepByStep: ['50 ÷ 5 = 10', '15 ÷ 5 = 3', 'Cociente = 13'],
  },
  // 17. Suma 2 dígitos
  {
    id: 'bo-l1-17',
    level: 1,
    digits: 2,
    operationType: 'suma',
    question: 'Resuelve la suma:',
    expression: '83 + 49',
    correctAnswer: 132,
    options: [
      { id: 'a', text: '132', isCorrect: true },
      { id: 'b', text: '122', isCorrect: false },
      { id: 'c', text: '142', isCorrect: false },
      { id: 'd', text: '131', isCorrect: false },
    ],
    explanation: '3 + 9 = 12. 8 + 4 + 1 = 13. Total: 132.',
    stepByStep: ['3 + 9 = 12', '8 + 4 + 1 = 13', 'Total = 132'],
  },
  // 18. Resta 2 dígitos
  {
    id: 'bo-l1-18',
    level: 1,
    digits: 2,
    operationType: 'resta',
    question: 'Calcula la resta:',
    expression: '91 - 56',
    correctAnswer: 35,
    options: [
      { id: 'a', text: '45', isCorrect: false },
      { id: 'b', text: '35', isCorrect: true },
      { id: 'c', text: '36', isCorrect: false },
      { id: 'd', text: '25', isCorrect: false },
    ],
    explanation: '11 - 6 = 5. 8 - 5 = 3. Resultado: 35.',
    stepByStep: ['11 - 6 = 5', '8 - 5 = 3', 'Total = 35'],
  },
  // 19. Multiplicación 2 dígitos
  {
    id: 'bo-l1-19',
    level: 1,
    digits: 2,
    operationType: 'multiplicacion',
    question: 'Multiplica:',
    expression: '25 \\times 4',
    correctAnswer: 100,
    options: [
      { id: 'a', text: '100', isCorrect: true },
      { id: 'b', text: '90', isCorrect: false },
      { id: 'c', text: '110', isCorrect: false },
      { id: 'd', text: '105', isCorrect: false },
    ],
    explanation: '4 monedas de 25 centavos hacen 100. 25 × 4 = 100.',
    stepByStep: ['25 × 2 = 50', '50 × 2 = 100', 'Total = 100'],
  },
  // 20. División 2 dígitos
  {
    id: 'bo-l1-20',
    level: 1,
    digits: 2,
    operationType: 'division',
    question: 'Resuelve la división exacta:',
    expression: '91 \\div 7',
    correctAnswer: 13,
    options: [
      { id: 'a', text: '13', isCorrect: true },
      { id: 'b', text: '14', isCorrect: false },
      { id: 'c', text: '12', isCorrect: false },
      { id: 'd', text: '17', isCorrect: false },
    ],
    explanation: '70 ÷ 7 = 10 y 21 ÷ 7 = 3. 10 + 3 = 13.',
    stepByStep: ['70 ÷ 7 = 10', '21 ÷ 7 = 3', 'Cociente = 13'],
  },
];

export const CURATED_BASIC_OPERATIONS_LEVEL_2: BasicOperationQuestion[] = [
  // 1. Combinada jerarquía 2 dígitos
  {
    id: 'bo-l2-1',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Calcula respetando la jerarquía de operaciones:',
    expression: '(45 - 18) \\times 3',
    correctAnswer: 81,
    options: [
      { id: 'a', text: '81', isCorrect: true },
      { id: 'b', text: '71', isCorrect: false },
      { id: 'c', text: '91', isCorrect: false },
      { id: 'd', text: '63', isCorrect: false },
    ],
    explanation: 'Paréntesis primero: 45 - 18 = 27. Multiplicación: 27 × 3 = 81.',
    stepByStep: ['Paréntesis: 45 - 18 = 27', '27 × 3 = 81'],
  },
  // 2. Combinada
  {
    id: 'bo-l2-2',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Resuelve la operación combinada:',
    expression: '96 \\div 8 + 37',
    correctAnswer: 49,
    options: [
      { id: 'a', text: '49', isCorrect: true },
      { id: 'b', text: '59', isCorrect: false },
      { id: 'c', text: '47', isCorrect: false },
      { id: 'd', text: '52', isCorrect: false },
    ],
    explanation: 'División primero: 96 ÷ 8 = 12. Suma: 12 + 37 = 49.',
    stepByStep: ['División: 96 ÷ 8 = 12', 'Suma: 12 + 37 = 49'],
  },
  // 3. Suma y Resta combinadas
  {
    id: 'bo-l2-3',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Calcula el valor final:',
    expression: '58 + 64 - 39',
    correctAnswer: 83,
    options: [
      { id: 'a', text: '83', isCorrect: true },
      { id: 'b', text: '93', isCorrect: false },
      { id: 'c', text: '73', isCorrect: false },
      { id: 'd', text: '87', isCorrect: false },
    ],
    explanation: '58 + 64 = 122. 122 - 39 = 83.',
    stepByStep: ['58 + 64 = 122', '122 - 39 = 83'],
  },
  // 4. Paréntesis y producto
  {
    id: 'bo-l2-4',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Evalúa la expresión:',
    expression: '75 - (14 \\times 3)',
    correctAnswer: 33,
    options: [
      { id: 'a', text: '33', isCorrect: true },
      { id: 'b', text: '43', isCorrect: false },
      { id: 'c', text: '31', isCorrect: false },
      { id: 'd', text: '29', isCorrect: false },
    ],
    explanation: '14 × 3 = 42. Luego 75 - 42 = 33.',
    stepByStep: ['14 × 3 = 42', '75 - 42 = 33'],
  },
  // 5. Multiplicación de 2 dígitos por 2 dígitos
  {
    id: 'bo-l2-5',
    level: 2,
    digits: 2,
    operationType: 'multiplicacion',
    question: 'Multiplica los dos números de dos dígitos:',
    expression: '24 \\times 15',
    correctAnswer: 360,
    options: [
      { id: 'a', text: '360', isCorrect: true },
      { id: 'b', text: '340', isCorrect: false },
      { id: 'c', text: '380', isCorrect: false },
      { id: 'd', text: '350', isCorrect: false },
    ],
    explanation: '24 × 15 = 24 × (10 + 5) = 240 + 120 = 360.',
    stepByStep: ['24 × 10 = 240', '24 × 5 = 120', '240 + 120 = 360'],
  },
  // 6. División y resta
  {
    id: 'bo-l2-6',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Resuelve la operación mixta:',
    expression: '(32 + 48) \\div 5',
    correctAnswer: 16,
    options: [
      { id: 'a', text: '16', isCorrect: true },
      { id: 'b', text: '18', isCorrect: false },
      { id: 'c', text: '14', isCorrect: false },
      { id: 'd', text: '20', isCorrect: false },
    ],
    explanation: 'Paréntesis: 32 + 48 = 80. División: 80 ÷ 5 = 16.',
    stepByStep: ['32 + 48 = 80', '80 ÷ 5 = 16'],
  },
  // 7. Multiplicación y división
  {
    id: 'bo-l2-7',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Efectúa la operación:',
    expression: '18 \\times 4 - 36 \\div 6',
    correctAnswer: 66,
    options: [
      { id: 'a', text: '66', isCorrect: true },
      { id: 'b', text: '72', isCorrect: false },
      { id: 'c', text: '60', isCorrect: false },
      { id: 'd', text: '64', isCorrect: false },
    ],
    explanation: '18 × 4 = 72. 36 ÷ 6 = 6. 72 - 6 = 66.',
    stepByStep: ['18 × 4 = 72', '36 ÷ 6 = 6', '72 - 6 = 66'],
  },
  // 8. Suma y división
  {
    id: 'bo-l2-8',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Calcula:',
    expression: '64 \\div 4 + 23 \\times 2',
    correctAnswer: 62,
    options: [
      { id: 'a', text: '62', isCorrect: true },
      { id: 'b', text: '52', isCorrect: false },
      { id: 'c', text: '72', isCorrect: false },
      { id: 'd', text: '58', isCorrect: false },
    ],
    explanation: '64 ÷ 4 = 16. 23 × 2 = 46. 16 + 46 = 62.',
    stepByStep: ['64 ÷ 4 = 16', '23 × 2 = 46', '16 + 46 = 62'],
  },
  // 9. Resta y multiplicación
  {
    id: 'bo-l2-9',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Resuelve la jerarquía:',
    expression: '85 - 3 \\times 16',
    correctAnswer: 37,
    options: [
      { id: 'a', text: '37', isCorrect: true },
      { id: 'b', text: '47', isCorrect: false },
      { id: 'c', text: '39', isCorrect: false },
      { id: 'd', text: '1312', isCorrect: false },
    ],
    explanation: 'Multiplicación antes que la resta: 3 × 16 = 48. 85 - 48 = 37.',
    stepByStep: ['3 × 16 = 48', '85 - 48 = 37'],
  },
  // 10. Dos paréntesis
  {
    id: 'bo-l2-10',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Calcula el resultado:',
    expression: '(88 \\div 4) + (15 \\times 3)',
    correctAnswer: 67,
    options: [
      { id: 'a', text: '67', isCorrect: true },
      { id: 'b', text: '77', isCorrect: false },
      { id: 'c', text: '57', isCorrect: false },
      { id: 'd', text: '63', isCorrect: false },
    ],
    explanation: '88 ÷ 4 = 22. 15 × 3 = 45. 22 + 45 = 67.',
    stepByStep: ['88 ÷ 4 = 22', '15 × 3 = 45', '22 + 45 = 67'],
  },
  // 11. Multiplicación 2 dígitos
  {
    id: 'bo-l2-11',
    level: 2,
    digits: 2,
    operationType: 'multiplicacion',
    question: 'Calcula el producto:',
    expression: '35 \\times 12',
    correctAnswer: 420,
    options: [
      { id: 'a', text: '420', isCorrect: true },
      { id: 'b', text: '410', isCorrect: false },
      { id: 'c', text: '390', isCorrect: false },
      { id: 'd', text: '450', isCorrect: false },
    ],
    explanation: '35 × 12 = 35 × 10 + 35 × 2 = 350 + 70 = 420.',
    stepByStep: ['35 × 10 = 350', '35 × 2 = 70', '350 + 70 = 420'],
  },
  // 12. División con resta
  {
    id: 'bo-l2-12',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Resuelve la expresión:',
    expression: '(90 - 18) \\div 6',
    correctAnswer: 12,
    options: [
      { id: 'a', text: '12', isCorrect: true },
      { id: 'b', text: '14', isCorrect: false },
      { id: 'c', text: '10', isCorrect: false },
      { id: 'd', text: '15', isCorrect: false },
    ],
    explanation: '90 - 18 = 72. 72 ÷ 6 = 12.',
    stepByStep: ['90 - 18 = 72', '72 ÷ 6 = 12'],
  },
  // 13. Combinada
  {
    id: 'bo-l2-13',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Calcula:',
    expression: '4 \\times (19 + 6) - 28',
    correctAnswer: 72,
    options: [
      { id: 'a', text: '72', isCorrect: true },
      { id: 'b', text: '82', isCorrect: false },
      { id: 'c', text: '68', isCorrect: false },
      { id: 'd', text: '76', isCorrect: false },
    ],
    explanation: '19 + 6 = 25. 4 × 25 = 100. 100 - 28 = 72.',
    stepByStep: ['19 + 6 = 25', '4 × 25 = 100', '100 - 28 = 72'],
  },
  // 14. Combinada
  {
    id: 'bo-l2-14',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Efectúa la operación:',
    expression: '72 \\div 9 + 48 \\div 6',
    correctAnswer: 16,
    options: [
      { id: 'a', text: '16', isCorrect: true },
      { id: 'b', text: '18', isCorrect: false },
      { id: 'c', text: '14', isCorrect: false },
      { id: 'd', text: '12', isCorrect: false },
    ],
    explanation: '72 ÷ 9 = 8. 48 ÷ 6 = 8. 8 + 8 = 16.',
    stepByStep: ['72 ÷ 9 = 8', '48 ÷ 6 = 8', '8 + 8 = 16'],
  },
  // 15. Multiplicación 2 dígitos
  {
    id: 'bo-l2-15',
    level: 2,
    digits: 2,
    operationType: 'multiplicacion',
    question: 'Resuelve:',
    expression: '42 \\times 11',
    correctAnswer: 462,
    options: [
      { id: 'a', text: '462', isCorrect: true },
      { id: 'b', text: '452', isCorrect: false },
      { id: 'c', text: '472', isCorrect: false },
      { id: 'd', text: '442', isCorrect: false },
    ],
    explanation: 'Regla del 11: 4 + 2 = 6, se inserta en medio → 462.',
    stepByStep: ['4 y 2 en los extremos', '4 + 2 = 6 en el centro', 'Total = 462'],
  },
  // 16. Combinada
  {
    id: 'bo-l2-16',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Calcula:',
    expression: '95 - 5 \\times (14 - 6)',
    correctAnswer: 55,
    options: [
      { id: 'a', text: '55', isCorrect: true },
      { id: 'b', text: '65', isCorrect: false },
      { id: 'c', text: '45', isCorrect: false },
      { id: 'd', text: '50', isCorrect: false },
    ],
    explanation: '14 - 6 = 8. 5 × 8 = 40. 95 - 40 = 55.',
    stepByStep: ['14 - 6 = 8', '5 × 8 = 40', '95 - 40 = 55'],
  },
  // 17. Combinada
  {
    id: 'bo-l2-17',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Resuelve:',
    expression: '(54 + 27) \\div 9 + 18',
    correctAnswer: 27,
    options: [
      { id: 'a', text: '27', isCorrect: true },
      { id: 'b', text: '29', isCorrect: false },
      { id: 'c', text: '25', isCorrect: false },
      { id: 'd', text: '31', isCorrect: false },
    ],
    explanation: '54 + 27 = 81. 81 ÷ 9 = 9. 9 + 18 = 27.',
    stepByStep: ['54 + 27 = 81', '81 ÷ 9 = 9', '9 + 18 = 27'],
  },
  // 18. Multiplicación 2 dígitos
  {
    id: 'bo-l2-18',
    level: 2,
    digits: 2,
    operationType: 'multiplicacion',
    question: 'Calcula el producto:',
    expression: '28 \\times 15',
    correctAnswer: 420,
    options: [
      { id: 'a', text: '420', isCorrect: true },
      { id: 'b', text: '380', isCorrect: false },
      { id: 'c', text: '440', isCorrect: false },
      { id: 'd', text: '400', isCorrect: false },
    ],
    explanation: '28 × 15 = 14 × 30 = 420 (duplicando uno y dividiendo entre dos el otro).',
    stepByStep: ['28 ÷ 2 = 14', '15 × 2 = 30', '14 × 30 = 420'],
  },
  // 19. Combinada
  {
    id: 'bo-l2-19',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Resuelve la expresión combinada:',
    expression: '100 - 8 \\times 9 + 14',
    correctAnswer: 42,
    options: [
      { id: 'a', text: '42', isCorrect: true },
      { id: 'b', text: '32', isCorrect: false },
      { id: 'c', text: '52', isCorrect: false },
      { id: 'd', text: '46', isCorrect: false },
    ],
    explanation: '8 × 9 = 72. 100 - 72 = 28. 28 + 14 = 42.',
    stepByStep: ['8 × 9 = 72', '100 - 72 = 28', '28 + 14 = 42'],
  },
  // 20. Combinada
  {
    id: 'bo-l2-20',
    level: 2,
    digits: 2,
    operationType: 'combinada',
    question: 'Calcula el resultado final:',
    expression: '(63 \\div 7) \\times (48 \\div 8)',
    correctAnswer: 54,
    options: [
      { id: 'a', text: '54', isCorrect: true },
      { id: 'b', text: '48', isCorrect: false },
      { id: 'c', text: '56', isCorrect: false },
      { id: 'd', text: '64', isCorrect: false },
    ],
    explanation: '63 ÷ 7 = 9. 48 ÷ 8 = 6. 9 × 6 = 54.',
    stepByStep: ['63 ÷ 7 = 9', '48 ÷ 8 = 6', '9 × 6 = 54'],
  },
];

export const CURATED_BASIC_OPERATIONS_LEVEL_3: BasicOperationQuestion[] = [
  // 1. Suma 3 dígitos
  {
    id: 'bo-l3-1',
    level: 3,
    digits: 3,
    operationType: 'suma',
    question: 'Calcula la suma de 3 dígitos con acarreo:',
    expression: '478 + 385',
    correctAnswer: 863,
    options: [
      { id: 'a', text: '863', isCorrect: true },
      { id: 'b', text: '853', isCorrect: false },
      { id: 'c', text: '763', isCorrect: false },
      { id: 'd', text: '873', isCorrect: false },
    ],
    explanation: '8 + 5 = 13 (llevas 1). 7 + 8 + 1 = 16 (llevas 1). 4 + 3 + 1 = 8. Total: 863.',
    stepByStep: ['Unidades: 8 + 5 = 13', 'Decenas: 7 + 8 + 1 = 16', 'Centenas: 4 + 3 + 1 = 8', 'Total = 863'],
  },
  // 2. Resta 3 dígitos
  {
    id: 'bo-l3-2',
    level: 3,
    digits: 3,
    operationType: 'resta',
    question: 'Resuelve la resta de 3 dígitos:',
    expression: '842 - 367',
    correctAnswer: 475,
    options: [
      { id: 'a', text: '475', isCorrect: true },
      { id: 'b', text: '575', isCorrect: false },
      { id: 'c', text: '465', isCorrect: false },
      { id: 'd', text: '485', isCorrect: false },
    ],
    explanation: '12 - 7 = 5. 13 - 6 = 7. 7 - 3 = 4. Resultado: 475.',
    stepByStep: ['12 - 7 = 5', '13 - 6 = 7', '7 - 3 = 4', 'Total = 475'],
  },
  // 3. Multiplicación 3 dígitos x 2 dígitos
  {
    id: 'bo-l3-3',
    level: 3,
    digits: 3,
    operationType: 'multiplicacion',
    question: 'Multiplica el número de 3 dígitos:',
    expression: '125 \\times 12',
    correctAnswer: 1500,
    options: [
      { id: 'a', text: '1500', isCorrect: true },
      { id: 'b', text: '1450', isCorrect: false },
      { id: 'c', text: '1550', isCorrect: false },
      { id: 'd', text: '1600', isCorrect: false },
    ],
    explanation: '125 × 10 = 1250. 125 × 2 = 250. 1250 + 250 = 1500.',
    stepByStep: ['125 × 10 = 1250', '125 × 2 = 250', '1250 + 250 = 1500'],
  },
  // 4. División 3 dígitos entre 1 dígito
  {
    id: 'bo-l3-4',
    level: 3,
    digits: 3,
    operationType: 'division',
    question: 'Encuentra el cociente exacto:',
    expression: '936 \\div 8',
    correctAnswer: 117,
    options: [
      { id: 'a', text: '117', isCorrect: true },
      { id: 'b', text: '112', isCorrect: false },
      { id: 'c', text: '127', isCorrect: false },
      { id: 'd', text: '114', isCorrect: false },
    ],
    explanation: '800 ÷ 8 = 100, 136 ÷ 8 = 17. 100 + 17 = 117.',
    stepByStep: ['9 ÷ 8 = 1 (residuo 1)', '13 ÷ 8 = 1 (residuo 5)', '56 ÷ 8 = 7', 'Cociente = 117'],
  },
  // 5. Suma 3 dígitos
  {
    id: 'bo-l3-5',
    level: 3,
    digits: 3,
    operationType: 'suma',
    question: 'Suma:',
    expression: '629 + 487',
    correctAnswer: 1116,
    options: [
      { id: 'a', text: '1116', isCorrect: true },
      { id: 'b', text: '1126', isCorrect: false },
      { id: 'c', text: '1016', isCorrect: false },
      { id: 'd', text: '1106', isCorrect: false },
    ],
    explanation: '9 + 7 = 16. 2 + 8 + 1 = 11. 6 + 4 + 1 = 11. Total: 1116.',
    stepByStep: ['9 + 7 = 16 (acarreo 1)', '2 + 8 + 1 = 11 (acarreo 1)', '6 + 4 + 1 = 11', 'Total = 1116'],
  },
  // 6. Resta 3 dígitos
  {
    id: 'bo-l3-6',
    level: 3,
    digits: 3,
    operationType: 'resta',
    question: 'Calcula la diferencia:',
    expression: '715 - 438',
    correctAnswer: 277,
    options: [
      { id: 'a', text: '277', isCorrect: true },
      { id: 'b', text: '287', isCorrect: false },
      { id: 'c', text: '377', isCorrect: false },
      { id: 'd', text: '267', isCorrect: false },
    ],
    explanation: '15 - 8 = 7. 10 - 3 = 7. 6 - 4 = 2. Resultado: 277.',
    stepByStep: ['15 - 8 = 7', '10 - 3 = 7', '6 - 4 = 2', 'Total = 277'],
  },
  // 7. Multiplicación 3 dígitos
  {
    id: 'bo-l3-7',
    level: 3,
    digits: 3,
    operationType: 'multiplicacion',
    question: 'Calcula el producto:',
    expression: '240 \\times 8',
    correctAnswer: 1920,
    options: [
      { id: 'a', text: '1920', isCorrect: true },
      { id: 'b', text: '1820', isCorrect: false },
      { id: 'c', text: '1940', isCorrect: false },
      { id: 'd', text: '1880', isCorrect: false },
    ],
    explanation: '200 × 8 = 1600. 40 × 8 = 320. 1600 + 320 = 1920.',
    stepByStep: ['200 × 8 = 1600', '40 × 8 = 320', '1600 + 320 = 1920'],
  },
  // 8. División 3 dígitos
  {
    id: 'bo-l3-8',
    level: 3,
    digits: 3,
    operationType: 'division',
    question: 'Resuelve la división:',
    expression: '840 \\div 7',
    correctAnswer: 120,
    options: [
      { id: 'a', text: '120', isCorrect: true },
      { id: 'b', text: '110', isCorrect: false },
      { id: 'c', text: '140', isCorrect: false },
      { id: 'd', text: '125', isCorrect: false },
    ],
    explanation: '84 ÷ 7 = 12. Al tener el cero, el resultado es 120.',
    stepByStep: ['84 ÷ 7 = 12', 'Añadir 0 → 120'],
  },
  // 9. Combinada 3 dígitos
  {
    id: 'bo-l3-9',
    level: 3,
    digits: 3,
    operationType: 'combinada',
    question: 'Resuelve la operación combinada:',
    expression: '450 - 120 \\times 2 + 180',
    correctAnswer: 390,
    options: [
      { id: 'a', text: '390', isCorrect: true },
      { id: 'b', text: '490', isCorrect: false },
      { id: 'c', text: '370', isCorrect: false },
      { id: 'd', text: '840', isCorrect: false },
    ],
    explanation: '120 × 2 = 240. 450 - 240 = 210. 210 + 180 = 390.',
    stepByStep: ['120 × 2 = 240', '450 - 240 = 210', '210 + 180 = 390'],
  },
  // 10. Combinada con paréntesis
  {
    id: 'bo-l3-10',
    level: 3,
    digits: 3,
    operationType: 'combinada',
    question: 'Evalúa la expresión:',
    expression: '(620 - 140) \\div 6',
    correctAnswer: 80,
    options: [
      { id: 'a', text: '80', isCorrect: true },
      { id: 'b', text: '90', isCorrect: false },
      { id: 'c', text: '70', isCorrect: false },
      { id: 'd', text: '85', isCorrect: false },
    ],
    explanation: '620 - 140 = 480. 480 ÷ 6 = 80.',
    stepByStep: ['620 - 140 = 480', '480 ÷ 6 = 80'],
  },
  // 11. Suma 3 dígitos
  {
    id: 'bo-l3-11',
    level: 3,
    digits: 3,
    operationType: 'suma',
    question: 'Calcula la suma:',
    expression: '534 + 289',
    correctAnswer: 823,
    options: [
      { id: 'a', text: '823', isCorrect: true },
      { id: 'b', text: '813', isCorrect: false },
      { id: 'c', text: '723', isCorrect: false },
      { id: 'd', text: '833', isCorrect: false },
    ],
    explanation: '4 + 9 = 13. 3 + 8 + 1 = 12. 5 + 2 + 1 = 8. Total: 823.',
    stepByStep: ['4 + 9 = 13', '3 + 8 + 1 = 12', '5 + 2 + 1 = 8', 'Total = 823'],
  },
  // 12. Resta 3 dígitos
  {
    id: 'bo-l3-12',
    level: 3,
    digits: 3,
    operationType: 'resta',
    question: 'Efectúa la resta con ceros:',
    expression: '903 - 546',
    correctAnswer: 357,
    options: [
      { id: 'a', text: '357', isCorrect: true },
      { id: 'b', text: '457', isCorrect: false },
      { id: 'c', text: '367', isCorrect: false },
      { id: 'd', text: '347', isCorrect: false },
    ],
    explanation: '13 - 6 = 7. 9 - 4 = 5. 8 - 5 = 3. Resultado: 357.',
    stepByStep: ['13 - 6 = 7', '9 - 4 = 5', '8 - 5 = 3', 'Total = 357'],
  },
  // 13. Multiplicación 3 dígitos
  {
    id: 'bo-l3-13',
    level: 3,
    digits: 3,
    operationType: 'multiplicacion',
    question: 'Resuelve la multiplicación:',
    expression: '315 \\times 6',
    correctAnswer: 1890,
    options: [
      { id: 'a', text: '1890', isCorrect: true },
      { id: 'b', text: '1860', isCorrect: false },
      { id: 'c', text: '1920', isCorrect: false },
      { id: 'd', text: '1850', isCorrect: false },
    ],
    explanation: '300 × 6 = 1800, 15 × 6 = 90. 1800 + 90 = 1890.',
    stepByStep: ['300 × 6 = 1800', '15 × 6 = 90', '1800 + 90 = 1890'],
  },
  // 14. División 3 dígitos
  {
    id: 'bo-l3-14',
    level: 3,
    digits: 3,
    operationType: 'division',
    question: 'Calcula la división:',
    expression: '756 \\div 6',
    correctAnswer: 126,
    options: [
      { id: 'a', text: '126', isCorrect: true },
      { id: 'b', text: '136', isCorrect: false },
      { id: 'c', text: '116', isCorrect: false },
      { id: 'd', text: '124', isCorrect: false },
    ],
    explanation: '600 ÷ 6 = 100, 156 ÷ 6 = 26. 100 + 26 = 126.',
    stepByStep: ['7 ÷ 6 = 1 (residuo 1)', '15 ÷ 6 = 2 (residuo 3)', '36 ÷ 6 = 6', 'Cociente = 126'],
  },
  // 15. Combinada 3 dígitos
  {
    id: 'bo-l3-15',
    level: 3,
    digits: 3,
    operationType: 'combinada',
    question: 'Resuelve:',
    expression: '250 + 350 \\div 7',
    correctAnswer: 300,
    options: [
      { id: 'a', text: '300', isCorrect: true },
      { id: 'b', text: '350', isCorrect: false },
      { id: 'c', text: '280', isCorrect: false },
      { id: 'd', text: '85', isCorrect: false },
    ],
    explanation: '350 ÷ 7 = 50. 250 + 50 = 300.',
    stepByStep: ['350 ÷ 7 = 50', '250 + 50 = 300'],
  },
  // 16. Suma 3 dígitos
  {
    id: 'bo-l3-16',
    level: 3,
    digits: 3,
    operationType: 'suma',
    question: 'Calcula:',
    expression: '715 + 496',
    correctAnswer: 1211,
    options: [
      { id: 'a', text: '1211', isCorrect: true },
      { id: 'b', text: '1201', isCorrect: false },
      { id: 'c', text: '1111', isCorrect: false },
      { id: 'd', text: '1221', isCorrect: false },
    ],
    explanation: '5 + 6 = 11. 1 + 9 + 1 = 11. 7 + 4 + 1 = 12. Total: 1211.',
    stepByStep: ['5 + 6 = 11', '1 + 9 + 1 = 11', '7 + 4 + 1 = 12', 'Total = 1211'],
  },
  // 17. Resta 3 dígitos
  {
    id: 'bo-l3-17',
    level: 3,
    digits: 3,
    operationType: 'resta',
    question: 'Resuelve:',
    expression: '650 - 284',
    correctAnswer: 366,
    options: [
      { id: 'a', text: '366', isCorrect: true },
      { id: 'b', text: '376', isCorrect: false },
      { id: 'c', text: '466', isCorrect: false },
      { id: 'd', text: '356', isCorrect: false },
    ],
    explanation: '10 - 4 = 6. 14 - 8 = 6. 5 - 2 = 3. Resultado: 366.',
    stepByStep: ['10 - 4 = 6', '14 - 8 = 6', '5 - 2 = 3', 'Total = 366'],
  },
  // 18. Multiplicación 3 dígitos
  {
    id: 'bo-l3-18',
    level: 3,
    digits: 3,
    operationType: 'multiplicacion',
    question: 'Multiplica:',
    expression: '150 \\times 14',
    correctAnswer: 2100,
    options: [
      { id: 'a', text: '2100', isCorrect: true },
      { id: 'b', text: '2000', isCorrect: false },
      { id: 'c', text: '2200', isCorrect: false },
      { id: 'd', text: '1950', isCorrect: false },
    ],
    explanation: '150 × 10 = 1500. 150 × 4 = 600. 1500 + 600 = 2100.',
    stepByStep: ['150 × 10 = 1500', '150 × 4 = 600', '1500 + 600 = 2100'],
  },
  // 19. División 3 dígitos
  {
    id: 'bo-l3-19',
    level: 3,
    digits: 3,
    operationType: 'division',
    question: 'Calcula el cociente exacto:',
    expression: '945 \\div 9',
    correctAnswer: 105,
    options: [
      { id: 'a', text: '105', isCorrect: true },
      { id: 'b', text: '115', isCorrect: false },
      { id: 'c', text: '95', isCorrect: false },
      { id: 'd', text: '104', isCorrect: false },
    ],
    explanation: '900 ÷ 9 = 100, 45 ÷ 9 = 5. 100 + 5 = 105.',
    stepByStep: ['9 ÷ 9 = 1', '4 ÷ 9 = 0 (residuo 4)', '45 ÷ 9 = 5', 'Cociente = 105'],
  },
  // 20. Combinada 3 dígitos
  {
    id: 'bo-l3-20',
    level: 3,
    digits: 3,
    operationType: 'combinada',
    question: 'Efectúa la operación final:',
    expression: '(480 + 320) \\div 8 + 150',
    correctAnswer: 250,
    options: [
      { id: 'a', text: '250', isCorrect: true },
      { id: 'b', text: '240', isCorrect: false },
      { id: 'c', text: '260', isCorrect: false },
      { id: 'd', text: '230', isCorrect: false },
    ],
    explanation: '480 + 320 = 800. 800 ÷ 8 = 100. 100 + 150 = 250.',
    stepByStep: ['480 + 320 = 800', '800 ÷ 8 = 100', '100 + 150 = 250'],
  },
];

// Helper to get 20 questions for a given level
export const getBasicOperationsQuestionsForLevel = (level: 1 | 2 | 3): BasicOperationQuestion[] => {
  switch (level) {
    case 1:
      return [...CURATED_BASIC_OPERATIONS_LEVEL_1].sort(() => Math.random() - 0.5);
    case 2:
      return [...CURATED_BASIC_OPERATIONS_LEVEL_2].sort(() => Math.random() - 0.5);
    case 3:
      return [...CURATED_BASIC_OPERATIONS_LEVEL_3].sort(() => Math.random() - 0.5);
    default:
      return [...CURATED_BASIC_OPERATIONS_LEVEL_1];
  }
};
