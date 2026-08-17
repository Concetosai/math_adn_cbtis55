import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: { "User-Agent": "aistudio-build" },
        },
      });
    }
  }
  return aiClient;
}

const MODEL_FALLBACK_CANDIDATES = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
];

async function callGroqTutor(
  systemPrompt: string,
  history: Array<{ role: string; content: string }>,
  userMessage: string
): Promise<string | null> {
  const apiKey = GROQ_API_KEY;
  if (!apiKey) return null;

  const groqModels = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

  for (const model of groqModels) {
    try {
      const messages: Array<{ role: string; content: string }> = [
        { role: "system", content: systemPrompt },
      ];

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item.content && item.role) {
            messages.push({
              role: item.role === "user" ? "user" : "assistant",
              content: item.content,
            });
          }
        }
      }

      messages.push({ role: "user", content: userMessage });

      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.6,
            max_tokens: 1024,
          }),
        }
      );

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        console.warn(
          `Groq model ${model} responded with ${res.status}:`,
          errBody
        );
        continue;
      }

      const data = await res.json();
      const answer = data?.choices?.[0]?.message?.content;
      if (answer && answer.trim()) {
        return answer.trim();
      }
    } catch (groqErr) {
      console.warn(`Groq model ${model} error:`, groqErr);
    }
  }

  return null;
}

function generatePedagogicalFallback(message: string, context: any): string {
  const query = (message || "").toLowerCase();

  if (
    query.includes("signo") ||
    query.includes("ley de signos") ||
    query.includes("menos") ||
    query.includes("más")
  ) {
    return (
      `**Ley de los Signos**\n\n` +
      `1. **Multiplicación y División:**\n` +
      `   • Signos iguales = positivo: (+)(+) = +, (-)(-) = +\n` +
      `   • Signos diferentes = negativo: (+)(-) = -, (-)(+) = -\n\n` +
      `2. **Suma y Resta:**\n` +
      `   • Mismo signo: se suman y se conserva el signo.\n` +
      `   • Distinto signo: se restan y se deja el signo del mayor.\n\n` +
      `¿En qué ejercicio tienes duda?`
    );
  }

  if (
    query.includes("paso a paso") ||
    query.includes("ejemplo") ||
    query.includes("resolver")
  ) {
    return (
      `Procedimiento paso a paso para **${context?.currentModule || "este tema"}**:\n\n` +
      `1. **Identifica los datos:** Términos conocidos e incógnitas.\n` +
      `2. **Jerarquía de operaciones:** Paréntesis → Potencias → Mult/Div → Sumas/Restas.\n` +
      `3. **Agrupa términos semejantes.**\n` +
      `4. **Despeja o simplifica.**\n\n` +
      `¿Qué resultado has obtenido hasta ahora?`
    );
  }

  return (
    `Hola estudiante de CBTIS 55. Estoy listo para ayudarte con **${context?.currentModule || "Matemáticas"}**.\n\n` +
    `• Revisa la jerarquía de operaciones y los signos.\n` +
    `• Agrupa términos semejantes antes de operar.\n` +
    `• ¿Qué parte te genera duda?`
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history = [], context = {}, adminConfig = {} } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "El mensaje es requerido." });
    }

    const basePrompt =
      adminConfig.systemPrompt ||
      `Eres el Tutor Virtual oficial de matemáticas de CBTIS 55.
REGLAS:
1. NUNCA des la respuesta final directamente.
2. Método socrático: preguntas guía, pasos pequeños.
3. Notación matemática limpia.
4. Si hay error, identifica el paso y da un ejemplo análogo.
5. Tono motivador y profesional.`;

    const teacherCustomKnowledge = adminConfig.customKnowledge
      ? `\n\nMATERIAL DEL DOCENTE:\n${adminConfig.customKnowledge}`
      : "";

    const studentContext = `
CONTEXTO:
- Módulo: ${context.currentModule || "General"}
- Nivel: ${context.currentLevel || "General"}
- Ejercicio: ${context.currentQuestion || "Consulta libre"}
${teacherCustomKnowledge}`;

    const fullSystemInstruction = `${basePrompt}\n${studentContext}`;

    // 1. Try Groq
    const groqReply = await callGroqTutor(
      fullSystemInstruction,
      history,
      message
    );
    if (groqReply) {
      return res.json({ reply: groqReply, provider: "groq" });
    }

    // 2. Try Gemini
    const client = getGenAI();
    if (client) {
      const formattedContents: any[] = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item.content && item.role) {
            formattedContents.push({
              role: item.role === "user" ? "user" : "model",
              parts: [{ text: item.content }],
            });
          }
        }
      }

      formattedContents.push({
        role: "user",
        parts: [{ text: message }],
      });

      for (const modelCandidate of MODEL_FALLBACK_CANDIDATES) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const response = await client.models.generateContent({
              model: modelCandidate,
              contents: formattedContents,
              config: {
                systemInstruction: fullSystemInstruction,
                temperature: 0.6,
              },
            });

            if (response.text && response.text.trim()) {
              return res.json({
                reply: response.text.trim(),
                provider: "gemini",
                model: modelCandidate,
              });
            }
          } catch (modelErr: any) {
            const errMsg = String(modelErr?.message || "");
            const isTransient =
              errMsg.includes("503") ||
              errMsg.includes("429") ||
              errMsg.includes("UNAVAILABLE");

            if (isTransient && attempt === 0) {
              await new Promise((r) => setTimeout(r, 300));
              continue;
            }
            break;
          }
        }
      }
    }

    // 3. Fallback
    const fallbackReply = generatePedagogicalFallback(message, context);
    return res.json({ reply: fallbackReply, fallback: true });
  } catch (error: any) {
    console.error("Error in /api/tutor:", error);
    const fallbackReply = generatePedagogicalFallback(
      req.body?.message || "",
      req.body?.context || {}
    );
    return res.json({ reply: fallbackReply, fallback: true });
  }
}
