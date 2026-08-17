export interface DynamicCheckpointOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface DynamicCheckpointQuestion {
  question: string;
  mathExpression?: string;
  options: DynamicCheckpointOption[];
  explanation: string;
  variationSeed: string;
}

// Utility to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Helper to label options as A, B, C, D
function formatOptions(rawOptions: { text: string; isCorrect: boolean }[]): DynamicCheckpointOption[] {
  const shuffled = shuffleArray(rawOptions);
  const labels = ['A', 'B', 'C', 'D'];
  return shuffled.slice(0, 4).map((opt, idx) => ({
    id: labels[idx] || `${idx + 1}`,
    text: opt.text,
    isCorrect: opt.isCorrect,
  }));
}

// Random helper
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Generates a fresh, dynamic, mathematically valid checkpoint exercise
 * for a specific tutorial step.
 */
export function generateDynamicCheckpoint(tutorialId: string, stepNumber: number): DynamicCheckpointQuestion {
  const seed = `${tutorialId}-${stepNumber}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  // =========================================================================
  // 1. ÁLGEBRA: TÉRMINOS SEMEJANTES (algebra-terms)
  // =========================================================================
  if (tutorialId === 'algebra-terms') {
    if (stepNumber === 1) {
      // Anatomía de un término: Coeficiente con signo
      const coeff = randChoice([-15, -12, -9, -8, -7, -6, -5, -4, -3, 6, 7, 8, 9, 12, 14]);
      const vars = randChoice(['a³b²', 'x⁴y', 'm³n', 'p²q⁵', 'u⁴v³', 'x²z³']);
      const exponent1 = vars.match(/\d/)?.[0] || '3';
      const termStr = `${coeff > 0 ? `+${coeff}` : coeff}${vars}`;

      return {
        question: `¿Cuál es el coeficiente numérico (incluyendo su signo) del término ${termStr}?`,
        mathExpression: termStr,
        options: formatOptions([
          { text: `${coeff}`, isCorrect: true },
          { text: `${Math.abs(coeff)}`, isCorrect: coeff < 0 }, // distractor without sign if negative
          { text: `${exponent1}`, isCorrect: false },
          { text: `${vars}`, isCorrect: false },
          { text: `${coeff > 0 ? -coeff : Math.abs(coeff)}`, isCorrect: false },
        ]),
        explanation: `El coeficiente numérico incluye el valor y su signo: ${coeff}. La parte literal es ${vars}.`,
        variationSeed: seed,
      };
    }

    if (stepNumber === 2) {
      // Identificar términos semejantes
      const varCombo = randChoice([
        { matching: 'x³y²', diffExp: 'x²y³', diffLet: 'a³b²', diffPow: 'x⁴y' },
        { matching: 'a²b', diffExp: 'ab²', diffLet: 'm²n', diffPow: 'a³b' },
        { matching: 'm⁴n³', diffExp: 'm³n⁴', diffLet: 'x⁴y³', diffPow: 'm⁵n²' },
        { matching: 'p²q⁴', diffExp: 'p⁴q²', diffLet: 'u²v⁴', diffPow: 'p³q³' },
      ]);

      const c1 = randInt(2, 9);
      const c2 = -randInt(2, 9);

      return {
        question: '¿Cuál de las siguientes parejas de términos son verdaderamente SEMEJANTES?',
        options: formatOptions([
          { text: `${c1}${varCombo.matching}  y  ${c2}${varCombo.matching}`, isCorrect: true },
          { text: `${c1}${varCombo.matching}  y  ${c2}${varCombo.diffExp}`, isCorrect: false },
          { text: `${c1}${varCombo.matching}  y  ${c2}${varCombo.diffLet}`, isCorrect: false },
          { text: `${c1}${varCombo.matching}  y  ${c2}${varCombo.diffPow}`, isCorrect: false },
        ]),
        explanation: `Dos términos son semejantes solo si tienen idénticas letras e idénticos exponentes: (${varCombo.matching}).`,
        variationSeed: seed,
      };
    }

    if (stepNumber === 3) {
      // Reducción de Polinomios Mixtos: a1 m + b1 n + a2 m + b2 n + c
      const a1 = randInt(3, 8);
      const a2 = randChoice([-3, -2, 2, 3, 4]);
      const b1 = -randInt(2, 6);
      const b2 = -randInt(1, 4);
      const c = randInt(2, 9);

      const mTotal = a1 + a2;
      const nTotal = b1 + b2;

      const expr = `${a1}m ${b1 < 0 ? `- ${Math.abs(b1)}n` : `+ ${b1}n`} ${a2 < 0 ? `- ${Math.abs(a2)}m` : `+ ${a2}m`} ${b2 < 0 ? `- ${Math.abs(b2)}n` : `+ ${b2}n`} + ${c}`;
      const correctText = `${mTotal}m ${nTotal < 0 ? `- ${Math.abs(nTotal)}n` : `+ ${nTotal}n`} + ${c}`;
      const distractor1 = `${mTotal}m ${-nTotal < 0 ? `- ${Math.abs(-nTotal)}n` : `+ ${-nTotal}n`} + ${c}`; // sign error in n
      const distractor2 = `${a1 - a2}m ${b1 - b2 < 0 ? `- ${Math.abs(b1 - b2)}n` : `+ ${b1 - b2}n`} + ${c}`;
      const distractor3 = `${mTotal + nTotal}mn + ${c}`; // illegal variable merge

      return {
        question: `Simplifica reduciendo términos semejantes:\n${expr}`,
        mathExpression: expr,
        options: formatOptions([
          { text: correctText, isCorrect: true },
          { text: distractor1, isCorrect: false },
          { text: distractor2, isCorrect: false },
          { text: distractor3, isCorrect: false },
        ]),
        explanation: `Agrupamos: (${a1}m ${a2 < 0 ? `${a2}m` : `+${a2}m`}) = ${mTotal}m; (${b1}n ${b2 < 0 ? `${b2}n` : `+${b2}n`}) = ${nTotal}n; y la constante ${c} queda intacta.`,
        variationSeed: seed,
      };
    }
  }

  // =========================================================================
  // 2. ÁLGEBRA: BINOMIOS FOIL (algebra-foil)
  // =========================================================================
  if (tutorialId === 'algebra-foil') {
    if (stepNumber === 1) {
      // Término independiente en (x + a)(x + b)
      const a = randInt(2, 8);
      const b = randInt(2, 9);
      const constant = a * b;

      return {
        question: `Al multiplicar (x + ${a})(x + ${b}), ¿cuál es el término independiente (constante)?`,
        mathExpression: `(x + ${a})(x + ${b})`,
        options: formatOptions([
          { text: `${constant}`, isCorrect: true },
          { text: `${a + b}`, isCorrect: false },
          { text: `${a * 10 + b}`, isCorrect: false },
          { text: `x²`, isCorrect: false },
        ]),
        explanation: `El término constante proviene del producto de los dos números independientes: ${a} × ${b} = ${constant}.`,
        variationSeed: seed,
      };
    }

    if (stepNumber === 2) {
      // Desarrolla (x + a)(x - b)
      const a = randInt(3, 8);
      const b = randInt(2, 6);
      const midCoeff = a - b;
      const lastCoeff = a * b;

      const midStr = midCoeff === 0 ? '' : midCoeff > 0 ? `+ ${midCoeff}x` : `- ${Math.abs(midCoeff)}x`;
      const correct = `x² ${midStr} - ${lastCoeff}`.replace(/\s+/g, ' ');
      const dist1 = `x² ${midCoeff > 0 ? `- ${midCoeff}x` : `+ ${Math.abs(midCoeff)}x`} - ${lastCoeff}`.replace(/\s+/g, ' ');
      const dist2 = `x² + ${a + b}x + ${lastCoeff}`;
      const dist3 = `x² - ${lastCoeff}`;

      return {
        question: `Desarrolla el producto de binomios (x + ${a})(x - ${b}) aplicando FOIL:`,
        mathExpression: `(x + ${a})(x - ${b})`,
        options: formatOptions([
          { text: correct, isCorrect: true },
          { text: dist1, isCorrect: false },
          { text: dist2, isCorrect: false },
          { text: dist3, isCorrect: false },
        ]),
        explanation: `First: x², Outer: -${b}x, Inner: +${a}x, Last: -${lastCoeff}. Combinando: x² + (${a} - ${b})x - ${lastCoeff} = ${correct}.`,
        variationSeed: seed,
      };
    }
  }

  // =========================================================================
  // 3. ÁLGEBRA: FACTORIZACIÓN (algebra-factor)
  // =========================================================================
  if (tutorialId === 'algebra-factor') {
    if (stepNumber === 1) {
      // Factor común monomio en A x⁴ - B x²
      const gcf = randChoice([3, 4, 5, 6, 7]);
      const k1 = randChoice([2, 3, 5]);
      const k2 = randChoice([1, 4, 7]);
      const A = gcf * k1;
      const B = gcf * k2;

      return {
        question: `¿Cuál es el Máximo Factor Común monomio en ${A}x⁴ - ${B}x²?`,
        mathExpression: `${A}x⁴ - ${B}x²`,
        options: formatOptions([
          { text: `${gcf}x²`, isCorrect: true },
          { text: `${gcf}x`, isCorrect: false },
          { text: `${A}x²`, isCorrect: false },
          { text: `x⁴`, isCorrect: false },
        ]),
        explanation: `El MCD numérico entre ${A} y ${B} es ${gcf}, y la menor potencia de x es x². Por tanto, el factor común es ${gcf}x²(${k1}x² - ${k2}).`,
        variationSeed: seed,
      };
    }

    if (stepNumber === 2) {
      // Diferencia de cuadrados A²x² - B²
      const A = randChoice([2, 3, 4, 5]);
      const B = randChoice([3, 5, 7, 8, 9, 10]);
      const A2 = A * A;
      const B2 = B * B;

      return {
        question: `Factoriza la diferencia de cuadrados ${A2}x² - ${B2}:`,
        mathExpression: `${A2}x² - ${B2}`,
        options: formatOptions([
          { text: `(${A}x - ${B})(${A}x + ${B})`, isCorrect: true },
          { text: `(${A2}x - ${B})(${A2}x + ${B})`, isCorrect: false },
          { text: `(${A}x - ${B})²`, isCorrect: false },
          { text: `(${A}x + ${B2})(${A}x - 1)`, isCorrect: false },
        ]),
        explanation: `√(${A2}x²) = ${A}x  y  √(${B2}) = ${B}. Por la regla a² - b² = (a-b)(a+b), queda (${A}x - ${B})(${A}x + ${B}).`,
        variationSeed: seed,
      };
    }
  }

  // =========================================================================
  // 4. TRIGONOMETRÍA: CÍRCULO UNITARIO (trig-circle)
  // =========================================================================
  if (tutorialId === 'trig-circle') {
    if (stepNumber === 1) {
      const angleConfig = randChoice([
        { deg: 0, rad: '0', cos: '1', sin: '0' },
        { deg: 90, rad: 'π/2', cos: '0', sin: '1' },
        { deg: 180, rad: 'π', cos: '-1', sin: '0' },
        { deg: 270, rad: '3π/2', cos: '0', sin: '-1' },
        { deg: 360, rad: '2π', cos: '1', sin: '0' },
      ]);

      return {
        question: `En el círculo unitario (r = 1), para un ángulo de ${angleConfig.deg}° (${angleConfig.rad} rad), ¿cuánto valen cos(${angleConfig.deg}°) y sin(${angleConfig.deg}°)?`,
        mathExpression: `θ = ${angleConfig.deg}°  →  P(θ) = (cos θ, sin θ)`,
        options: formatOptions([
          { text: `cos = ${angleConfig.cos}, sin = ${angleConfig.sin}`, isCorrect: true },
          { text: `cos = ${angleConfig.sin}, sin = ${angleConfig.cos}`, isCorrect: false },
          { text: `cos = 0, sin = 0`, isCorrect: false },
          { text: `cos = 1, sin = 1`, isCorrect: false },
        ]),
        explanation: `A ${angleConfig.deg}°, las coordenadas en el círculo unitario son (${angleConfig.cos}, ${angleConfig.sin}), donde X es el coseno y Y es el seno.`,
        variationSeed: seed,
      };
    }

    if (stepNumber === 2) {
      const quadConfig = randChoice([
        { quad: 'II Cuadrante', angle: '135°', func: 'cos', sign: 'Negativo (-)', reason: 'en el II cuadrante la coordenada X es negativa.' },
        { quad: 'II Cuadrante', angle: '120°', func: 'sin', sign: 'Positivo (+)', reason: 'en el II cuadrante la coordenada Y es positiva.' },
        { quad: 'III Cuadrante', angle: '225°', func: 'tan', sign: 'Positivo (+)', reason: 'en el III cuadrante seno (-) y coseno (-) dan tangente (-/- = +).' },
        { quad: 'III Cuadrante', angle: '240°', func: 'cos', sign: 'Negativo (-)', reason: 'en el III cuadrante tanto X como Y son negativos.' },
        { quad: 'IV Cuadrante', angle: '315°', func: 'cos', sign: 'Positivo (+)', reason: 'en el IV cuadrante la coordenada X vuelve a ser positiva.' },
        { quad: 'IV Cuadrante', angle: '300°', func: 'sin', sign: 'Negativo (-)', reason: 'en el IV cuadrante la coordenada Y es negativa.' },
      ]);

      return {
        question: `Si un ángulo de ${quadConfig.angle} se ubica en el ${quadConfig.quad}, ¿cuál es el signo de ${quadConfig.func}(${quadConfig.angle})?`,
        options: formatOptions([
          { text: `${quadConfig.sign}`, isCorrect: true },
          { text: `${quadConfig.sign.includes('+') ? 'Negativo (-)' : 'Positivo (+)'}`, isCorrect: false },
          { text: 'Cero (0)', isCorrect: false },
          { text: 'Indefinido', isCorrect: false },
        ]),
        explanation: `En el ${quadConfig.quad}, ${quadConfig.func} es ${quadConfig.sign} porque ${quadConfig.reason}`,
        variationSeed: seed,
      };
    }
  }

  // =========================================================================
  // 5. TRIGONOMETRÍA: PITÁGORAS E IDENTIDADES (trig-pythagoras)
  // =========================================================================
  if (tutorialId === 'trig-pythagoras') {
    if (stepNumber === 1) {
      const triple = randChoice([
        { a: 6, b: 8, c: 10 },
        { a: 5, b: 12, c: 13 },
        { a: 9, b: 12, c: 15 },
        { a: 8, b: 15, c: 17 },
        { a: 7, b: 24, c: 25 },
        { a: 12, b: 16, c: 20 },
      ]);

      return {
        question: `Si un triángulo rectángulo tiene catetos de ${triple.a} cm y ${triple.b} cm, ¿cuánto mide la hipotenusa?`,
        mathExpression: `c = √(${triple.a}² + ${triple.b}²)`,
        options: formatOptions([
          { text: `${triple.c} cm`, isCorrect: true },
          { text: `${triple.a + triple.b} cm`, isCorrect: false },
          { text: `${triple.c + 2} cm`, isCorrect: false },
          { text: `${triple.c * triple.c} cm`, isCorrect: false },
        ]),
        explanation: `c = √(${triple.a}² + ${triple.b}²) = √(${triple.a * triple.a} + ${triple.b * triple.b}) = √${triple.c * triple.c} = ${triple.c} cm.`,
        variationSeed: seed,
      };
    }

    if (stepNumber === 2) {
      const ratio = randChoice([
        { num: 3, den: 5, cos2Num: 16, cos2Den: 25 },
        { num: 4, den: 5, cos2Num: 9, cos2Den: 25 },
        { num: 5, den: 13, cos2Num: 144, cos2Den: 169 },
        { num: 12, den: 13, cos2Num: 25, cos2Den: 169 },
        { num: 8, den: 17, cos2Num: 225, cos2Den: 289 },
      ]);

      return {
        question: `Si sabemos que sin(θ) = ${ratio.num}/${ratio.den}, ¿cuánto vale cos²(θ) aplicando la identidad sin²(θ) + cos²(θ) = 1?`,
        mathExpression: `cos²(θ) = 1 - sin²(θ) = 1 - (${ratio.num}/${ratio.den})²`,
        options: formatOptions([
          { text: `${ratio.cos2Num}/${ratio.cos2Den}`, isCorrect: true },
          { text: `${ratio.num * ratio.num}/${ratio.cos2Den}`, isCorrect: false },
          { text: `${ratio.den - ratio.num}/${ratio.den}`, isCorrect: false },
          { text: `1/${ratio.cos2Den}`, isCorrect: false },
        ]),
        explanation: `cos²(θ) = 1 - (${ratio.num}/${ratio.den})² = 1 - ${ratio.num * ratio.num}/${ratio.cos2Den} = ${ratio.cos2Num}/${ratio.cos2Den}.`,
        variationSeed: seed,
      };
    }
  }

  // =========================================================================
  // 6. CÁLCULO: DERIVADAS Y TANGENTES (calc-derivative)
  // =========================================================================
  if (tutorialId === 'calc-derivative') {
    if (stepNumber === 1) {
      return {
        question: 'Geométricamente, ¿qué representa el valor de la derivada f’(a) en una curva en x = a?',
        options: formatOptions([
          { text: 'La pendiente de la recta tangente a la curva en x = a', isCorrect: true },
          { text: 'El área total bajo la curva f(x)', isCorrect: false },
          { text: 'El valor máximo absoluto de la función', isCorrect: false },
          { text: 'La distancia euclidiana entre el origen y el punto', isCorrect: false },
        ]),
        explanation: 'La derivada f’(a) es la tasa de cambio instantánea, es decir, la pendiente exacta de la recta tangente en ese punto.',
        variationSeed: seed,
      };
    }

    if (stepNumber === 2) {
      const k = randInt(2, 8);
      const slope = 2 * k;

      return {
        question: `¿Cuál es la pendiente de la recta tangente a la curva f(x) = x² en el punto x = ${k}?`,
        mathExpression: `f(x) = x²  →  f'(x) = 2x  →  f'(${k}) = ?`,
        options: formatOptions([
          { text: `${slope}`, isCorrect: true },
          { text: `${k}`, isCorrect: false },
          { text: `${k * k}`, isCorrect: false },
          { text: `${slope + 2}`, isCorrect: false },
        ]),
        explanation: `Como la derivada de f(x) = x² es f'(x) = 2x, al evaluar en x = ${k}: f'(${k}) = 2(${k}) = ${slope}.`,
        variationSeed: seed,
      };
    }
  }

  // =========================================================================
  // 7. CÁLCULO: REGLA DE LA POTENCIA (calc-power-rule)
  // =========================================================================
  if (tutorialId === 'calc-power-rule') {
    if (stepNumber === 1) {
      const c = randInt(3, 8);
      const n = randInt(2, 5);
      const newCoeff = c * n;
      const newExp = n - 1;
      const expStr = newExp === 1 ? 'x' : `x^${newExp}`;

      return {
        question: `¿Cuál es la derivada de la función f(x) = ${c}x^${n} aplicando la regla de la potencia?`,
        mathExpression: `d/dx [ ${c}x^${n} ] = ${c} · ${n} · x^(${n}-1)`,
        options: formatOptions([
          { text: `${newCoeff}${expStr}`, isCorrect: true },
          { text: `${c}${expStr}`, isCorrect: false },
          { text: `${newCoeff}x^${n}`, isCorrect: false },
          { text: `${c + n}${expStr}`, isCorrect: false },
        ]),
        explanation: `d/dx[${c}x^${n}] = ${c} · ${n} · x^(${n}-1) = ${newCoeff}${expStr}.`,
        variationSeed: seed,
      };
    }

    if (stepNumber === 2) {
      const a = randInt(2, 6);
      const b = randInt(3, 9);
      const c = randInt(4, 15);

      const d1 = 3 * a;

      return {
        question: `Deriva la función polinómica f(x) = ${a}x³ - ${b}x + ${c}:`,
        mathExpression: `f(x) = ${a}x³ - ${b}x + ${c}`,
        options: formatOptions([
          { text: `${d1}x² - ${b}`, isCorrect: true },
          { text: `${d1}x² - ${b}x`, isCorrect: false },
          { text: `${d1}x² + ${c}`, isCorrect: false },
          { text: `${a}x² - ${b}`, isCorrect: false },
        ]),
        explanation: `d/dx[${a}x³] = ${d1}x², d/dx[-${b}x] = -${b}, y la derivada de la constante ${c} es 0. Resultado: ${d1}x² - ${b}.`,
        variationSeed: seed,
      };
    }
  }

  // =========================================================================
  // 8. CÁLCULO: INTEGRAL Y RIEMANN (calc-riemann)
  // =========================================================================
  if (tutorialId === 'calc-riemann') {
    if (stepNumber === 1) {
      return {
        question: '¿Qué ocurre con la aproximación del área de las sumas de Riemann cuando el número de rectángulos (n) tiende a infinito?',
        options: formatOptions([
          { text: 'Converge exactamente al valor real del área bajo la curva (Integral Definida)', isCorrect: true },
          { text: 'El área calculada disminuye hasta anularse', isCorrect: false },
          { text: 'El error se multiplica exponencialmente', isCorrect: false },
          { text: 'El área siempre se duplica automáticamente', isCorrect: false },
        ]),
        explanation: 'Al tomar el límite cuando n → ∞ y Δx → 0, la sumatoria de Riemann converge con precisión absoluta a la integral definida ∫ f(x) dx.',
        variationSeed: seed,
      };
    }

    if (stepNumber === 2) {
      const multiplier = randInt(2, 5);
      const n = randChoice([2, 3, 4]);
      const k = multiplier * (n + 1);

      return {
        question: `Calcula la integral indefinida: ∫ ${k}x^${n} dx`,
        mathExpression: `∫ ${k}x^${n} dx = ${k} · [ x^(${n}+1) / (${n}+1) ] + C`,
        options: formatOptions([
          { text: `${multiplier}x^${n + 1} + C`, isCorrect: true },
          { text: `${k * n}x^${n - 1} + C`, isCorrect: false },
          { text: `${k}x^${n + 1} + C`, isCorrect: false },
          { text: `${multiplier}x^${n} + C`, isCorrect: false },
        ]),
        explanation: `∫ ${k}x^${n} dx = ${k} · (x^${n + 1} / ${n + 1}) + C = (${k}/${n + 1})x^${n + 1} + C = ${multiplier}x^${n + 1} + C.`,
        variationSeed: seed,
      };
    }
  }

  // Generic fallback if any unknown tutorial step
  return {
    question: `Comprobación del Paso ${stepNumber}: Selecciona la respuesta correcta:`,
    options: formatOptions([
      { text: 'Opción Correcta demostrada en este paso', isCorrect: true },
      { text: 'Distractor conceptual A', isCorrect: false },
      { text: 'Distractor conceptual B', isCorrect: false },
      { text: 'Distractor conceptual C', isCorrect: false },
    ]),
    explanation: 'Excelente comprensión del procedimiento matemático del paso.',
    variationSeed: seed,
  };
}
