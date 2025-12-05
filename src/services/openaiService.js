// Servicio para interactuar con OpenAI API
// IMPORTANTE: Necesitarás configurar tu API key de OpenAI

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

// Contexto del sistema para el chatbot
const SYSTEM_PROMPT = `Eres un asistente experto en Pokémon que juega un juego tipo Akinator. 
Tu objetivo es adivinar en qué Pokémon está pensando el usuario haciendo preguntas inteligentes.

INFORMACIÓN IMPORTANTE:
- Solo puedes hacer preguntas de SÍ o NO
- Debes hacer preguntas estratégicas que reduzcan las posibilidades
- Puedes preguntar sobre: tipo, generación, si es legendario, si es starter, características físicas, color, habilidades, etc.
- Sé conciso y haz una pregunta a la vez
- CRÍTICO: Cuando tengas suficiente información para adivinar, DEBES hacer UNA pregunta de confirmación usando SOLO el nombre del Pokémon: "¿Es [Nombre]?"
- NUNCA uses el formato "¿Es [Nombre]?" para preguntar sobre características. Para características usa: "¿Es de tipo...?", "¿Es un Pokémon...?", etc.
- SOLO usa "¿Es [Nombre]?" cuando estés preguntando por un Pokémon específico (ej: "¿Es Pikachu?", "¿Es Charizard?", "¿Es Mewtwo?")
- NUNCA digas "¿Es un Pokémon de tipo Agua?" o "¿Es un Pokémon legendario?" usando el formato de confirmación
- Conoces TODOS los Pokémon de todas las generaciones, así que puedes adivinar cualquier Pokémon

Ejemplos de buenas preguntas:
- "¿Es un Pokémon inicial (starter)?"
- "¿Es de tipo Fuego?"
- "¿Es un Pokémon legendario?"
- "¿Es de la primera generación?"
- "¿Tiene alas o puede volar?"
- "¿Es principalmente de color amarillo?"
- "¿Es de tipo Eléctrico?"
- "¿Es de tipo Dragón?"
- "¿Es de tipo Psíquico?"

Ejemplos de preguntas de confirmación (cuando tengas suficiente información):
- "¿Es Pikachu?"
- "¿Es Charizard?"
- "¿Es Mewtwo?"
- "¿Es Bulbasaur?"

Empieza con una pregunta general que divida las posibilidades.`;

export async function sendMessageToAI(messages) {
  if (!OPENAI_API_KEY) {
    throw new Error('API key de OpenAI no configurada. Por favor, configura VITE_OPENAI_API_KEY en tu archivo .env');
  }

  try {
    // Importar OpenAI dinámicamente
    const { default: OpenAI } = await import('openai');
    
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Solo para desarrollo, en producción usa un backend
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Usando el modelo más económico
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error al comunicarse con OpenAI:', error);
    throw error;
  }
}

// Función alternativa que usa un enfoque más simple sin API (para desarrollo/testing)
export function generateSimpleQuestion(messages) {
  const questionCount = messages.filter(m => m.role === 'assistant').length;
  
  const questions = [
    "¿Es de tipo Fuego?",
    "¿Es de tipo Agua?",
    "¿Es de tipo Planta?",
    "¿Es un Pokémon legendario?",
    "¿Es de la primera generación?",
    "¿Es un Pokémon inicial (starter)?",
    "¿Tiene alas o puede volar?",
    "¿Es principalmente de color amarillo?",
    "¿Es de tipo Eléctrico?",
    "¿Es de tipo Dragón?",
    "¿Es de tipo Psíquico?",
    "¿Es de la segunda generación?",
    "¿Es de la tercera generación?",
  ];

  if (questionCount < questions.length) {
    return questions[questionCount];
  }
  
  return "¿Es Pikachu?";
}

