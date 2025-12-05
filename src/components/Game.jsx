import { useState, useEffect, useRef } from 'react'
import Chat from './Chat'
import { sendMessageToAI, generateSimpleQuestion } from '../services/openaiService'
import './Game.css'

function Game() {
  const [messages, setMessages] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [guessedPokemon, setGuessedPokemon] = useState(null)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startGame = () => {
    setGameStarted(true)
    setMessages([])
    setGuessedPokemon(null)
    setIsThinking(true)
    
    // Primer mensaje del bot
    setTimeout(() => {
      const firstMessage = {
        role: 'assistant',
        content: '¡Hola! Soy tu asistente Pokémon. Piensa en un Pokémon y yo intentaré adivinarlo haciendo preguntas. ¿Estás listo? ¡Empecemos!'
      }
      setMessages([firstMessage])
      setIsThinking(false)
      
      // Primera pregunta después de un breve delay
      setTimeout(() => {
        askQuestion([firstMessage])
      }, 1500)
    }, 500)
  }

  const askQuestion = async (currentMessages) => {
    setIsThinking(true)
    
    try {
      let question
      
      if (import.meta.env.VITE_OPENAI_API_KEY) {
        // Usar OpenAI API
        question = await sendMessageToAI(currentMessages)
      } else {
        // Usar preguntas simples (fallback)
        question = generateSimpleQuestion(currentMessages)
      }
      
      const assistantMessage = {
        role: 'assistant',
        content: question
      }
      
      setMessages([...currentMessages, assistantMessage])
      setIsThinking(false)
    } catch (error) {
      console.error('Error al generar pregunta:', error)
      // Fallback a preguntas simples
      const question = generateSimpleQuestion(currentMessages)
      const assistantMessage = {
        role: 'assistant',
        content: question
      }
      setMessages([...currentMessages, assistantMessage])
      setIsThinking(false)
    }
  }

  // Función para verificar si una pregunta es sobre un Pokémon específico (no una característica)
  const isPokemonNameQuestion = (question) => {
    if (!question.includes('¿Es')) return false
    
    const match = question.match(/¿Es (.+?)\?/)
    if (!match) return false
    
    const textAfterIs = match[1].trim().toLowerCase()
    
    // Lista de palabras clave que indican características (NO nombres de Pokémon)
    const characteristicKeywords = [
      'de tipo', 'tipo', 'un pokémon', 'un pokemon', 'pokémon', 'pokemon',
      'legendario', 'legendaria', 'inicial', 'starter', 'de la', 'generación',
      'principalmente', 'color', 'amarillo', 'rojo', 'azul', 'verde', 'negro', 'blanco',
      'tiene', 'puede', 'volar', 'alas', 'agua', 'fuego', 'planta', 'eléctrico',
      'psíquico', 'dragón', 'volador', 'hielo', 'veneno', 'fantasma', 'acero',
      'hada', 'siniestro', 'normal', 'lucha', 'roca', 'tierra', 'bicho',
      'primera', 'segunda', 'tercera', 'cuarta', 'quinta', 'sexta', 'séptima', 'octava', 'novena'
    ]
    
    // Si contiene alguna palabra clave de características, NO es un nombre de Pokémon
    for (const keyword of characteristicKeywords) {
      if (textAfterIs.includes(keyword)) {
        return false
      }
    }
    
    // Si el texto es muy corto (menos de 3 caracteres), probablemente no es un nombre
    if (textAfterIs.length < 3) return false
    
    // Si pasa todas las validaciones, probablemente es un nombre de Pokémon
    return true
  }

  const handleAnswer = async (answer) => {
    if (guessedPokemon) return // El juego ya terminó

    const userMessage = {
      role: 'user',
      content: answer === 'yes' ? 'Sí' : answer === 'no' ? 'No' : answer
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)

    const lastQuestion = messages[messages.length - 1]?.content || ''

    // Verificar si la pregunta es sobre un Pokémon específico (confirmación)
    if (answer === 'yes' && isPokemonNameQuestion(lastQuestion)) {
      const pokemonMatch = lastQuestion.match(/¿Es (.+?)\?/)
      if (pokemonMatch) {
        const pokemonName = pokemonMatch[1].trim()
        // Si la IA pregunta por un Pokémon específico y el usuario dice sí, adivinamos
        setGuessedPokemon(pokemonName)
        const winMessage = {
          role: 'assistant',
          content: `¡Genial! ¡Adiviné! Estabas pensando en ${pokemonName}. 🎉`
        }
        setMessages([...newMessages, winMessage])
        return
      }
    }

    // Si la respuesta es "no" a una pregunta de confirmación, continuar preguntando
    if (answer === 'no' && isPokemonNameQuestion(lastQuestion)) {
      // Continuar con la siguiente pregunta
      await askQuestion(newMessages)
      return
    }

    // Continuar con la siguiente pregunta
    await askQuestion(newMessages)
  }

  const resetGame = () => {
    setGameStarted(false)
    setMessages([])
    setGuessedPokemon(null)
    setIsThinking(false)
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>🎮 Pokinator</h1>
        <p className="subtitle">Piensa en un Pokémon y yo intentaré adivinarlo</p>
        
        {!gameStarted && (
          <button className="start-button" onClick={startGame}>
            Comenzar Juego
          </button>
        )}
        {gameStarted && !guessedPokemon && (
          <button className="reset-button" onClick={resetGame}>
            Reiniciar
          </button>
        )}
      </div>

      {gameStarted && (
        <Chat
          messages={messages}
          isThinking={isThinking}
          onAnswer={handleAnswer}
          guessedPokemon={guessedPokemon}
          chatEndRef={chatEndRef}
        />
      )}

      {guessedPokemon && (
        <div className="win-message">
          <button className="play-again-button" onClick={resetGame}>
            Jugar de Nuevo
          </button>
        </div>
      )}

      <div className="info-box">
        <p>💡 <strong>Consejo:</strong> Responde honestamente a las preguntas para que pueda adivinarlo correctamente.</p>
        {!import.meta.env.VITE_OPENAI_API_KEY && (
          <p className="warning">
            ⚠️ Modo simple activado. Para usar IA avanzada, configura VITE_OPENAI_API_KEY en tu archivo .env
          </p>
        )}
      </div>
    </div>
  )
}

export default Game
