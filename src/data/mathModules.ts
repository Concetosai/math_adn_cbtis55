import { MathModule } from '../types';

export const MATH_MODULES: MathModule[] = [
  // 1. FUNDAMENTOS ARITMÉTICOS (Jerarquía de Operaciones & Leyes de Signos)
  {
    id: 'base-cero',
    title: 'Fundamentos Aritméticos',
    subtitle: 'Jerarquía de Operaciones (PEMDAS) y Leyes de Signos',
    description: 'Domina los cimientos matemáticos: jerarquía de operaciones (PEMDAS), leyes de signos, números enteros y potencias elementales.',
    iconName: 'Sparkles',
    accentColor: 'emerald',
    glowColor: '#10b981',
    tag: 'Aritmética 01',
    totalLevels: 3,
    introVideoId: 'EBc_gdyp0ro',
    introVideoTitle: 'Fundamentos Aritméticos: Jerarquía de Operaciones y Leyes de Signos',
    formulas: [
      {
        id: 'pemdas',
        title: 'Jerarquía de Operaciones (PEMDAS)',
        category: 'Aritmética',
        formula: '1° Paréntesis () → 2° Exponentes xⁿ → 3° Mult/Div (izq a der) → 4° Sumas/Restas (izq a der)',
        explanation: 'Las operaciones matemáticas no se leen simplemente de izquierda a derecha. Siempre se evalúan respetando la jerarquía para no alterar el valor de la expresión.',
        example: 'Calcular: 8 + 2 × (5 - 2)²\n1. Paréntesis: (5 - 2) = 3\n2. Exponente: 3² = 9 → 8 + 2 × 9\n3. Multiplicación: 2 × 9 = 18 → 8 + 18\n4. Suma: 8 + 18 = 26',
        tips: 'Regla mnemotécnica: "Por Encima Mi Dulce Abuela Sara" (PEMDAS).',
        caution: 'Error común: Hacer primero 8 + 2 = 10 y luego multiplicar. ¡La multiplicación tiene mayor prioridad que la suma!'
      },
      {
        id: 'leyes-signos-mult',
        title: 'Leyes de Signos (Multiplicación y División)',
        category: 'Signos',
        formula: '(+) · (+) = (+)\n(+) · (-) = (-)\n(-) · (+) = (-)\n(-) · (-) = (+)',
        explanation: 'Signos iguales dan resultado positivo; signos contrarios dan resultado negativo. Aplica tanto para multiplicación como para división.',
        example: '(-4) × (-7) = +28\n(-36) ÷ (+9) = -4',
        tips: 'El producto de una cantidad par de números negativos siempre es positivo. Si la cantidad de negativos es impar, el resultado es negativo.',
        caution: 'No confundir con la suma de signos iguales: (-3) + (-5) = -8 (se suman y se conserva el signo negativo).'
      },
      {
        id: 'suma-resta-enteros',
        title: 'Suma y Resta de Enteros',
        category: 'Aritmética',
        formula: 'Signos iguales: Se suman los valores y se conserva el signo.\nSignos opuestos: Se resta el mayor menos el menor y queda el signo del de mayor valor absoluto.',
        explanation: 'Imagina una recta numérica o balance de deudas y haberes. Si debes 15 y pagas 9, sigues debiendo 6.',
        example: '-12 + 7 = -5  (12 - 7 = 5, gana el signo de -12)\n-8 - 14 = -22 (se suman porque ambos son negativos)',
        tips: 'Un doble signo negativo se convierte en positivo: a - (-b) = a + b.',
        caution: '5 - (-3) = 5 + 3 = 8 (no es 2).'
      },
      {
        id: 'potencias-cero-uno',
        title: 'Potencias Especiales y Valor Absoluto',
        category: 'Potencias',
        formula: 'a⁰ = 1  (con a ≠ 0)\na¹ = a\n| -x | = x  (la distancia siempre es positiva)',
        explanation: 'Cualquier número real distinto de cero elevado a la potencia cero es igual a 1. El valor absoluto representa la distancia al origen.',
        example: '(-99)⁰ = 1\n|-17.5| = 17.5\n-3² = -(3²) = -9, pero (-3)² = +9',
        tips: 'Ten mucho cuidado con la posición de los paréntesis en las potencias con signo negativo.',
        caution: '-4² es -16 porque el exponente 2 solo afecta al 4, no al signo. Para que sea positivo debe escribirse (-4)² = 16.'
      }
    ],
    exercises: [
      {
        id: 'bc-1',
        moduleId: 'base-cero',
        level: 1,
        levelName: 'Nivel 1: Jerarquía y Signos',
        question: '¿Cuál es el resultado de la siguiente operación?',
        mathExpression: '6 + 4 × (8 - 5)',
        options: [
          { id: 'a', text: '30', isCorrect: false },
          { id: 'b', text: '18', isCorrect: true },
          { id: 'c', text: '24', isCorrect: false },
          { id: 'd', text: '42', isCorrect: false }
        ],
        solutionExplanation: 'Primero se resuelve el paréntesis: (8 - 5) = 3. Luego la multiplicación: 4 × 3 = 12. Finalmente la suma: 6 + 12 = 18.',
        steps: [
          'Paso 1: Resolver paréntesis → (8 - 5) = 3',
          'Paso 2: Expresión queda como: 6 + 4 × 3',
          'Paso 3: Multiplicar antes de sumar → 4 × 3 = 12',
          'Paso 4: Sumar → 6 + 12 = 18'
        ],
        hint: 'Recuerda que la multiplicación tiene prioridad sobre la suma.',
        xpReward: 25
      },
      {
        id: 'bc-2',
        moduleId: 'base-cero',
        level: 1,
        levelName: 'Nivel 1: Jerarquía y Signos',
        question: 'Resuelve la operación con números enteros con signo:',
        mathExpression: '(-8) × (-3) + (-14) ÷ 2',
        options: [
          { id: 'a', text: '17', isCorrect: true },
          { id: 'b', text: '-31', isCorrect: false },
          { id: 'c', text: '31', isCorrect: false },
          { id: 'd', text: '-17', isCorrect: false }
        ],
        solutionExplanation: '(-8) × (-3) = +24. Por otro lado, (-14) ÷ 2 = -7. Por tanto: 24 + (-7) = 24 - 7 = 17.',
        steps: [
          'Paso 1: (-8) × (-3) = 24 (menos por menos da más)',
          'Paso 2: (-14) ÷ 2 = -7 (menos entre más da menos)',
          'Paso 3: 24 + (-7) = 24 - 7 = 17'
        ],
        hint: 'Menos por menos da más en la multiplicación. La división tiene prioridad.',
        xpReward: 25
      },
      {
        id: 'bc-3',
        moduleId: 'base-cero',
        level: 2,
        levelName: 'Nivel 2: Potencias y Paréntesis Complejos',
        question: 'Evalúa la siguiente expresión combinada:',
        mathExpression: '3 × [ 15 - (2³ + 4) ] + (-5)²',
        options: [
          { id: 'a', text: '34', isCorrect: true },
          { id: 'b', text: '16', isCorrect: false },
          { id: 'c', text: '-16', isCorrect: false },
          { id: 'd', text: '50', isCorrect: false }
        ],
        solutionExplanation: '2³ = 8. (8 + 4) = 12. Corchetes: [15 - 12] = 3. 3 × 3 = 9. Por otro lado (-5)² = 25. 9 + 25 = 34.',
        steps: [
          'Paso 1: 2³ = 8 → (8 + 4) = 12',
          'Paso 2: Corchetes → [15 - 12] = 3',
          'Paso 3: Multiplicación → 3 × 3 = 9',
          'Paso 4: Potencia (-5)² = 25',
          'Paso 5: Suma final → 9 + 25 = 34'
        ],
        hint: 'Resuelve de adentro hacia afuera: paréntesis, luego corchetes, potencias y productos.',
        xpReward: 40
      },
      {
        id: 'bc-4',
        moduleId: 'base-cero',
        level: 3,
        levelName: 'Nivel 3: Reto ADN de Precisión',
        question: '¿Cuál es el valor exacto de la expresión?',
        mathExpression: '-2⁴ + | -18 | ÷ 3 - (4 - 7)² + 10⁰',
        options: [
          { id: 'a', text: '-18', isCorrect: true },
          { id: 'b', text: '14', isCorrect: false },
          { id: 'c', text: '-2', isCorrect: false },
          { id: 'd', text: '2', isCorrect: false }
        ],
        solutionExplanation: '-2⁴ = -16. |-18| = 18 → 18 ÷ 3 = 6. (4 - 7) = -3 → (-3)² = 9. 10⁰ = 1. Expresión: -16 + 6 - 9 + 1 = -18.',
        steps: [
          'Paso 1: -2⁴ = -16 (el menos no está agrupado)',
          'Paso 2: |-18| ÷ 3 = 18 ÷ 3 = 6',
          'Paso 3: (4 - 7)² = (-3)² = 9 → queda -9',
          'Paso 4: 10⁰ = 1',
          'Paso 5: -16 + 6 - 9 + 1 = -18'
        ],
        hint: 'Ojo con -2⁴ vs (-2)⁴ y recuerda que 10⁰ = 1.',
        xpReward: 60
      }
    ]
  },

  // 2. ÁLGEBRA BÁSICA
  {
    id: 'algebra-basica',
    title: 'Álgebra Básica',
    subtitle: 'Monomios, Polinomios y Leyes de Exponentes',
    description: 'Aprende a simplificar expresiones algebraicas, términos semejantes, leyes de potencias, productos notables y factorización elemental.',
    iconName: 'Variable',
    accentColor: 'cyan',
    glowColor: '#06b6d4',
    tag: 'Estructura 02',
    totalLevels: 3,
    introVideoId: '',
    introVideoTitle: 'Álgebra Básica: Leyes de Exponentes, Productos Notables y Factorización',
    formulas: [
      {
        id: 'leyes-exponentes',
        title: 'Leyes de los Exponentes',
        category: 'Exponentes',
        formula: 'xᵃ · xᵇ = xᵃ⁺ᵇ\n(xᵃ)ᵇ = xᵃᵇ\nxᵃ / xᵇ = xᵃ⁻ᵇ\nx⁻ⁿ = 1 / xⁿ\nx^(m/n) = ⁿ√(xᵐ)',
        explanation: 'En la multiplicación de bases iguales se suman los exponentes. En la división se restan. En potencia de potencia se multiplican.',
        example: 'x³ · x⁵ = x⁸\n(2y⁴)³ = 8y¹²\nx⁷ / x² = x⁵\n4⁻² = 1 / 4² = 1/16',
        tips: 'Si una potencia negativa está en el denominador, pasa al numerador como positiva: 1 / x⁻³ = x³.',
        caution: 'x² + x³ NO es x⁵. Solo se pueden sumar coeficientes si tienen idéntica parte literal (mismo exponente).'
      },
      {
        id: 'binomio-al-cuadrado',
        title: 'Binomio al Cuadrado (Producto Notable)',
        category: 'Productos Notables',
        formula: '(a + b)² = a² + 2ab + b²\n(a - b)² = a² - 2ab + b²',
        explanation: 'El cuadrado del primer término, más (o menos) el doble producto del primero por el segundo, más el cuadrado del segundo término.',
        example: '(3x + 5)² = (3x)² + 2(3x)(5) + 5² = 9x² + 30x + 25\n(2x - 4)² = 4x² - 16x + 16',
        tips: 'Nunca olvides el término central (doble producto 2ab).',
        caution: '(a + b)² NUNCA es a² + b². Es uno de los errores algebraicos más comunes del mundo.'
      },
      {
        id: 'binomios-conjugados',
        title: 'Diferencia de Cuadrados (Binomios Conjugados)',
        category: 'Factorización',
        formula: '(a + b)(a - b) = a² - b²',
        explanation: 'El producto de la suma por la diferencia de dos términos es igual a la diferencia de sus cuadrados.',
        example: '(x + 7)(x - 7) = x² - 49\n4x² - 25 = (2x + 5)(2x - 5)',
        tips: 'Muy útil para racionalizar denominadores y factorizar rápidamente.',
        caution: 'a² + b² (suma de cuadrados) no se factoriza en los números reales.'
      },
      {
        id: 'factor-comun',
        title: 'Factorización por Factor Común',
        category: 'Factorización',
        formula: 'ax + ay = a(x + y)',
        explanation: 'Se extrae el máximo común divisor numérico y las variables con su menor exponente que se repitan en todos los términos.',
        example: '6x³ - 9x² = 3x²(2x - 3)\n12a²b + 8ab² = 4ab(3a + 2b)',
        tips: 'Para verificar si factorizaste bien, multiplica el resultado y debes obtener la expresión original.',
        caution: 'No dejes factores comunes sin extraer. Siempre busca el M.C.D. más alto.'
      }
    ],
    exercises: [
      {
        id: 'alg-1',
        moduleId: 'algebra-basica',
        level: 1,
        levelName: 'Nivel 1: Términos Semejantes y Leyes de Potencias',
        question: 'Simplifica al máximo la siguiente expresión algebraica:',
        mathExpression: '5x²y - 3xy + 4x²y + 8xy - 7',
        options: [
          { id: 'a', text: '9x²y + 5xy - 7', isCorrect: true },
          { id: 'b', text: '9x⁴y² + 5x²y² - 7', isCorrect: false },
          { id: 'c', text: '14x²y - 7', isCorrect: false },
          { id: 'd', text: '9x²y - 5xy + 7', isCorrect: false }
        ],
        solutionExplanation: 'Agrupamos términos semejantes: (5x²y + 4x²y) = 9x²y. Luego (-3xy + 8xy) = +5xy. El término constante es -7. Resultado: 9x²y + 5xy - 7.',
        steps: [
          'Paso 1: Identificar semejantes con x²y → 5x²y + 4x²y = 9x²y',
          'Paso 2: Identificar semejantes con xy → -3xy + 8xy = +5xy',
          'Paso 3: Juntar con la constante -7 → 9x²y + 5xy - 7'
        ],
        hint: 'Solo suma los coeficientes de los términos que tienen exactamente las mismas variables y exponentes.',
        xpReward: 25
      },
      {
        id: 'alg-2',
        moduleId: 'algebra-basica',
        level: 1,
        levelName: 'Nivel 1: Potencia de Potencia',
        question: 'Aplica leyes de exponentes para simplificar:',
        mathExpression: '[ (2x³ y²)³ ] / [ 4x⁴ y ]',
        options: [
          { id: 'a', text: '2x⁵y⁵', isCorrect: true },
          { id: 'b', text: '2x⁴y⁴', isCorrect: false },
          { id: 'c', text: '6x⁵y⁵', isCorrect: false },
          { id: 'd', text: 'x⁵y⁵ / 2', isCorrect: false }
        ],
        solutionExplanation: '(2x³y²)³ = 2³ · (x³)³ · (y²)³ = 8x⁹y⁶. Al dividir entre 4x⁴y: (8/4) = 2, x⁹/x⁴ = x⁵, y⁶/y¹ = y⁵. Resultado: 2x⁵y⁵.',
        steps: [
          'Paso 1: Elevar al cubo el numerador: 2³=8, (x³)³=x⁹, (y²)³=y⁶ → 8x⁹y⁶',
          'Paso 2: Dividir coeficientes numéricos: 8 ÷ 4 = 2',
          'Paso 3: Restar exponentes de x: 9 - 4 = 5 → x⁵',
          'Paso 4: Restar exponentes de y: 6 - 1 = 5 → y⁵',
          'Paso 5: Resultado: 2x⁵y⁵'
        ],
        hint: 'Eleva el coeficiente 2 al cubo y multiplica los exponentes de las variables.',
        xpReward: 30
      },
      {
        id: 'alg-3',
        moduleId: 'algebra-basica',
        level: 2,
        levelName: 'Nivel 2: Productos Notables',
        question: 'Desarrolla el binomio al cuadrado:',
        mathExpression: '(3x - 4y)²',
        options: [
          { id: 'a', text: '9x² - 24xy + 16y²', isCorrect: true },
          { id: 'b', text: '9x² - 16y²', isCorrect: false },
          { id: 'c', text: '9x² + 24xy + 16y²', isCorrect: false },
          { id: 'd', text: '9x² - 12xy + 16y²', isCorrect: false }
        ],
        solutionExplanation: '(a - b)² = a² - 2ab + b². Con a=3x y b=4y: (3x)² - 2(3x)(4y) + (4y)² = 9x² - 24xy + 16y².',
        steps: [
          'Paso 1: Primer término al cuadrado → (3x)² = 9x²',
          'Paso 2: Doble producto → -2 · (3x) · (4y) = -24xy',
          'Paso 3: Segundo término al cuadrado → (4y)² = +16y²',
          'Paso 4: Unir términos → 9x² - 24xy + 16y²'
        ],
        hint: 'El término del medio es 2 veces el primero por el segundo.',
        xpReward: 40
      },
      {
        id: 'alg-4',
        moduleId: 'algebra-basica',
        level: 3,
        levelName: 'Nivel 3: Reto ADN de Factorización',
        question: 'Factoriza completamente la expresión cuadrática:',
        mathExpression: 'x² - 7x + 12',
        options: [
          { id: 'a', text: '(x - 3)(x - 4)', isCorrect: true },
          { id: 'b', text: '(x - 2)(x - 6)', isCorrect: false },
          { id: 'c', text: '(x + 3)(x + 4)', isCorrect: false },
          { id: 'd', text: '(x - 1)(x - 12)', isCorrect: false }
        ],
        solutionExplanation: 'Buscamos dos números que multiplicados den +12 y sumados den -7. Dichos números son -3 y -4: (-3)(-4) = +12 y (-3) + (-4) = -7. Por tanto (x - 3)(x - 4).',
        steps: [
          'Paso 1: Forma (x + p)(x + q)',
          'Paso 2: p · q = 12',
          'Paso 3: p + q = -7',
          'Paso 4: Números: -3 y -4',
          'Paso 5: Factorización: (x - 3)(x - 4)'
        ],
        hint: 'Como el producto es positivo (+12) y la suma es negativa (-7), ambos números deben ser negativos.',
        xpReward: 60
      }
    ]
  },

  // 3. FRACCIONES
  {
    id: 'fracciones',
    title: 'Fracciones',
    subtitle: 'Operaciones, MCM y Simplificación',
    description: 'Suma, resta con distinto denominador, multiplicación directa, división (método del sándwich/recíproco) y conversión de números mixtos.',
    iconName: 'Divide',
    accentColor: 'cyan',
    glowColor: '#06b6d4',
    tag: 'Operaciones 03',
    totalLevels: 3,
    introVideoId: '',
    introVideoTitle: 'Fracciones: Operaciones, MCM y Simplificación',
    formulas: [
      {
        id: 'suma-resta-frac',
        title: 'Suma y Resta (Método Mariposa / MCM)',
        category: 'Operaciones',
        formula: '(a/b) ± (c/d) = (a·d ± b·c) / (b·d)',
        explanation: 'Para sumar o restar fracciones con distinto denominador, se busca un denominador común multiplicando en cruz o usando el Mínimo Común Múltiplo (MCM).',
        example: '2/3 + 1/4 = (2·4 + 3·1) / (3·4) = (8 + 3) / 12 = 11/12\n5/6 - 1/2 = (5 - 3) / 6 = 2/6 = 1/3',
        tips: 'Siempre simplifica la fracción resultante sacando mitad, tercera o quinta parte a ambos términos.',
        caution: 'NUNCA sumes directamente numeradores y denominadores: 1/2 + 1/3 ≠ 2/5.'
      },
      {
        id: 'multiplicacion-frac',
        title: 'Multiplicación Directa',
        category: 'Operaciones',
        formula: '(a/b) × (c/d) = (a·c) / (b·d)',
        explanation: 'La multiplicación de fracciones es directa: numerador por numerador, y denominador por denominador.',
        example: '3/4 × 5/7 = (3 × 5) / (4 × 7) = 15/28\n4/9 × 3/8 = 12/72 = 1/6 (simplificando entre 12)',
        tips: 'Es mucho más rápido simplificar antes de multiplicar: cancelar factores comunes en cruz.',
        caution: 'No confundir con la multiplicación en cruz que se usa en la división o en la regla mariposa.'
      },
      {
        id: 'division-frac',
        title: 'División de Fracciones (Ley del Sándwich / Inverso)',
        category: 'Operaciones',
        formula: '(a/b) ÷ (c/d) = (a/b) × (d/c) = (a·d) / (b·c)',
        explanation: 'Dividir entre una fracción es multiplicar por su inverso recíproco. Extremos por extremos (numerador) y medios por medios (denominador).',
        example: '(2/5) ÷ (3/4) = (2 × 4) / (5 × 3) = 8/15\n(3/7) / (6/7) = (3 × 7) / (7 × 6) = 21/42 = 1/2',
        tips: 'Ley de la oreja: extremos arriba, medios abajo.',
        caution: 'Asegúrate de invertir la segunda fracción, no la primera.'
      }
    ],
    exercises: [
      {
        id: 'fr-1',
        moduleId: 'fracciones',
        level: 1,
        levelName: 'Nivel 1: Suma y Resta Básica',
        question: 'Calcula y simplifica la suma de fracciones:',
        mathExpression: '3/4 + 2/5',
        options: [
          { id: 'a', text: '23/20', isCorrect: true },
          { id: 'b', text: '5/9', isCorrect: false },
          { id: 'c', text: '6/20', isCorrect: false },
          { id: 'd', text: '11/20', isCorrect: false }
        ],
        solutionExplanation: 'Denominador común = 4 × 5 = 20. Numerador: (3 × 5) + (4 × 2) = 15 + 8 = 23. Resultado: 23/20 (o 1 3/20).',
        steps: [
          'Paso 1: Multiplicar denominadores 4 × 5 = 20',
          'Paso 2: Productos cruzados: 3 × 5 = 15 y 2 × 4 = 8',
          'Paso 3: Sumar numeradores: 15 + 8 = 23',
          'Paso 4: Fracción final: 23/20'
        ],
        hint: 'Aplica el producto cruzado: (3·5 + 4·2) / 20.',
        xpReward: 25
      },
      {
        id: 'fr-2',
        moduleId: 'fracciones',
        level: 1,
        levelName: 'Nivel 1: Multiplicación y División',
        question: 'Resuelve la división de fracciones y reduce a su mínima expresión:',
        mathExpression: '(5/6) ÷ (10/9)',
        options: [
          { id: 'a', text: '3/4', isCorrect: true },
          { id: 'b', text: '25/27', isCorrect: false },
          { id: 'c', text: '50/54', isCorrect: false },
          { id: 'd', text: '4/3', isCorrect: false }
        ],
        solutionExplanation: '(5/6) ÷ (10/9) = (5/6) × (9/10) = (5 × 9) / (6 × 10) = 45/60. Dividiendo entre 15 arriba y abajo obtenemos 3/4.',
        steps: [
          'Paso 1: Multiplicar por el recíproco → (5/6) × (9/10)',
          'Paso 2: Multiplicar numerador: 5 × 9 = 45',
          'Paso 3: Multiplicar denominador: 6 × 10 = 60',
          'Paso 4: Simplificar 45/60 dividiendo entre 15 → 3/4'
        ],
        hint: 'Invierte 10/9 a 9/10 y multiplica directo.',
        xpReward: 25
      },
      {
        id: 'fr-3',
        moduleId: 'fracciones',
        level: 2,
        levelName: 'Nivel 2: Operaciones Combinadas',
        question: 'Calcula el valor de la siguiente operación combinada:',
        mathExpression: '(2/3 + 1/6) × (4/5)',
        options: [
          { id: 'a', text: '2/3', isCorrect: true },
          { id: 'b', text: '3/5', isCorrect: false },
          { id: 'c', text: '5/6', isCorrect: false },
          { id: 'd', text: '12/15', isCorrect: false }
        ],
        solutionExplanation: 'Paréntesis: 2/3 = 4/6 → 4/6 + 1/6 = 5/6. Luego multiplicación: (5/6) × (4/5) = 20/30 = 2/3.',
        steps: [
          'Paso 1: Convertir 2/3 a sextos: 4/6',
          'Paso 2: Sumar dentro del paréntesis: 4/6 + 1/6 = 5/6',
          'Paso 3: Multiplicar: (5/6) × (4/5) = 20/30',
          'Paso 4: Simplificar entre 10: 2/3'
        ],
        hint: 'Resuelve primero el paréntesis igualando denominadores a 6.',
        xpReward: 40
      },
      {
        id: 'fr-4',
        moduleId: 'fracciones',
        level: 3,
        levelName: 'Nivel 3: Fracción Compleja ADN',
        question: 'Simplifica la fracción compleja ("torre de fracciones"):',
        mathExpression: '[ 1 - 1/3 ] / [ 1/2 + 1/4 ]',
        options: [
          { id: 'a', text: '8/9', isCorrect: true },
          { id: 'b', text: '2/3', isCorrect: false },
          { id: 'c', text: '4/3', isCorrect: false },
          { id: 'd', text: '3/4', isCorrect: false }
        ],
        solutionExplanation: 'Numerador: 1 - 1/3 = 2/3. Denominador: 1/2 + 1/4 = 2/4 + 1/4 = 3/4. Fracción: (2/3) / (3/4) = (2 × 4) / (3 × 3) = 8/9.',
        steps: [
          'Paso 1: Numerador: 1 - 1/3 = 2/3',
          'Paso 2: Denominador: 2/4 + 1/4 = 3/4',
          'Paso 3: Ley del sándwich: (2/3) / (3/4)',
          'Paso 4: Extremos (2 × 4 = 8) / Medios (3 × 3 = 9) → 8/9'
        ],
        hint: 'Calcula por separado el numerador y el denominador antes de aplicar la ley del sándwich.',
        xpReward: 60
      }
    ]
  },

  // 4. ECUACIONES
  {
    id: 'ecuaciones',
    title: 'Ecuaciones',
    subtitle: 'Lineales, Cuadráticas y Sistemas 2x2',
    description: 'Aprende a despejar incógnitas en ecuaciones lineales de 1er grado, resolver sistemas 2x2 y dominar la fórmula general para ecuaciones cuadráticas.',
    iconName: 'Equal',
    accentColor: 'cyan',
    glowColor: '#06b6d4',
    tag: 'Resolución 04',
    totalLevels: 3,
    introVideoId: '',
    introVideoTitle: 'Ecuaciones: Lineales, Cuadráticas y Sistemas 2x2',
    formulas: [
      {
        id: 'despeje-lineal',
        title: 'Ecuación de 1er Grado (Lineal)',
        category: 'Lineales',
        formula: 'ax + b = c  →  x = (c - b) / a',
        explanation: 'Todo lo que suma pasa restando; lo que resta pasa sumando; lo que multiplica pasa dividiendo con su mismo signo.',
        example: '3x - 7 = 14\n3x = 14 + 7 = 21\nx = 21 / 3 = 7',
        tips: 'Agrupa todas las incógnitas (x) de un lado del igual y los números independientes del otro lado.',
        caution: 'Al pasar dividiendo un número negativo, conserva su signo: -2x = 8 → x = 8 / (-2) = -4.'
      },
      {
        id: 'formula-general',
        title: 'Fórmula General Cuadrática (Chicharronera)',
        category: 'Cuadráticas',
        formula: 'x = [ -b ± √(b² - 4ac) ] / (2a)',
        explanation: 'Permite encontrar las dos soluciones de cualquier ecuación de la forma ax² + bx + c = 0. El discriminante Δ = b² - 4ac indica el tipo de raíces (reales distintas si Δ > 0, raíz doble si Δ = 0, complejas si Δ < 0).',
        example: 'x² - 5x + 6 = 0  (a=1, b=-5, c=6)\nx = [ -(-5) ± √(25 - 4(1)(6)) ] / 2(1) = [ 5 ± √1 ] / 2\nx₁ = (5+1)/2 = 3,  x₂ = (5-1)/2 = 2',
        tips: 'Antes de aplicar la fórmula, asegúrate de que la ecuación esté igualada a 0.',
        caution: 'Cuidado con el signo en -b: si b es negativo, -b se convierte en positivo.'
      },
      {
        id: 'sistemas-2x2',
        title: 'Sistemas de Ecuaciones Lineales 2x2',
        category: 'Sistemas',
        formula: 'Métodos: Reducción (Suma/Resta), Sustitución, Igualación o Determinantes (Cramer).',
        explanation: 'En el método de reducción se multiplica una o ambas ecuaciones por números adecuados para eliminar una variable al sumarlas.',
        example: '1) 2x + y = 7\n2) x - y = 2\nSumando ambas: 3x = 9 → x = 3. Sustituyendo en (2): 3 - y = 2 → y = 1.',
        tips: 'Verifica tus soluciones sustituyendo x e y en ambas ecuaciones originales.',
        caution: 'Si obtienes 0 = 0 hay infinitas soluciones; si obtienes 0 = k (k≠0) no tiene solución.'
      }
    ],
    exercises: [
      {
        id: 'ec-1',
        moduleId: 'ecuaciones',
        level: 1,
        levelName: 'Nivel 1: Ecuaciones Lineales',
        question: 'Encuentra el valor de x que satisface la igualdad:',
        mathExpression: '4x - 9 = 2x + 7',
        options: [
          { id: 'a', text: 'x = 8', isCorrect: true },
          { id: 'b', text: 'x = 4', isCorrect: false },
          { id: 'c', text: 'x = -8', isCorrect: false },
          { id: 'd', text: 'x = 16', isCorrect: false }
        ],
        solutionExplanation: '4x - 2x = 7 + 9 → 2x = 16 → x = 16 / 2 = 8.',
        steps: [
          'Paso 1: Mover 2x a la izquierda: 4x - 2x = 2x',
          'Paso 2: Mover -9 a la derecha: 7 + 9 = 16',
          'Paso 3: Queda 2x = 16',
          'Paso 4: Despejar x: x = 16 / 2 = 8'
        ],
        hint: 'Pasa las "x" a un lado y los números al otro cambiando sus signos.',
        xpReward: 25
      },
      {
        id: 'ec-2',
        moduleId: 'ecuaciones',
        level: 2,
        levelName: 'Nivel 2: Sistema de Ecuaciones 2x2',
        question: 'Resuelve el sistema y determina el valor de x e y:',
        mathExpression: 'Sistema:  3x + 2y = 13   y   x - y = 1',
        options: [
          { id: 'a', text: 'x = 3, y = 2', isCorrect: true },
          { id: 'b', text: 'x = 4, y = 3', isCorrect: false },
          { id: 'c', text: 'x = 5, y = -1', isCorrect: false },
          { id: 'd', text: 'x = 2, y = 3', isCorrect: false }
        ],
        solutionExplanation: 'De la 2ª ecuación: x = y + 1. Sustituyendo en la 1ª: 3(y + 1) + 2y = 13 → 3y + 3 + 2y = 13 → 5y = 10 → y = 2. Por tanto x = 2 + 1 = 3.',
        steps: [
          'Paso 1: Despejar x en la 2da ecuación: x = y + 1',
          'Paso 2: Sustituir en la 1ra: 3(y + 1) + 2y = 13',
          'Paso 3: 3y + 3 + 2y = 13 → 5y + 3 = 13 → 5y = 10 → y = 2',
          'Paso 4: Calcular x: x = 2 + 1 = 3'
        ],
        hint: 'Despeja x de la segunda ecuación (x = y + 1) y sustitúyela en la primera.',
        xpReward: 40
      },
      {
        id: 'ec-3',
        moduleId: 'ecuaciones',
        level: 3,
        levelName: 'Nivel 3: Ecuación Cuadrática Completa',
        question: 'Encuentra las raíces de la ecuación cuadrática:',
        mathExpression: '2x² - 7x + 3 = 0',
        options: [
          { id: 'a', text: 'x₁ = 3,  x₂ = 1/2', isCorrect: true },
          { id: 'b', text: 'x₁ = -3,  x₂ = -1/2', isCorrect: false },
          { id: 'c', text: 'x₁ = 7,  x₂ = 2', isCorrect: false },
          { id: 'd', text: 'x₁ = 1,  x₂ = 3/2', isCorrect: false }
        ],
        solutionExplanation: 'a=2, b=-7, c=3. Discriminante: (-7)² - 4(2)(3) = 49 - 24 = 25. √25 = 5. x = (7 ± 5) / (2·2) = (7 ± 5)/4. x₁ = 12/4 = 3, x₂ = 2/4 = 1/2.',
        steps: [
          'Paso 1: Coeficientes a=2, b=-7, c=3',
          'Paso 2: Discriminante Δ = (-7)² - 4(2)(3) = 49 - 24 = 25',
          'Paso 3: Raíz de Δ = √25 = 5',
          'Paso 4: x = (7 ± 5) / 4',
          'Paso 5: x₁ = 12/4 = 3;  x₂ = 2/4 = 1/2'
        ],
        hint: 'Aplica la fórmula general: x = (-b ± √(b² - 4ac)) / (2a).',
        xpReward: 60
      }
    ]
  },

  // 5. GEOMETRÍA ANALÍTICA
  {
    id: 'geometria-analitica',
    title: 'Geometría Analítica',
    subtitle: 'Plano Cartesiano, Rectas y Cónicas',
    description: 'Estudia la distancia entre dos puntos, cálculo de pendientes, ecuaciones de la recta (punto-pendiente, pendiente-ordenada) y circunferencia.',
    iconName: 'Compass',
    accentColor: 'cyan',
    glowColor: '#06b6d4',
    tag: 'Plano 05',
    totalLevels: 3,
    introVideoId: '',
    introVideoTitle: 'Geometría Analítica: Plano Cartesiano, Rectas y Cónicas',
    formulas: [
      {
        id: 'distancia-dos-puntos',
        title: 'Distancia entre Dos Puntos',
        category: 'Puntos y Coordenadas',
        formula: 'd = √[ (x₂ - x₁)² + (y₂ - y₁)² ]',
        explanation: 'Basada directamente en el Teorema de Pitágoras aplicado en el plano cartesiano.',
        example: 'Calcular distancia entre A(1, 2) y B(4, 6):\nd = √((4 - 1)² + (6 - 2)²) = √(3² + 4²) = √(9 + 16) = √25 = 5',
        tips: 'No importa cuál punto elijas como (x₁, y₁) o (x₂, y₂), el resultado es idéntico porque las diferencias se elevan al cuadrado.',
        caution: 'Cuidado con signos negativos en las coordenadas: (3 - (-2)) = 3 + 2 = 5.'
      },
      {
        id: 'pendiente-recta',
        title: 'Pendiente de una Recta (m)',
        category: 'Rectas',
        formula: 'm = (y₂ - y₁) / (x₂ - x₁) = tan(θ)',
        explanation: 'Mide la inclinación de una recta respecto al eje horizontal. m > 0 (creciente), m < 0 (decreciente), m = 0 (horizontal), m indefinida (vertical).',
        example: 'Puntos (2, 3) y (6, 11):\nm = (11 - 3) / (6 - 2) = 8 / 4 = 2',
        tips: 'Rectas paralelas tienen pendientes iguales (m₁ = m₂). Rectas perpendiculares cumplen m₁ · m₂ = -1.',
        caution: 'El cambio en "y" siempre va arriba en el numerador, el cambio en "x" en el denominador.'
      },
      {
        id: 'ecuacion-punto-pendiente',
        title: 'Ecuación de la Recta (Punto-Pendiente)',
        category: 'Rectas',
        formula: 'y - y₁ = m(x - x₁)  →  y = mx + b',
        explanation: 'Conocidos un punto (x₁, y₁) y la pendiente m, podemos obtener la ecuación explícita y = mx + b donde b es la ordenada al origen.',
        example: 'Punto (1, 4) y m = 3:\ny - 4 = 3(x - 1) → y - 4 = 3x - 3 → y = 3x + 1',
        tips: 'La forma general es Ax + By + C = 0.',
        caution: 'Verifica sustituyendo el punto original en la ecuación final para comprobar igualdad.'
      },
      {
        id: 'ecuacion-circunferencia',
        title: 'Ecuación de la Circunferencia con Centro C(h, k)',
        category: 'Cónicas',
        formula: '(x - h)² + (y - k)² = r²',
        explanation: 'Ecuación ordinaria de una circunferencia con centro en (h, k) y radio r. Si el centro está en el origen (0,0), se reduce a x² + y² = r².',
        example: 'Centro C(3, -2) y radio r = 4:\n(x - 3)² + (y - (-2))² = 4² → (x - 3)² + (y + 2)² = 16',
        tips: 'Recuerda que el lado derecho es r², no r.',
        caution: 'Si te dan el diámetro, divídelo entre 2 para obtener el radio antes de elevarlo al cuadrado.'
      }
    ],
    exercises: [
      {
        id: 'ga-1',
        moduleId: 'geometria-analitica',
        level: 1,
        levelName: 'Nivel 1: Distancia entre Puntos',
        question: 'Calcula la distancia exacta entre los puntos P(2, -1) y Q(6, 2):',
        mathExpression: 'P(2, -1)   y   Q(6, 2)',
        options: [
          { id: 'a', text: 'd = 5', isCorrect: true },
          { id: 'b', text: 'd = 7', isCorrect: false },
          { id: 'c', text: 'd = √17', isCorrect: false },
          { id: 'd', text: 'd = 25', isCorrect: false }
        ],
        solutionExplanation: 'd = √((6 - 2)² + (2 - (-1))²) = √(4² + 3²) = √(16 + 9) = √25 = 5.',
        steps: [
          'Paso 1: Δx = 6 - 2 = 4 → 4² = 16',
          'Paso 2: Δy = 2 - (-1) = 3 → 3² = 9',
          'Paso 3: Suma de cuadrados: 16 + 9 = 25',
          'Paso 4: Raíz cuadrada: √25 = 5'
        ],
        hint: 'Aplica d = √((x₂ - x₁)² + (y₂ - y₁)²). Nota que 2 - (-1) = 3.',
        xpReward: 25
      },
      {
        id: 'ga-2',
        moduleId: 'geometria-analitica',
        level: 2,
        levelName: 'Nivel 2: Pendiente y Recta',
        question: 'Encuentra la ecuación de la recta que pasa por el punto (3, 5) con pendiente m = -2:',
        mathExpression: 'P(3, 5),   m = -2',
        options: [
          { id: 'a', text: 'y = -2x + 11', isCorrect: true },
          { id: 'b', text: 'y = -2x - 1', isCorrect: false },
          { id: 'c', text: 'y = 2x - 1', isCorrect: false },
          { id: 'd', text: 'y = -2x + 5', isCorrect: false }
        ],
        solutionExplanation: 'y - 5 = -2(x - 3) → y - 5 = -2x + 6 → y = -2x + 6 + 5 → y = -2x + 11.',
        steps: [
          'Paso 1: Fórmula punto-pendiente: y - y₁ = m(x - x₁)',
          'Paso 2: Sustituir datos: y - 5 = -2(x - 3)',
          'Paso 3: Distribuir: y - 5 = -2x + 6',
          'Paso 4: Despejar y: y = -2x + 11'
        ],
        hint: 'Aplica la fórmula y - y₁ = m(x - x₁) y despeja y.',
        xpReward: 40
      },
      {
        id: 'ga-3',
        moduleId: 'geometria-analitica',
        level: 3,
        levelName: 'Nivel 3: Circunferencia y Perpendicularidad',
        question: '¿Cuál es el centro y radio de la circunferencia dada por la ecuación (x + 4)² + (y - 1)² = 49?',
        mathExpression: '(x + 4)² + (y - 1)² = 49',
        options: [
          { id: 'a', text: 'Centro (-4, 1), Radio = 7', isCorrect: true },
          { id: 'b', text: 'Centro (4, -1), Radio = 49', isCorrect: false },
          { id: 'c', text: 'Centro (-4, 1), Radio = 49', isCorrect: false },
          { id: 'd', text: 'Centro (4, 1), Radio = 7', isCorrect: false }
        ],
        solutionExplanation: 'Comparando con (x - h)² + (y - k)² = r²: x - h = x + 4 → h = -4. y - k = y - 1 → k = 1. r² = 49 → r = √49 = 7. Centro C(-4, 1), radio = 7.',
        steps: [
          'Paso 1: Comparar con (x - h)² + (y - k)² = r²',
          'Paso 2: -h = 4 → h = -4',
          'Paso 3: -k = -1 → k = 1',
          'Paso 4: r² = 49 → r = 7',
          'Paso 5: Centro (-4, 1) y radio 7'
        ],
        hint: 'Los signos de las coordenadas del centro se invierten respecto a la ecuación ordinaria.',
        xpReward: 60
      }
    ]
  },

  // 6. TRIGONOMETRÍA
  {
    id: 'trigonometria',
    title: 'Trigonometría',
    subtitle: 'Razones, Pitágoras e Identidades',
    description: 'Comprende el Teorema de Pitágoras, razones trigonométricas (SOH-CAH-TOA), identidades pitagóricas y ángulos notables.',
    iconName: 'Triangle',
    accentColor: 'cyan',
    glowColor: '#06b6d4',
    tag: 'Ángulos 06',
    totalLevels: 3,
    introVideoId: '',
    introVideoTitle: 'Trigonometría: Razones, Pitágoras e Identidades',
    formulas: [
      {
        id: 'teorema-pitagoras',
        title: 'Teorema de Pitágoras',
        category: 'Triángulos Rectángulos',
        formula: 'c² = a² + b²  →  c = √(a² + b²)',
        explanation: 'En todo triángulo rectángulo, el cuadrado de la hipotenusa (c) es igual a la suma de los cuadrados de los catetos (a y b).',
        example: 'Catetos a = 6, b = 8:\nc = √(6² + 8²) = √(36 + 64) = √100 = 10',
        tips: 'Ternas pitagóricas comunes: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25).',
        caution: 'Solo es válido para triángulos rectángulos (ángulo de 90°).'
      },
      {
        id: 'razones-trig',
        title: 'Razones Trigonométricas (SOH-CAH-TOA)',
        category: 'Razones',
        formula: 'sen(θ) = Cateto Opuesto / Hipotenusa\ncos(θ) = Cateto Adyacente / Hipotenusa\ntan(θ) = Cateto Opuesto / Cateto Adyacente',
        explanation: 'Relaciones fundamentales entre los lados de un triángulo rectángulo respecto a uno de sus ángulos agudos.',
        example: 'Si Cateto Opuesto = 3, Cateto Adyacente = 4, Hipotenusa = 5:\nsen(θ) = 3/5 = 0.6\ncos(θ) = 4/5 = 0.8\ntan(θ) = 3/4 = 0.75',
        tips: 'Mnemotecnia: SOH - CAH - TOA (Seno: Op/Hip, Coseno: Ady/Hip, Tangente: Op/Ady).',
        caution: 'Identifica correctamente cuál es el cateto opuesto mirando directamente enfrente del ángulo de interés.'
      },
      {
        id: 'identidad-pitagorica',
        title: 'Identidad Fundamental Pitagórica',
        category: 'Identidades',
        formula: 'sen²(θ) + cos²(θ) = 1',
        explanation: 'Válida para cualquier ángulo θ en el círculo unitario.',
        example: 'Si sen(θ) = 3/5: cos²(θ) = 1 - (3/5)² = 1 - 9/25 = 16/25 → cos(θ) = 4/5.',
        tips: 'Derivadas: 1 + tan²(θ) = sec²(θ)  y  1 + cot²(θ) = csc²(θ).',
        caution: 'No confundir sen²(θ) con sen(θ²).'
      }
    ],
    exercises: [
      {
        id: 'tr-1',
        moduleId: 'trigonometria',
        level: 1,
        levelName: 'Nivel 1: Pitágoras y Razones',
        question: 'En un triángulo rectángulo, los catetos miden a = 5 cm y b = 12 cm. ¿Cuánto mide la hipotenusa?',
        mathExpression: 'a = 5,   b = 12,   c = ?',
        options: [
          { id: 'a', text: 'c = 13 cm', isCorrect: true },
          { id: 'b', text: 'c = 17 cm', isCorrect: false },
          { id: 'c', text: 'c = 14 cm', isCorrect: false },
          { id: 'd', text: 'c = √119 cm', isCorrect: false }
        ],
        solutionExplanation: 'c = √(5² + 12²) = √(25 + 144) = √169 = 13 cm.',
        steps: [
          'Paso 1: 5² = 25',
          'Paso 2: 12² = 144',
          'Paso 3: Suma = 25 + 144 = 169',
          'Paso 4: Raíz cuadrada √169 = 13'
        ],
        hint: 'Aplica c = √(a² + b²).',
        xpReward: 25
      },
      {
        id: 'tr-2',
        moduleId: 'trigonometria',
        level: 2,
        levelName: 'Nivel 2: Razones Trigonométricas',
        question: 'Si en un triángulo rectángulo el cateto opuesto al ángulo α mide 8 y el cateto adyacente mide 6, ¿cuál es el valor de sen(α)?',
        mathExpression: 'Cateto Opuesto = 8,   Cateto Adyacente = 6',
        options: [
          { id: 'a', text: 'sen(α) = 4/5 (0.8)', isCorrect: true },
          { id: 'b', text: 'sen(α) = 3/5 (0.6)', isCorrect: false },
          { id: 'c', text: 'sen(α) = 4/3 (1.33)', isCorrect: false },
          { id: 'd', text: 'sen(α) = 8/6', isCorrect: false }
        ],
        solutionExplanation: 'Primero calculamos la hipotenusa: h = √(8² + 6²) = √(64 + 36) = √100 = 10. Luego sen(α) = Cateto Opuesto / Hipotenusa = 8 / 10 = 4/5 = 0.8.',
        steps: [
          'Paso 1: Hipotenusa = √(8² + 6²) = √100 = 10',
          'Paso 2: sen(α) = Cateto Opuesto / Hipotenusa',
          'Paso 3: sen(α) = 8 / 10 = 4/5 (0.8)'
        ],
        hint: 'Halla primero la hipotenusa con Pitágoras y luego calcula Cateto Opuesto / Hipotenusa.',
        xpReward: 40
      },
      {
        id: 'tr-3',
        moduleId: 'trigonometria',
        level: 3,
        levelName: 'Nivel 3: Reto de Identidades Trigonométricas',
        question: 'Simplifica al máximo la expresión trigonométrica:',
        mathExpression: '(tan(x) · cos(x)) / sen(x)',
        options: [
          { id: 'a', text: '1', isCorrect: true },
          { id: 'b', text: 'tan(x)', isCorrect: false },
          { id: 'c', text: 'cos²(x)', isCorrect: false },
          { id: 'd', text: 'sec(x)', isCorrect: false }
        ],
        solutionExplanation: 'tan(x) = sen(x) / cos(x). Por tanto: [ (sen(x) / cos(x)) · cos(x) ] / sen(x) = sen(x) / sen(x) = 1.',
        steps: [
          'Paso 1: Reemplazar tan(x) = sen(x) / cos(x)',
          'Paso 2: Multiplicar por cos(x) → queda sen(x)',
          'Paso 3: Dividir entre el denominador sen(x)',
          'Paso 4: sen(x) / sen(x) = 1'
        ],
        hint: 'Recuerda que la tangente es igual a Seno dividido entre Coseno.',
        xpReward: 60
      }
    ]
  },

  // 7. CÁLCULO
  {
    id: 'calculo',
    title: 'Cálculo',
    subtitle: 'Límites, Derivadas e Integrales',
    description: 'Domina los conceptos de límites, regla de la potencia para derivadas, regla de la cadena e integrales inmediatas fundamentales.',
    iconName: 'Infinity',
    accentColor: 'cyan',
    glowColor: '#06b6d4',
    tag: 'Avanzado 07',
    totalLevels: 3,
    introVideoId: '',
    introVideoTitle: 'Cálculo Diferencial: Límites, Derivadas e Integrales',
    formulas: [
      {
        id: 'regla-potencia-derivada',
        title: 'Regla de la Potencia (Derivada)',
        category: 'Derivadas',
        formula: 'd/dx [ xⁿ ] = n · xⁿ⁻¹\nd/dx [ c · xⁿ ] = c · n · xⁿ⁻¹',
        explanation: 'Se baja el exponente como factor multiplicando el coeficiente y se le resta 1 al exponente.',
        example: 'd/dx [ x⁵ ] = 5x⁴\nd/dx [ 4x³ ] = 4 · 3x² = 12x²\nd/dx [ 7x ] = 7\nd/dx [ 9 ] = 0 (la derivada de una constante es cero)',
        tips: 'Para raíces, conviértelas a exponente fraccionario primero: √x = x^(1/2) → derivada = (1/2)x^(-1/2) = 1 / (2√x).',
        caution: 'La derivada de una constante sola (sin variable) siempre es 0.'
      },
      {
        id: 'limites-indeterminados',
        title: 'Límites y Factorización 0/0',
        category: 'Límites',
        formula: 'lím (x → a) [ f(x) / g(x) ] = [ 0/0 ]  →  Factorizar y cancelar término',
        explanation: 'Si al evaluar directamente obtienes la forma indeterminada 0/0, factoriza el numerador y/o denominador para cancelar el factor que provoca la indeterminación.',
        example: 'lím (x → 2) [ (x² - 4) / (x - 2) ]\nEvaluación directa = (4-4)/(2-2) = 0/0 (indeterminado)\nFactorizando: (x - 2)(x + 2) / (x - 2) = x + 2\nEvaluando: 2 + 2 = 4.',
        tips: 'También puedes aplicar la regla de L\'Hôpital derivando numerador y denominador si conoces derivadas.',
        caution: '0/0 no significa que el límite no exista o sea 0; significa que se debe hacer álgebra previa.'
      },
      {
        id: 'integral-potencia',
        title: 'Integral Indefinida de una Potencia',
        category: 'Integrales',
        formula: '∫ xⁿ dx = (xⁿ⁺¹ / (n + 1)) + C   (con n ≠ -1)',
        explanation: 'Es el proceso inverso a la derivación. Se suma 1 al exponente y se divide entre el nuevo exponente, añadiendo la constante de integración C.',
        example: '∫ 3x² dx = 3 · (x³ / 3) + C = x³ + C\n∫ x⁴ dx = (x⁵ / 5) + C',
        tips: 'Si n = -1, la integral es: ∫ (1/x) dx = ln|x| + C.',
        caution: 'No olvides jamás añadir la constante "+ C" en integrales indefinidas.'
      }
    ],
    exercises: [
      {
        id: 'calc-1',
        moduleId: 'calculo',
        level: 1,
        levelName: 'Nivel 1: Derivadas por Regla de la Potencia',
        question: 'Encuentra la derivada f\'(x) de la función:',
        mathExpression: 'f(x) = 3x⁴ - 5x² + 8x - 12',
        options: [
          { id: 'a', text: "f'(x) = 12x³ - 10x + 8", isCorrect: true },
          { id: 'b', text: "f'(x) = 12x⁴ - 10x² + 8x", isCorrect: false },
          { id: 'c', text: "f'(x) = 7x³ - 7x + 8", isCorrect: false },
          { id: 'd', text: "f'(x) = 12x³ - 10x", isCorrect: false }
        ],
        solutionExplanation: "d/dx(3x⁴) = 12x³, d/dx(-5x²) = -10x, d/dx(8x) = 8, d/dx(-12) = 0. Por tanto f'(x) = 12x³ - 10x + 8.",
        steps: [
          'Paso 1: d/dx(3x⁴) = 3 · 4x³ = 12x³',
          'Paso 2: d/dx(-5x²) = -5 · 2x¹ = -10x',
          'Paso 3: d/dx(8x) = 8 · 1 = 8',
          'Paso 4: d/dx(-12) = 0 (constante)',
          'Paso 5: Resultado: 12x³ - 10x + 8'
        ],
        hint: 'Multiplica cada coeficiente por su exponente y réstale 1 al exponente. La derivada de una constante es 0.',
        xpReward: 30
      },
      {
        id: 'calc-2',
        moduleId: 'calculo',
        level: 2,
        levelName: 'Nivel 2: Límites Indeterminados',
        question: 'Calcula el siguiente límite algebraico:',
        mathExpression: 'lím (x → 3) [ (x² - 9) / (x - 3) ]',
        options: [
          { id: 'a', text: '6', isCorrect: true },
          { id: 'b', text: '0', isCorrect: false },
          { id: 'c', text: '3', isCorrect: false },
          { id: 'd', text: 'No existe (indeterminado)', isCorrect: false }
        ],
        solutionExplanation: 'Al evaluar x=3 queda 0/0. Factorizamos la diferencia de cuadrados en el numerador: (x - 3)(x + 3) / (x - 3) = x + 3. Evaluando x = 3: 3 + 3 = 6.',
        steps: [
          'Paso 1: Evaluación directa da 0/0 (indeterminación)',
          'Paso 2: Factorizar numerador: (x - 3)(x + 3)',
          'Paso 3: Cancelar factor común (x - 3)',
          'Paso 4: Queda x + 3 → evaluar en x = 3: 3 + 3 = 6'
        ],
        hint: 'Factoriza x² - 9 como una diferencia de cuadrados (x - 3)(x + 3).',
        xpReward: 45
      },
      {
        id: 'calc-3',
        moduleId: 'calculo',
        level: 3,
        levelName: 'Nivel 3: Integral Indefinida ADN',
        question: 'Calcula la integral indefinida:',
        mathExpression: '∫ (6x² + 4x - 5) dx',
        options: [
          { id: 'a', text: '2x³ + 2x² - 5x + C', isCorrect: true },
          { id: 'b', text: '6x³ + 4x² - 5x + C', isCorrect: false },
          { id: 'c', text: '12x + 4 + C', isCorrect: false },
          { id: 'd', text: '3x³ + 2x² - 5 + C', isCorrect: false }
        ],
        solutionExplanation: '∫ 6x² dx = 6(x³/3) = 2x³. ∫ 4x dx = 4(x²/2) = 2x². ∫ -5 dx = -5x. Añadimos constante + C → 2x³ + 2x² - 5x + C.',
        steps: [
          'Paso 1: ∫ 6x² dx = 6(x³/3) = 2x³',
          'Paso 2: ∫ 4x dx = 4(x²/2) = 2x²',
          'Paso 3: ∫ -5 dx = -5x',
          'Paso 4: Sumar la constante de integración: + C',
          'Paso 5: 2x³ + 2x² - 5x + C'
        ],
        hint: 'Suma 1 a cada exponente y divide entre el nuevo exponente. No olvides la constante + C.',
        xpReward: 60
      }
    ]
  }
];
