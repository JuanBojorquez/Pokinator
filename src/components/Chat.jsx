import { useState } from 'react'
import Message from './Message'
import './Chat.css'

function Chat({ messages, isThinking, onAnswer, guessedPokemon, chatEndRef }) {
  const [showButtons, setShowButtons] = useState(true)

  const handleAnswerClick = (answer) => {
    setShowButtons(false)
    onAnswer(answer)
    // Mostrar botones de nuevo después de un breve delay
    setTimeout(() => {
      setShowButtons(true)
    }, 500)
  }

  const lastMessage = messages[messages.length - 1]
  const isQuestion = lastMessage?.role === 'assistant' && !guessedPokemon

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        {isThinking && (
          <div className="thinking">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>Pensando...</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {!guessedPokemon && isQuestion && showButtons && !isThinking && (
        <div className="answer-buttons">
          <button
            className="answer-btn yes-btn"
            onClick={() => handleAnswerClick('yes')}
          >
            ✅ Sí
          </button>
          <button
            className="answer-btn no-btn"
            onClick={() => handleAnswerClick('no')}
          >
            ❌ No
          </button>
          <button
            className="answer-btn maybe-btn"
            onClick={() => handleAnswerClick('maybe')}
          >
            🤔 No sé
          </button>
        </div>
      )}
    </div>
  )
}

export default Chat

