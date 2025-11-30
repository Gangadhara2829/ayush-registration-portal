import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';


const chatStyles = {
  // Styles for the entire chatbot container (closed button + open window)
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
  },
  // Styles for the main chat window
  chatWindow: {
    width: '350px',
    height: '450px',
    border: '1px solid #007bff',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  // Styles for the header and close button
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 15px',
    fontWeight: '700',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    cursor: 'pointer',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0 5px',
    fontWeight: 'bold',
    transition: 'opacity 0.2s',
  },
  messages: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f8f8',
  },
  message: {
    padding: '10px 14px',
    borderRadius: '16px',
    marginBottom: '8px',
    maxWidth: '85%',
    wordWrap: 'break-word',
    fontSize: '14px',
    lineHeight: '1.4',
    boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
  },
  userMessage: {
    backgroundColor: '#377dff',
    color: 'white',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px',
  },
  botMessage: {
    backgroundColor: '#e9ecef',
    color: '#333',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px',
  },
  // Styles for the collapsed button
  collapsedButton: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  },
  form: {
    display: 'flex',
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    border: 'none',
    padding: '12px',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '0 15px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  }
};

const Chatbot = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([
    { sender: 'ai', content: 'Hello! I am the AI Assistant. Ask me general questions about registration, documents, or policies.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false); 
  const [isOpen, setIsOpen] = useState(false); // New state for open/close toggle
  const messagesEndRef = useRef(null);

  // Connect to socket and set up listeners
  useEffect(() => {
    const newSocket = io('https://ayush-portal-backend.onrender.com'); 
    setSocket(newSocket);

    // Listen for messages from the AI bot
    const handleBotMessage = (message) => {
      setIsTyping(false); 
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    newSocket.on('botMessage', handleBotMessage);

    return () => {
      newSocket.off('botMessage', handleBotMessage);
      newSocket.disconnect();
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const messageContent = input.trim();
    if (!socket || !messageContent || isTyping) return;

    const userMessage = { sender: 'user', content: messageContent };
    
    // 1. Add user's message to state immediately
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // 2. Show typing indicator
    setIsTyping(true);

    // 3. Send message to the AI bot
    // We send the message content to the backend
    socket.emit('sendToBot', messageContent); 
    
    setInput(''); // Clear input field
  };
  
  // Renders the collapsed button
  if (!isOpen) {
    return (
      <div style={chatStyles.container}>
        <div 
          style={chatStyles.collapsedButton} 
          onClick={() => setIsOpen(true)}
          title="Open AI Chat"
        >
          {/* Chat Icon/Emoji */}
          💬
        </div>
      </div>
    );
  }

  // Renders the full chat window
  return (
    <div style={chatStyles.container}>
      <div style={chatStyles.chatWindow}>
        <div style={chatStyles.header} onClick={() => setIsOpen(false)}>
          <span>AI Assistant</span>
          <button style={chatStyles.closeButton} onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} title="Close Chat">
            ✕
          </button>
        </div>
        <div style={chatStyles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{ 
                ...chatStyles.message, 
                ...(msg.sender === 'user' ? chatStyles.userMessage : chatStyles.botMessage) 
              }}
            >
              {msg.content}
            </div>
          ))}
          {/* Typing Indicator */}
          {isTyping && (
              <div style={{ ...chatStyles.message, ...chatStyles.botMessage, fontStyle: 'italic', opacity: 0.7 }}>
                  AI is typing...
              </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} style={chatStyles.form}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a general question..."
            style={chatStyles.input}
            disabled={isTyping}
          />
          <button type="submit" style={chatStyles.button} disabled={isTyping}>
            {isTyping ? 'Wait' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;