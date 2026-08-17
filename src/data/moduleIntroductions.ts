/**
 * Introducciones Didácticas Habladas por Sección para CBTIS 55 MATH
 * Redactadas con calidez pedagógica, claridad conceptual y enfoque socrático.
 */

export interface SectionIntro {
  id: string;
  title: string;
  shortSummary: string;
  spokenScript: string;
  quickQuestions: { label: string; text: string }[];
}

export const MODULE_INTRODUCTIONS: Record<string, SectionIntro> = {
  'base-cero': {
    id: 'base-cero',
    title: 'Fundamentos Aritméticos: Jerarquía y Signos',
    shortSummary: 'Jerarquía de operaciones (PEMDAS), leyes de signos y potencias elementales.',
    spokenScript: '¡Hola! Te doy la bienvenida al módulo de Fundamentos Aritméticos de CBTIS 55. Aquí fortaleceremos tus cimientos matemáticos más importantes: dominarás la jerarquía de operaciones PEMDAS, las leyes de signos para suma, resta, multiplicación y división, y los números enteros. Si necesitas orientación o una pista durante tu práctica, pregúntame por voz o texto.',
    quickQuestions: [
      { label: '➕ Jerarquía PEMDAS', text: '¿Cómo funciona la jerarquía de operaciones cuando hay paréntesis y signos negativos?' },
      { label: '✨ Regla de los signos', text: 'Explícame la regla de los signos en multiplicación y división de manera intuitiva.' },
      { label: '⏱️ Agilidad en cálculo mental', text: '¿Cómo puedo agilizar mi cálculo mental en operaciones con números enteros negativos y positivos?' }
    ]
  },

  'algebra-basica': {
    id: 'algebra-basica',
    title: 'Álgebra Básica',
    shortSummary: 'Leyes de exponentes, términos semejantes, productos notables y factorización.',
    spokenScript: '¡Hola! Estás en el módulo de Álgebra Básica. En este espacio aprenderás a simplificar expresiones algebraicas, aplicar las leyes de los exponentes, desarrollar productos notables y dominar la factorización. El álgebra es el lenguaje universal que te permitirá resolver cualquier incógnita. ¡Comencemos!',
    quickQuestions: [
      { label: '📐 Leyes de los exponentes', text: '¿Por qué cuando se multiplican potencias de la misma base los exponentes se suman? Explícamelo con un ejemplo.' },
      { label: '🧩 Pasos para factorizar', text: '¿Cuáles son los pasos para factorizar un trinomio de la forma x al cuadrado más bx más c?' },
      { label: '✨ Regla de los signos', text: 'Explícame la regla de los signos en multiplicación y división de manera intuitiva.' }
    ]
  },

  'fracciones': {
    id: 'fracciones',
    title: 'Fracciones y Racionales',
    shortSummary: 'Operaciones heterogéneas, mínimo común múltiplo y simplificación.',
    spokenScript: '¡Hola! Te doy la bienvenida al módulo de Fracciones. Aquí resolverás sumas y restas heterogéneas encontrando el mínimo común múltiplo, así como multiplicaciones en línea recta y divisiones cruzadas. Recuerda siempre simplificar a su mínima expresión. ¿Tienes alguna duda?',
    quickQuestions: [
      { label: '🍕 Suma con diferente denominador', text: '¿Cómo encuentro el mínimo común múltiplo para sumar dos fracciones con diferente denominador?' },
      { label: '✖️ Multiplicación y división', text: '¿Cómo se multiplican y dividen las fracciones algebraicas paso a paso?' },
      { label: '🔍 Simplificación al máximo', text: '¿Cuál es el mejor método para simplificar una fracción grande rápidamente?' }
    ]
  },

  'ecuaciones': {
    id: 'ecuaciones',
    title: 'Ecuaciones y Sistemas',
    shortSummary: 'Despeje lineal, sistemas 2x2 y fórmula cuadrática general.',
    spokenScript: '¡Bienvenido a Ecuaciones y Sistemas! Aprenderás a despejar incógnitas aplicando operaciones inversas en ambos lados de la igualdad, resolver sistemas de ecuaciones dos por dos y aplicar la fórmula cuadrática general. Si te trabas en algún despeje, pídeme una pista.',
    quickQuestions: [
      { label: '⚖️ Regla de oro del despeje', text: '¿Cuál es la regla fundamental para despejar una incógnita sin cometer errores de signo?' },
      { label: '🎯 Fórmula cuadrática', text: '¿Cómo se utiliza la fórmula general para resolver una ecuación cuadrática y qué significa el discriminante?' },
      { label: '🔄 Método de eliminación 2x2', text: '¿Cómo funciona el método de suma y resta o reducción en sistemas de ecuaciones dos por dos?' }
    ]
  },

  'geometria-analitica': {
    id: 'geometria-analitica',
    title: 'Geometría Analítica',
    shortSummary: 'Distancia entre puntos, pendiente de la recta, ecuaciones lineales y cónicas.',
    spokenScript: '¡Hola! Estás en Geometría Analítica. En esta sección conectarás el álgebra con el plano cartesiano mediante el cálculo de distancia entre dos puntos, punto medio, pendiente de una recta y las diferentes formas de la ecuación lineal y la circunferencia. ¡Adelante con tu práctica!',
    quickQuestions: [
      { label: '📈 ¿Qué es la pendiente m?', text: '¿Qué representa geométricamente la pendiente m de una recta y cómo se calcula con dos puntos?' },
      { label: '📏 Distancia euclidiana', text: '¿Por qué la fórmula de la distancia entre dos puntos proviene del Teorema de Pitágoras?' },
      { label: '⭕ Ecuación de la circunferencia', text: '¿Cómo se determina la ecuación de una circunferencia con centro en el origen y fuera del origen?' }
    ]
  },

  'trigonometria': {
    id: 'trigonometria',
    title: 'Trigonometría y Triángulos',
    shortSummary: 'Teorema de Pitágoras, razones trigonométricas y leyes de senos y cosenos.',
    spokenScript: '¡Bienvenidos a Trigonometría! Analizaremos el Teorema de Pitágoras, las razones seno, coseno y tangente en triángulos rectángulos, el círculo unitario y la aplicación de las leyes de senos y cosenos para triángulos oblicuángulos. ¡Vamos a conquistar los triángulos!',
    quickQuestions: [
      { label: '📐 SOH CAH TOA nemotecnia', text: 'Explícame la regla nemotécnica SOH CAH TOA para recordar seno, coseno y tangente.' },
      { label: '⭕ Círculo unitario', text: '¿Cómo se relacionan las coordenadas x e y con el coseno y el seno en el círculo trigonométrico?' },
      { label: '🔺 Ley de Senos y Cosenos', text: '¿Cuándo debo usar la Ley de Senos y cuándo la Ley de Cosenos para resolver un triángulo?' }
    ]
  },

  'calculo': {
    id: 'calculo',
    title: 'Cálculo Diferencial',
    shortSummary: 'Límites, interpretación de la derivada, reglas de potencia y cadena.',
    spokenScript: '¡Hola! Te doy la bienvenida al módulo de Cálculo Diferencial. Descubrirás el poder de las derivadas como razones de cambio instantáneo y pendientes de rectas tangentes, aplicando la regla de la potencia, el producto, el cociente y la regla de la cadena. ¡Adelante!',
    quickQuestions: [
      { label: '🎯 Significado de la derivada', text: '¿Qué representa intuitivamente la derivada de una función en un punto específico?' },
      { label: '⚡ Regla de la potencia', text: 'Explícame la regla de la potencia para derivar x elevado a la n con un ejemplo.' },
      { label: '⛓️ Regla de la cadena', text: '¿Cuándo y cómo se aplica la regla de la cadena en funciones compuestas?' }
    ]
  },

  'tablas-multiplicar': {
    id: 'tablas-multiplicar',
    title: 'Gimnasio de Tablas de Multiplicar',
    shortSummary: 'Memorización activa con patrones visuales y trucos nemotécnicos.',
    spokenScript: '¡Bienvenido al Gimnasio de Tablas de Multiplicar del CBTIS 55! Aquí podrás explorar los patrones de cada tabla del 2 al 12 y poner a prueba tu velocidad de respuesta. ¡Domina las tablas para que el álgebra sea mucho más sencilla!',
    quickQuestions: [
      { label: '💡 Patrón de la tabla del 9', text: '¿Cuál es el truco con los dedos o la suma de dígitos para la tabla del 9?' },
      { label: '⚡ Velocidad de cálculo', text: '¿Cuál es la mejor técnica para responder multiplicaciones en menos de dos segundos?' }
    ]
  },

  'operaciones-basicas': {
    id: 'operaciones-basicas',
    title: 'Arena de Operaciones Básicas',
    shortSummary: 'Cálculo mental cronometrado en sumas, restas, multiplicaciones y divisiones.',
    spokenScript: '¡Estás en la Arena de Operaciones Básicas! Practica operaciones de dos y tres dígitos contra el cronómetro para elevar tu agilidad mental y desbloquear nuevas medallas. ¡Concéntrate y da tu mejor esfuerzo!',
    quickQuestions: [
      { label: '🧠 Descomposición mental', text: '¿Cómo puedo descomponer números mentalmente para sumar números de dos y tres dígitos sin lápiz?' },
      { label: '⏱️ Truco para restar rápido', text: '¿Cómo funciona el método de restar completando a la decena o centena más cercana?' }
    ]
  },

  'desafio-cronometrado': {
    id: 'desafio-cronometrado',
    title: 'Desafío Cronometrado ADN',
    shortSummary: 'Reto contra reloj en rondas de 60, 120 o 180 segundos.',
    spokenScript: '¡Bienvenido al Desafío Cronometrado ADN! Elige tu tiempo límite: 60, 120 o 180 segundos. Responde de forma consecutiva para multiplicar tus puntos con rachas y subir en la tabla de líderes. ¡El reloj corre!',
    quickQuestions: [
      { label: '🏆 Consejos para maximizar puntaje', text: '¿Qué estrategia me recomiendas para responder rápido sin cometer errores en el desafío cronometrado?' }
    ]
  },

  'tutoriales-interactivos': {
    id: 'tutoriales-interactivos',
    title: 'Laboratorio de Tutoriales Interactivos',
    shortSummary: 'Experimentación visual paso a paso con controles dinámicos.',
    spokenScript: '¡Hola! Te encuentras en el Laboratorio de Tutoriales Interactivos. Explora los conceptos matemáticos manipulando controles visuales, ajustando parámetros y comprobando tu comprensión paso a paso. ¡Aprende haciendo!',
    quickQuestions: [
      { label: '✨ ¿Cómo aprovechar los interactivos?', text: '¿Cómo puedo utilizar los deslizadores interactivos para comprender mejor las transformaciones algebraicas y trigonométricas?' }
    ]
  }
};
