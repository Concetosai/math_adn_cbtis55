/**
 * Utility to format mathematical expressions into clean, natural Spanish/Mexican notation
 * (CBTIS 55 / SEP México standard notation).
 * 
 * Converts raw LaTeX codes, escape artifacts (like \times, \div, \pm, \sqrt, \frac, etc.)
 * into legible Unicode symbols (×, ÷, ±, √, ², ³, ·, sen, etc.).
 */

export function formatMathExpression(input: string | undefined | null): string {
  if (!input) return '';

  let text = input;

  // Replace escaped \t times or literal \times or times in math expressions
  text = text.replace(/\\times\b/g, '×');
  text = text.replace(/\btimes\b/gi, '×');
  text = text.replace(/\\div\b/g, '÷');
  text = text.replace(/\\pm\b/g, '±');
  text = text.replace(/\\mp\b/g, '∓');
  text = text.replace(/\\cdot\b/g, '·');
  text = text.replace(/\\bullet\b/g, '•');
  text = text.replace(/\\leq?\b/g, '≤');
  text = text.replace(/\\geq?\b/g, '≥');
  text = text.replace(/\\neq\b/g, '≠');
  text = text.replace(/\\approx\b/g, '≈');
  text = text.replace(/\\infty\b/g, '∞');
  text = text.replace(/\\implies\b/g, '→');
  text = text.replace(/\\iff\b/g, '↔');
  text = text.replace(/\\to\b/g, '→');
  text = text.replace(/\\alpha\b/g, 'α');
  text = text.replace(/\\beta\b/g, 'β');
  text = text.replace(/\\theta\b/g, 'θ');
  text = text.replace(/\\Delta\b/g, 'Δ');
  text = text.replace(/\\pi\b/g, 'π');
  text = text.replace(/\\quad\b/g, '   ');
  text = text.replace(/\\,/g, ' ');
  text = text.replace(/\\;/g, ' ');

  // Spanish trigonometric notation (sen instead of sin)
  text = text.replace(/\\sin\b/g, 'sen');
  text = text.replace(/\bsin\(/g, 'sen(');
  text = text.replace(/\bsin\^/g, 'sen^');
  text = text.replace(/\\cos\b/g, 'cos');
  text = text.replace(/\\tan\b/g, 'tan');
  text = text.replace(/\\sec\b/g, 'sec');
  text = text.replace(/\\csc\b/g, 'csc');
  text = text.replace(/\\cot\b/g, 'cot');

  // Integrals & Limits
  text = text.replace(/\\int\b/g, '∫');
  text = text.replace(/\\lim_\{([^}]+)\}/g, 'lím ($1)');
  text = text.replace(/\\lim\b/g, 'lím');

  // Fractions: \frac{a}{b} -> (a) / (b) or a/b
  text = text.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)');
  text = text.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)'); // 2nd pass for nested

  // Sqrt: \sqrt{a} -> √(a)
  text = text.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');
  text = text.replace(/\\sqrt\b/g, '√');

  // Text wrapper: \text{...} -> ...
  text = text.replace(/\\text\{([^{}]+)\}/g, '$1');

  // Left & Right brackets
  text = text.replace(/\\left\(/g, '(');
  text = text.replace(/\\right\)/g, ')');
  text = text.replace(/\\left\[/g, '[');
  text = text.replace(/\\right\]/g, ']');

  // Cases system: \begin{cases} a \\ b \end{cases} -> a \n b
  text = text.replace(/\\begin\{cases\}/g, '');
  text = text.replace(/\\end\{cases\}/g, '');
  text = text.replace(/\\\\/g, '\n');

  // Exponents conversion when appropriate (e.g. ^2 -> ², ^3 -> ³, ^4 -> ⁴, ^0 -> ⁰)
  text = text.replace(/\^2\b/g, '²');
  text = text.replace(/\^3\b/g, '³');
  text = text.replace(/\^4\b/g, '⁴');
  text = text.replace(/\^5\b/g, '⁵');
  text = text.replace(/\^6\b/g, '⁶');
  text = text.replace(/\^7\b/g, '⁷');
  text = text.replace(/\^8\b/g, '⁸');
  text = text.replace(/\^9\b/g, '⁹');
  text = text.replace(/\^0\b/g, '⁰');
  text = text.replace(/\^n\b/g, 'ⁿ');
  text = text.replace(/\^x\b/g, 'ˣ');

  return text.trim();
}
