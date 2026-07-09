import '../ChatWindow.css';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

// Se hai una variabile API_BASE_URL definita altrove nel progetto, usala, altrimenti lasciamo questa costante locale:
const API_BASE_URL = 'http://localhost:5246';

export default function ChatWindow() {
  // Recuperiamo l'id del comune dall'URL, ma se è undefined usiamo l'ID di fallback fornito dal team
  const { comuneId: urlId } = useParams();
  const comuneId = urlId || "6c44abbd-72f1-4906-b22a-467cc97cf7b6";

  const [messages, setMessages] = useState([
    { id: 1, text: "Ciao! Sono l'assistente virtuale di Eppoi. Chiedimi pure informazioni turistiche sul comune!", sender: 'bot', timestamp: new Date(), relatedData: [] }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Task 1 precedente: Automatic scrolling all'ultimo messaggio
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Gestione invio messaggi e interazione con l'API
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
  
    // Aggiungi messaggio dell'utente alla lista
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const queryText = inputValue;
    setInputValue('');
    setIsTyping(true);
  
    try {
      // Recuperiamo il token di autenticazione salvato durante il login
      const token = localStorage.getItem('token');
  
      // CORREZIONE 1: L'URL corretto è /api/chat
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // FONDAMENTALE: passiamo il token richiesto da [Authorize]
        },
        // CORREZIONE 2: I parametri del JSON devono essere "message" e "municipalityId"
        body: JSON.stringify({ 
          message: queryText,
          municipalityId: comuneId // Passiamo l'id validato (dinamico o di fallback)
        })
      });
      
      if (!response.ok) {
        throw new Error("Errore di risposta dal server");
      }
  
      const data = await response.json();
      
      // CORREZIONE 3: Il backend risponde con "data.reply"
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.reply || "Non ho trovato informazioni precise al riguardo.",
        sender: 'bot',
        timestamp: new Date(),
        relatedData: data.relatedData || [] // Mappiamo le card se presenti
      }]);
  
    } catch (error) {
      console.error("Errore chatbot:", error);
      
      // Graceful error handling
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Scusami, ma non riesco a recuperare i dati turistici in questo momento. Riprova più tardi.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsTyping(false);
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
              <p style={{ margin: 0 }}>{msg.text}</p>
              
              {/* TASK 1: RENDERING DELLE CARD SE PRESENTI NEL MESSAGGIO DEL BOT */}
              {msg.relatedData && msg.relatedData.length > 0 && (
                <div className="bot-cards-container" style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {msg.relatedData.map((item) => {
                    const detailPath = item.entityType === 'Sleep' 
                      ? `/SleepAccommodationDetail/${item.id}` 
                      : `/${item.entityType}Detail/${item.id}`;

                    return (
                      <Link 
                        to={detailPath} 
                        key={item.id} 
                        className="bot-data-card"
                        style={{ textDecoration: 'none', display: 'flex', gap: '10px', padding: '10px', backgroundColor: '#252525', borderRadius: '8px', border: '1px solid #333' }}
                      >
                        <img 
                          src={item.imagePath ? `https://eppoi.io${item.imagePath}` : "https://via.placeholder.com/50"} 
                          style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }} 
                          alt={item.title} 
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <h5 style={{ color: 'white', margin: 0, fontSize: '0.85rem', fontWeight: '600' }}>{item.title}</h5>
                          <span style={{ color: '#4DA8DA', fontSize: '0.7rem' }}>Visualizza dettaglio →</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* TASK 2: SE IL MESSAGGIO È SEGNALATO COME ERRORE */}
              {msg.isError && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#EF5350', fontSize: '0.8rem' }}>
                  <span>⚠️ Connessione locale non disponibile.</span>
                </div>
              )}

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