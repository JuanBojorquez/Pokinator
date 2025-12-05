import './Message.css'

function Message({ message }) {
  const isUser = message.role === 'user'
  
  return (
    <div className={`message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-content">
        <div className="message-avatar">
          {isUser ? '👤' : '🤖'}
        </div>
        <div className="message-text">
          {message.content}
        </div>
      </div>
    </div>
  )
}

export default Message

