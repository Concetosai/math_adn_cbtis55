import { TutorialLesson } from '../types';

export const TUTORIAL_LESSONS: TutorialLesson[] = [
  // ==========================================
  // ÁLGEBRA BÁSICA
  // ==========================================
  {
    id: 'algebra-terms',
    moduleId: 'algebra-basica',
    title: 'Términos Semejantes y Reducción',
    summary: 'Aprende a identificar y combinar monomios que comparten exactamente las mismas variables y exponentes.',
    icon: 'Variable',
    interactiveComponentId: 'algebra-terms',
    xpReward: 150,
    steps: [
      {
        stepNumber: 1,
        title: 'Anatomía de un Término Algebraico',
        explanation: 'Un término consta de un signo (+ o -), un coeficiente numérico, y una parte literal (variables con sus exponentes). Ejemplo: en -5x², el signo es negativo, el coeficiente es 5, la variable es x y el exponente es 2.',
        mathExpression: '-5x²  →  Signo: (-) | Coeficiente: 5 | Literal: x²',
        checkpointQuestion: {
          question: '¿Cuál es el coeficiente del término -7a³b?',
          options: [
            { id: 'A', text: '7', isCorrect: false },
            { id: 'B', text: '-7', isCorrect: true },
            { id: 'C', text: '3', isCorrect: false },
            { id: 'D', text: 'a³b', isCorrect: false }
          ],
          explanation: 'El coeficiente incluye el signo numérico que multiplica a las variables: -7.'
        }
      },
      {
        stepNumber: 2,
        title: 'Regla de Oro: Solo se suman términos semejantes',
        explanation: 'Dos términos son semejantes SI Y SOLO SI tienen exactamente las mismas letras con los mismos exponentes. Por ejemplo: 3x² y 8x² se pueden sumar para dar 11x². Pero 3x² y 4x NO se pueden sumar porque los exponentes difieren.',
        mathExpression: '3x² + 8x² = (3 + 8)x² = 11x²',
        checkpointQuestion: {
          question: '¿Cuál de las siguientes parejas de términos son SEMEJANTES?',
          options: [
            { id: 'A', text: '4x y 4y', isCorrect: false },
            { id: 'B', text: '2x²y y 5xy²', isCorrect: false },
            { id: 'C', text: '-9a²b y 3a²b', isCorrect: true },
            { id: 'D', text: '7x³ y 7x²', isCorrect: false }
          ],
          explanation: '-9a²b y 3a²b tienen exactamente la misma parte literal a²b.'
        }
      },
      {
        stepNumber: 3,
        title: 'Reducción en Polinomios Mixtos',
        explanation: 'Cuando tengas una expresión larga como 4x + 7y - 2x + 3y, agrupa los términos con la misma variable: (4x - 2x) + (7y + 3y) = 2x + 10y.',
        mathExpression: '(4x - 2x) + (7y + 3y) = 2x + 10y',
        checkpointQuestion: {
          question: 'Simplifica: 6m - 4n + 3m - 2n + 5',
          options: [
            { id: 'A', text: '9m - 6n + 5', isCorrect: true },
            { id: 'B', text: '3m - 2n + 5', isCorrect: false },
            { id: 'C', text: '9m + 6n + 5', isCorrect: false },
            { id: 'D', text: '8mn + 5', isCorrect: false }
          ],
          explanation: '(6m + 3m) = 9m; (-4n - 2n) = -6n; y la constante 5 queda intacta.'
        }
      }
    ]
  },
  {
    id: 'algebra-foil',
    moduleId: 'algebra-basica',
    title: 'Multiplicación de Binomios (Propiedad Distributiva y Áreas)',
    summary: 'Descubre cómo expandir el producto de dos binomios (x + a)(x + b) aplicando la propiedad distributiva término a término.',
    icon: 'Layers',
    interactiveComponentId: 'algebra-foil',
    xpReward: 180,
    steps: [
      {
        stepNumber: 1,
        title: 'El Principio del Área Geométrica',
        explanation: 'Multiplicar (x + a)(x + b) equivale a calcular el área total de un rectángulo dividido en 4 cuadrantes: x·x = x², x·b = bx, a·x = ax, y a·b = ab.',
        mathExpression: '(x + a)(x + b) = x² + ax + bx + ab',
        checkpointQuestion: {
          question: 'Al multiplicar (x + 3)(x + 4), ¿cuál es el término independiente (constante)?',
          options: [
            { id: 'A', text: '7', isCorrect: false },
            { id: 'B', text: '12', isCorrect: true },
            { id: 'C', text: '34', isCorrect: false },
            { id: 'D', text: 'x²', isCorrect: false }
          ],
          explanation: 'La constante resulta de multiplicar los dos números: 3 × 4 = 12.'
        }
      },
      {
        stepNumber: 2,
        title: 'Multiplicación Término a Término',
        explanation: '1. Primeros: x · x = x²\n2. Externos: x · b\n3. Internos: a · x\n4. Últimos: a · b\nLuego se combinan los términos centrales semejantes (ax + bx = (a+b)x).',
        mathExpression: '(x + 3)(x + 5) = x² + 5x + 3x + 15 = x² + 8x + 15',
        checkpointQuestion: {
          question: 'Desarrolla (x + 6)(x - 2):',
          options: [
            { id: 'A', text: 'x² + 4x - 12', isCorrect: true },
            { id: 'B', text: 'x² - 4x - 12', isCorrect: false },
            { id: 'C', text: 'x² + 8x + 12', isCorrect: false },
            { id: 'D', text: 'x² - 12', isCorrect: false }
          ],
          explanation: 'x² - 2x + 6x - 12 = x² + 4x - 12.'
        }
      }
    ]
  },
  {
    id: 'algebra-factor',
    moduleId: 'algebra-basica',
    title: 'Diferencia de Cuadrados y Factor Común',
    summary: 'Domina los dos métodos de factorización más importantes del álgebra para resolver problemas complejos.',
    icon: 'Sparkles',
    interactiveComponentId: 'algebra-factor',
    xpReward: 200,
    steps: [
      {
        stepNumber: 1,
        title: 'Factor Común Monomio',
        explanation: 'Se extrae el Máximo Común Divisor de los coeficientes y las variables con su menor exponente. Ejemplo: 6x³ + 9x² = 3x²(2x + 3).',
        mathExpression: '6x³ + 9x² = 3x²(2x + 3)',
        checkpointQuestion: {
          question: '¿Cuál es el factor común en 8x⁴ - 12x²?',
          options: [
            { id: 'A', text: '2x', isCorrect: false },
            { id: 'B', text: '4x²', isCorrect: true },
            { id: 'C', text: '8x²', isCorrect: false },
            { id: 'D', text: 'x⁴', isCorrect: false }
          ],
          explanation: 'El MCD de 8 y 12 es 4, y el menor exponente de x es x²: 4x²(2x² - 3).'
        }
      },
      {
        stepNumber: 2,
        title: 'Diferencia de Cuadrados: a² - b²',
        explanation: 'Toda resta de dos cuadrados perfectos se factoriza como el producto de dos binomios conjugados: a² - b² = (a - b)(a + b).',
        mathExpression: 'x² - 25 = (x - 5)(x + 5)',
        checkpointQuestion: {
          question: 'Factoriza 4x² - 49:',
          options: [
            { id: 'A', text: '(4x - 7)(4x + 7)', isCorrect: false },
            { id: 'B', text: '(2x - 7)(2x + 7)', isCorrect: true },
            { id: 'C', text: '(2x - 7)²', isCorrect: false },
            { id: 'D', text: '(2x + 49)(2x - 1)', isCorrect: false }
          ],
          explanation: '√(4x²) = 2x y √(49) = 7. Por tanto: (2x - 7)(2x + 7).'
        }
      }
    ]
  },

  // ==========================================
  // TRIGONOMETRÍA
  // ==========================================
  {
    id: 'trig-circle',
    moduleId: 'trigonometria',
    title: 'Círculo Unitario y Razones Trigonométricas',
    summary: 'Explora de forma visual e interactiva cómo se definen seno, coseno y tangente en un círculo de radio 1.',
    icon: 'Compass',
    interactiveComponentId: 'trig-circle',
    xpReward: 200,
    steps: [
      {
        stepNumber: 1,
        title: 'Definición en el Círculo de Radio 1',
        explanation: 'En el círculo trigonométrico (radio r = 1), cualquier ángulo θ determina un punto en la circunferencia con coordenadas (cos θ, sen θ). La abscisa X es el Coseno y la ordenada Y es el Seno.',
        mathExpression: 'P(θ) = (cos θ, sen θ)  con  x² + y² = 1',
        checkpointQuestion: {
          question: 'Para un ángulo de 90° (π/2 rad), ¿cuánto valen cos(90°) y sen(90°)?',
          options: [
            { id: 'A', text: 'cos=1, sen=0', isCorrect: false },
            { id: 'B', text: 'cos=0, sen=1', isCorrect: true },
            { id: 'C', text: 'cos=0, sen=0', isCorrect: false },
            { id: 'D', text: 'cos=1, sen=1', isCorrect: false }
          ],
          explanation: 'A 90°, el punto en el círculo unitario está en (0, 1). Por tanto cos(90°) = 0 y sen(90°) = 1.'
        }
      },
      {
        stepNumber: 2,
        title: 'Signos según los Cuadrantes',
        explanation: 'I Cuadrante (0°-90°): Seno(+), Coseno(+), Tangente(+)\nII Cuadrante (90°-180°): Seno(+), Coseno(-), Tangente(-)\nIII Cuadrante (180°-270°): Seno(-), Coseno(-), Tangente(+)\nIV Cuadrante (270°-360°): Seno(-), Coseno(+), Tangente(-)',
        mathExpression: 'tan(θ) = sen(θ) / cos(θ)',
        checkpointQuestion: {
          question: 'Si un ángulo está en el II Cuadrante (ej. 120°), ¿cuál es el signo de cos(120°)?',
          options: [
            { id: 'A', text: 'Positivo (+)', isCorrect: false },
            { id: 'B', text: 'Negativo (-)', isCorrect: true },
            { id: 'C', text: 'Cero (0)', isCorrect: false },
            { id: 'D', text: 'Indefinido', isCorrect: false }
          ],
          explanation: 'En el II cuadrante, el eje X es negativo, por lo que el Coseno es negativo.'
        }
      }
    ]
  },
  {
    id: 'trig-pythagoras',
    moduleId: 'trigonometria',
    title: 'Teorema de Pitágoras e Identidad Fundamental',
    summary: 'Relaciona los catetos y la hipotenusa en un triángulo rectángulo y comprende por qué sen²θ + cos²θ = 1 siempre se cumple.',
    icon: 'Triangle',
    interactiveComponentId: 'trig-pythagoras',
    xpReward: 180,
    steps: [
      {
        stepNumber: 1,
        title: 'El Teorema de Pitágoras',
        explanation: 'En todo triángulo rectángulo con catetos a y b e hipotenusa c: la suma de los cuadrados de los catetos es igual al cuadrado de la hipotenusa (a² + b² = c²).',
        mathExpression: 'a² + b² = c²  →  c = √(a² + b²)',
        checkpointQuestion: {
          question: 'Si un triángulo rectángulo tiene catetos de 6 cm y 8 cm, ¿cuánto mide la hipotenusa?',
          options: [
            { id: 'A', text: '14 cm', isCorrect: false },
            { id: 'B', text: '10 cm', isCorrect: true },
            { id: 'C', text: '12 cm', isCorrect: false },
            { id: 'D', text: '100 cm', isCorrect: false }
          ],
          explanation: 'c = √(6² + 8²) = √(36 + 64) = √100 = 10 cm.'
        }
      },
      {
        stepNumber: 2,
        title: 'La Identidad Trigonométrica Fundamental',
        explanation: 'Dividiendo la ecuación pitagórica a² + b² = c² entre c², obtenemos (a/c)² + (b/c)² = 1. Dado que a/c = sen θ y b/c = cos θ, se deduce la identidad universal: sen² θ + cos² θ = 1.',
        mathExpression: 'sen²(θ) + cos²(θ) = 1',
        checkpointQuestion: {
          question: 'Si sabemos que sen(θ) = 3/5, ¿cuánto vale cos²(θ)?',
          options: [
            { id: 'A', text: '9/25', isCorrect: false },
            { id: 'B', text: '16/25', isCorrect: true },
            { id: 'C', text: '4/5', isCorrect: false },
            { id: 'D', text: '1/5', isCorrect: false }
          ],
          explanation: 'cos²(θ) = 1 - sen²(θ) = 1 - (3/5)² = 1 - 9/25 = 16/25.'
        }
      }
    ]
  },

  // ==========================================
  // CÁLCULO
  // ==========================================
  {
    id: 'calc-derivative',
    moduleId: 'calculo',
    title: 'La Derivada: Pendiente de la Recta Tangente',
    summary: 'Comprende la intuición geométrica de la derivada mediante el límite de las pendientes secantes cuando Δx tiende a cero.',
    icon: 'Activity',
    interactiveComponentId: 'calc-derivative',
    xpReward: 220,
    steps: [
      {
        stepNumber: 1,
        title: 'De la Secante a la Tangente',
        explanation: 'Una recta secante une dos puntos (x, f(x)) y (x+h, f(x+h)) con pendiente m = [f(x+h)-f(x)]/h. Cuando la distancia h se hace infinitesimalmente pequeña (h → 0), la secante se transforma en la recta TANGENTE exacta en el punto x.',
        mathExpression: "f'(x) = lím (h → 0) [ (f(x + h) - f(x)) / h ]",
        checkpointQuestion: {
          question: 'Geométricamente, ¿qué representa la derivada f’(a) en el punto x = a?',
          options: [
            { id: 'A', text: 'El área bajo la curva f(x)', isCorrect: false },
            { id: 'B', text: 'La pendiente de la recta tangente a la curva en x = a', isCorrect: true },
            { id: 'C', text: 'El valor máximo de la función', isCorrect: false },
            { id: 'D', text: 'La distancia al origen', isCorrect: false }
          ],
          explanation: "La derivada f'(a) es exactamente la tasa de cambio instantánea o pendiente de la recta tangente en x = a."
        }
      },
      {
        stepNumber: 2,
        title: 'Ejemplo con f(x) = x²',
        explanation: 'Calculando el cociente de diferencias: [(x+h)² - x²]/h = [x² + 2xh + h² - x²]/h = [2xh + h²]/h = 2x + h. Al tomar el límite cuando h → 0, obtenemos exactamente 2x.',
        mathExpression: "f(x) = x²  →  f'(x) = 2x",
        checkpointQuestion: {
          question: '¿Cuál es la pendiente de la recta tangente a la curva f(x) = x² en el punto x = 4?',
          options: [
            { id: 'A', text: '4', isCorrect: false },
            { id: 'B', text: '8', isCorrect: true },
            { id: 'C', text: '16', isCorrect: false },
            { id: 'D', text: '2', isCorrect: false }
          ],
          explanation: "Como f'(x) = 2x, al evaluar en x = 4: f'(4) = 2(4) = 8."
        }
      }
    ]
  },
  {
    id: 'calc-power-rule',
    moduleId: 'calculo',
    title: 'La Regla de la Potencia para Derivar',
    summary: 'Aprende y domina la regla más fundamental y utilizada del cálculo diferencial: d/dx[xⁿ] = n·xⁿ⁻¹.',
    icon: 'Zap',
    interactiveComponentId: 'calc-power-rule',
    xpReward: 200,
    steps: [
      {
        stepNumber: 1,
        title: 'Fórmula General de la Regla de la Potencia',
        explanation: 'Para derivar cualquier término de la forma c·xⁿ: baja el exponente a multiplicar por el coeficiente y resta 1 al exponente.',
        mathExpression: 'd/dx [ c · xⁿ ] = c · n · xⁿ⁻¹',
        checkpointQuestion: {
          question: '¿Cuál es la derivada de f(x) = 5x³?',
          options: [
            { id: 'A', text: '15x²', isCorrect: true },
            { id: 'B', text: '5x²', isCorrect: false },
            { id: 'C', text: '15x³', isCorrect: false },
            { id: 'D', text: '8x²', isCorrect: false }
          ],
          explanation: 'd/dx[5x³] = 5 · 3 · x³⁻¹ = 15x².'
        }
      },
      {
        stepNumber: 2,
        title: 'Casos Especiales: Constantes y Exponentes Negativos/Fraccionarios',
        explanation: '1. La derivada de una constante es 0 (d/dx[c] = 0).\n2. La derivada de x es 1 (d/dx[x] = 1).\n3. Para raíces: √x = x^(1/2) → d/dx[x^(1/2)] = (1/2)x^(-1/2) = 1/(2√x).',
        mathExpression: 'd/dx [ √x ] = 1 / (2√x)',
        checkpointQuestion: {
          question: 'Deriva la función polinómica f(x) = 4x³ - 6x + 9:',
          options: [
            { id: 'A', text: '12x² - 6', isCorrect: true },
            { id: 'B', text: '12x² - 6x', isCorrect: false },
            { id: 'C', text: '12x² + 9', isCorrect: false },
            { id: 'D', text: '4x² - 6', isCorrect: false }
          ],
          explanation: 'd/dx[4x³] = 12x², d/dx[-6x] = -6, y la derivada de 9 es 0. Resultado: 12x² - 6.'
        }
      }
    ]
  },
  {
    id: 'calc-riemann',
    moduleId: 'calculo',
    title: 'La Integral: Área bajo la Curva y Antiderivadas',
    summary: 'Descubre cómo las sumas de rectángulos de Riemann se convierten en la integral definida y cómo antiderivar.',
    icon: 'Infinity',
    interactiveComponentId: 'calc-riemann',
    xpReward: 220,
    steps: [
      {
        stepNumber: 1,
        title: 'Aproximación por Rectángulos (Sumas de Riemann)',
        explanation: 'Para calcular el área irregular bajo una curva entre a y b, dividimos el intervalo en n rectángulos de ancho Δx. Al tomar el límite cuando n tiende a infinito (rectángulos infinitesimales), la suma se transforma en la Integral Definida.',
        mathExpression: 'Área = lím (n → ∞) ∑ f(xᵢ) Δx = ∫ [a a b] f(x) dx',
        checkpointQuestion: {
          question: '¿Qué ocurre con la precisión del cálculo del área cuando aumentamos el número de rectángulos de Riemann?',
          options: [
            { id: 'A', text: 'Disminuye la precisión', isCorrect: false },
            { id: 'B', text: 'Se vuelve exactamente el área real bajo la curva', isCorrect: true },
            { id: 'C', text: 'El área siempre se duplica', isCorrect: false },
            { id: 'D', text: 'No tiene efecto', isCorrect: false }
          ],
          explanation: 'Al aumentar n al infinito, el error se reduce a cero y la suma converge al valor exacto de la integral.'
        }
      },
      {
        stepNumber: 2,
        title: 'Regla de la Potencia para Integrales Indefinidas',
        explanation: 'La integración es la operación inversa de la derivación: sumamos 1 al exponente y dividimos entre el nuevo exponente (añadiendo la constante de integración + C).',
        mathExpression: '∫ xⁿ dx = [ xⁿ⁺¹ / (n + 1) ] + C  (para n ≠ -1)',
        checkpointQuestion: {
          question: 'Calcula la integral indefinida ∫ 6x² dx:',
          options: [
            { id: 'A', text: '2x³ + C', isCorrect: true },
            { id: 'B', text: '12x + C', isCorrect: false },
            { id: 'C', text: '6x³ + C', isCorrect: false },
            { id: 'D', text: '3x² + C', isCorrect: false }
          ],
          explanation: '∫ 6x² dx = 6 · (x³/3) + C = 2x³ + C.'
        }
      }
    ]
  }
];
