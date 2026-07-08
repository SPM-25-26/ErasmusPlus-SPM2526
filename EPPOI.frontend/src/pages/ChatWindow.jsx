
import '../ChatWindow.css';
import React, { useState, useEffect, useRef } from 'react';

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Ciao! Sono l'assistente virtuale di Eppoi. Chiedimi pure informazioni turistiche sul comune!", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Task 1: Automatic scrolling all'ultimo messaggio
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Task 2: Validazione dell'input e interazione
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Aggiungi messaggio dell'utente alla lista cronologica
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const queryText = inputValue;
    setInputValue(''); // Pulisce l'input
    
    // Attiva lo stato "bot is typing"
    setIsTyping(true);

    try {
      // Qui faremo la chiamata al tuo backend .NET locale (porta 5246)
      const response = await fetch('http://localhost:5246/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText })
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.reply || "Risposta dal server",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } catch (error) {
      // Gestione errore fittizia se il backend non risponde ancora
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Spiacente, si è verificato un errore di connessione con il comune.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false); // Disattiva il caricamento
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Assistente Turistico - Eppoi</h3>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
            <div className="message-bubble">
              <p>{msg.text}</p>
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {/* Stato di caricamento "Bot is typing" */}
        {isTyping && (
          <div className="message-wrapper bot">
            <div className="message-bubble typing">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Chiedi informazioni sul comune..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Invia</button>
      </form>
    </div>
  );
}