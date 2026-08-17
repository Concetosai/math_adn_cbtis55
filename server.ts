import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Primary & Fallback API keys for Groq & Gemini
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// Fallback model sequence when a model experiences high demand (503/429)
const MODEL_FALLBACK_CANDIDATES = [
  "gemini-3.7-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
];

// Groq API call helper for ultra-fast Llama-3.3-70b / Llama-3.1-8b tutoring
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

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.6,
          max_tokens: 1024,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        console.warn(`Groq model ${model} responded with ${res.status}:`, errBody);
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

// Helper to generate pedagogical fallback if all AI models are unavailable or experiencing spikes
function generatePedagogicalFallback(message: string, context: any): string {
  const query = (message || "").toLowerCase();
  const mod = (context?.currentModule || "").toLowerCase();
  const question = context?.currentQuestion || "";

  if (query.includes("signo") || query.includes("ley de signos") || query.includes("menos") || query.includes("más")) {
    return `¡Gran pregunta sobre la **Ley de los Signos**! 🧠\n\n` +
      `Recuerda estas dos reglas de oro:\n` +
      `1. **En Multiplicación y División:**\n` +
      `   • Signos iguales dan positivo: (+)(+) = +, (-)(-) = +\n` +
      `   • Signos diferentes dan negativo: (+)(-) = -, (-)(+) = -\n\n` +
      `2. **En Suma y Resta:**\n` +
      `   • Mismo signo: se suman los valores y se conserva el signo (ej. -3 - 4 = -7).\n` +
      `   • Distinto signo: se restan los números y se deja el signo del mayor en valor absoluto (ej. -8 + 3 = -5).\n\n` +
      `¿En qué ejercicio o término específico tienes duda con los signos?`;
  }

  if (query.includes("paso a paso") || query.includes("ejemplo") || query.includes("resolver")) {
    return `¡Claro! Analicemos el procedimiento paso a paso para **${context.currentModule || "este tema"}**: 📐\n\n` +
      `1. **Identifica los datos:** Observa los términos conocidos y las incógnitas en: *${question || "la expresión en pantalla"}*.\n` +
      `2. **Aplica la jerarquía de operaciones:** Primero resuelve paréntesis, luego potencias/raíces, después multiplicaciones/divisiones y finalmente sumas/restas.\n` +
      `3. **Agrupa términos semejantes:** Junta las variables con su mismo exponente antes de operar.\n` +
      `4. **Despeja o simplifica:** Realiza la misma operación a ambos lados para mantener la igualdad.\n\n` +
      `¿Qué número o variable tienes en el primer paso para verificarlo juntos?`;
  }

  if (query.includes("por qué") || query.includes("razón") || query.includes("propiedad")) {
    return `Entender el **"por qué"** es la clave para dominar las matemáticas: 💡\n\n` +
      `En este paso de **${context.currentModule || "la lección"}**, la propiedad se cumple porque mantiene el equilibrio de la ecuación o la consistencia geométrica.\n` +
      `Por ejemplo, cuando sumamos o restamos lo mismo en ambos lados de la igualdad, la balanza matemática sigue equilibrada.\n\n` +
      `¿Qué parte del enunciado o término te gustaría desmenuzar con otro ejemplo visual?`;
  }

  return `Hola estudiante de CBTIS 55. Estoy listo para ayudarte con **${context.currentModule || "Matemáticas"}**: 📚\n\n` +
    `• Si estás en medio de un ejercicio, revisa primero la **jerarquía de operaciones** y los signos de cada término.\n` +
    `• Recuerda que en álgebra agrupamos términos semejantes (las *x* con las *x*, y las constantes con las constantes).\n` +
    `• ¿Qué parte de este paso te genera duda o qué resultado has obtenido hasta ahora? Cuéntame y lo revisamos juntos.`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "CBTIS 55 MATH" });
  });

  // AI Tutor API endpoint with automatic Groq + Gemini multi-engine & retry
  app.post("/api/tutor", async (req, res) => {
    try {
      const { 
        message, 
        history = [], 
        context = {}, 
        adminConfig = {} 
      } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "El mensaje es requerido." });
      }

      // Construct system instructions based on CBTIS 55 Math pedagogy + Teacher settings
      const basePrompt = adminConfig.systemPrompt || 
        `Eres el Asistente y Tutor Virtual oficial de matemáticas de CBTIS 55 (CBTIS 55 MATH).
Tu objetivo es guiar a los estudiantes de preparatoria/bachillerato técnico a comprender y dominar las matemáticas, desde la Base Cero (tablas, operaciones básicas de 2 y 3 dígitos), pasando por Álgebra Básica, Fracciones, Ecuaciones Lineales y Cuadráticas, Geometría Analítica, Trigonometría, hasta Cálculo Diferencial.

REGLAS PEDAGÓGICAS FUNDAMENTALES:
1. NUNCA des la respuesta numérica final de un ejercicio directamente si el estudiante está en medio de resolver un problema o pide la solución.
2. Utiliza el método socrático: haz preguntas guía, descompón el problema en pasos pequeños y fáciles de seguir, y explica el "por qué" de cada fórmula o propiedad.
3. Explica los pasos con claridad, usando notación matemática limpia (ej. x², √x, a/b, sin(θ), dy/dx) y formato amigable con negritas y viñetas.
4. Si el estudiante comete un error, felicítalo por el intento, identifica amablemente en qué paso se originó el despiste (ej. ley de signos, jerarquía de operaciones, despeje) y dale un ejemplo análogo más sencillo.
5. Mantén un tono motivador, empático, paciente y profesional, representativo del espíritu académico del CBTIS 55.`;

      const teacherCustomKnowledge = adminConfig.customKnowledge 
        ? `\n\nMATERIAL DE APOYO Y MEMORIA CARGADA POR EL DOCENTE/ADMINISTRADOR:\n${adminConfig.customKnowledge}` 
        : "";

      const studentContext = `
CONTEXTO ACTUAL DEL ESTUDIANTE:
- Módulo en curso: ${context.currentModule || "General / Tablero"}
- Nivel o Sección: ${context.currentLevel ? `Nivel ${context.currentLevel}` : "General"}
- Ejercicio o Pregunta en pantalla: ${context.currentQuestion || "Consulta libre"}
${teacherCustomKnowledge}`;

      const fullSystemInstruction = `${basePrompt}\n${studentContext}`;

      // 1. First attempt: Groq High-Speed AI Engine (Llama 3.3 70B)
      const groqReply = await callGroqTutor(fullSystemInstruction, history, message);
      if (groqReply) {
        return res.json({ reply: groqReply, provider: "groq" });
      }

      // 2. Second attempt: Gemini API Engine
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
                return res.json({ reply: response.text.trim(), provider: "gemini", model: modelCandidate });
              }
            } catch (modelErr: any) {
              const errMsg = String(modelErr?.message || "");
              const isTransient = errMsg.includes("503") || errMsg.includes("429") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand");
              
              console.warn(`Attempt ${attempt + 1} with model ${modelCandidate} failed:`, modelErr?.message || modelErr);
              
              if (isTransient && attempt === 0) {
                await new Promise((r) => setTimeout(r, 300));
                continue;
              }
              break;
            }
          }
        }
      }

      // 3. Fallback: Intelligent pedagogical engine if all remote engines are busy
      console.warn("Serving pedagogical fallback.");
      const fallbackReply = generatePedagogicalFallback(message, context);
      return res.json({ reply: fallbackReply, fallback: true });

    } catch (error: any) {
      console.error("Critical error in /api/tutor:", error);
      const fallbackReply = generatePedagogicalFallback(req.body?.message || "", req.body?.context || {});
      return res.json({ 
        reply: fallbackReply,
        fallback: true
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CBTIS 55 MATH Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

