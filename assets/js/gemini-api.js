async function generateQuiz(theme) {
  if (!theme || theme.trim().length === 0) {
    throw new Error("Por favor, forneça um tema válido");
  }
  if (!window.CONFIG || !window.CONFIG.GEMINI_API_KEY) {
    throw new Error(
      "API Key não configurada! Configure em assets/js/config.js"
    );
  }
  try {
    const prompt = createQuizPrompt(theme);
    const response = await fetch(
      `${window.CONFIG.GEMINI_ENDPOINT}?key=${window.CONFIG.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 2048,
            responseMimeType: "application/json",
          },
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `Erro na API: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    console.log("Resposta completa da API:", data);

    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      console.error("Estrutura da resposta:", JSON.stringify(data, null, 2));
      throw new Error("Resposta da API está vazia ou inválida");
    }

    console.log("Texto extraído:", responseText);
    const quizData = parseGeminiResponse(responseText);
    validateQuizData(quizData);
    return quizData.questions;
  } catch (error) {
    console.error("Erro ao gerar quiz:", error);
    if (error.message.includes("API key")) {
      throw new Error("API key inválida. Verifique sua configuração.");
    }
    if (error.message.includes("quota")) {
      throw new Error(
        "Limite de uso da API atingido. Tente novamente mais tarde."
      );
    }
    // Propagar o erro ao invés de usar fallback automático
    throw new Error(`Falha ao gerar quiz: ${error.message}`);
  }
}
function createQuizPrompt(theme) {
  return `Você é um gerador de quizzes educacionais. Crie um quiz sobre: "${theme}".

RESPONDA SOMENTE COM O JSON ABAIXO (sem texto adicional, sem explicações, sem markdown):

{
  "questions": [
    {
      "question": "Texto da pergunta?",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correct": "A"
    }
  ]
}

REGRAS:
- 10 perguntas de múltipla escolha
- 4 opções por pergunta
- Alternativas plausíveis
- "correct" deve ser: A, B, C ou D
- RETORNE APENAS O JSON (sem \`\`\`json, sem texto antes ou depois)`;
}
function parseGeminiResponse(responseText) {
  try {
    console.log("Resposta original do Gemini:", responseText);

    let cleanText = responseText.trim();

    // Remover blocos de código markdown
    cleanText = cleanText.replace(/```json\s*/gi, "");
    cleanText = cleanText.replace(/```\s*/g, "");

    // Remover texto antes do JSON (se houver)
    const jsonStartIndex = cleanText.indexOf("{");
    const jsonEndIndex = cleanText.lastIndexOf("}");

    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
      cleanText = cleanText.substring(jsonStartIndex, jsonEndIndex + 1);
    }

    // Tentar fazer parse direto
    try {
      const parsed = JSON.parse(cleanText);
      return parsed;
    } catch (firstError) {
      console.warn("Parse direto falhou, tentando extrair JSON:", firstError);

      // Tentar encontrar JSON com regex mais robusto
      const jsonMatch = responseText.match(/\{[\s\S]*"questions"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }

      throw firstError;
    }
  } catch (error) {
    console.error("Erro ao fazer parse da resposta:", error);
    console.error("Texto que tentou fazer parse:", responseText);
    throw new Error(
      `Não foi possível extrair JSON válido da resposta. Erro: ${error.message}`
    );
  }
}
function validateQuizData(quizData) {
  if (!quizData.questions || !Array.isArray(quizData.questions)) {
    throw new Error('Estrutura inválida: "questions" não é um array');
  }
  if (quizData.questions.length !== 10) {
    console.warn(
      `Esperadas 10 perguntas, recebidas ${quizData.questions.length}`
    );
  }
  quizData.questions.forEach((q, index) => {
    if (!q.question || typeof q.question !== "string") {
      throw new Error(`Pergunta ${index + 1}: campo "question" inválido`);
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Pergunta ${index + 1}: deve ter exatamente 4 opções`);
    }
    if (!q.correct || !["A", "B", "C", "D"].includes(q.correct.toUpperCase())) {
      throw new Error(
        `Pergunta ${index + 1}: resposta correta deve ser A, B, C ou D`
      );
    }
    q.correct = q.correct.toUpperCase();
  });
  return true;
}
