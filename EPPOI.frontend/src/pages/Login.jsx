import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function Login() {
  // 1. Ho rinominato la variabile per renderla coerente con il backend
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 2. Ora il JSON combacia ESATTAMENTE con il LoginRequestDto di C#
        body: JSON.stringify({ 
          emailOrUsername: emailOrUsername.trim(), 
          password: password 
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Risposta dal server:", data); 
        
        localStorage.setItem('token', data.token);

        navigate('/home'); 
      } else {
        setError('Credenziali non corrette.');
      }
    } catch (err) {
      setError('Impossibile connettersi al server.');
    }
  };

  return (
    <div className="auth-card">
      <h2>Accedi</h2>
      
      {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          {/* 3. Aggiornata la label e il placeholder per l'utente */}
          <label>Email o Username</label>
          <input 
            type="text" // Cambiato da "email" a "text"
            placeholder="mario@email.com o mariorossi" 
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary">Entra</button>
      </form>
      
      <div className="auth-links">
        <Link to="/forgot-password">Hai dimenticato la password?</Link>
        <Link to="/register">Non hai un account? Registrati</Link>
      </div>
    </div>
  );
}

export default Login;