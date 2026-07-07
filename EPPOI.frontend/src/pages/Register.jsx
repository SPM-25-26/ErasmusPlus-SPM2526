import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confermaPassword, setConfermaPassword] = useState('');
  const [errore, setErrore] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- VALIDAZIONE LATO CLIENT ---
    if (nome.trim().length < 2) {
      setErrore("Il nome deve contenere almeno 2 caratteri.");
      return;
    }

    if (cognome.trim().length < 2) {
      setErrore("Il cognome deve contenere almeno 2 caratteri.");
      return;
    }

    if (!username.trim()) {
      setErrore("Inserisci uno username.");
      return;
    }

    if (!email.trim()) {
      setErrore("Inserisci la tua email.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setErrore("Inserisci un indirizzo email valido.");
      return;
    }

    if (password.length < 8) {
      setErrore("La password deve contenere almeno 8 caratteri.");
      return;
    }

    const haMaiuscola = /[A-Z]/.test(password);
    const haNumero = /[0-9]/.test(password);
    const haSpeciale = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!haMaiuscola || !haNumero || !haSpeciale) {
      setErrore("La password deve contenere almeno 1 maiuscola, 1 numero e 1 carattere speciale.");
      return;
    }

    if (password !== confermaPassword) {
      setErrore("Le password non coincidono.");
      return;
    }

    setErrore('');

    // --- CHIAMATA API AL BACKEND .NET ---
    try {
      const response = await fetch(`http://localhost:5246/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nome,
          surname: cognome,
          username: username,
          email: email,
          password: password,
          confirmPassword: confermaPassword 
        })
      });

      if (response.ok) {
        // Status 201 Created -> Successo!
        navigate('/verify-email');
      } else {
        const errorData = await response.json();
        setErrore(errorData.message || "Errore durante la registrazione. Riprova.");
      }
    } catch (error) {
      // Server spento o irraggiungibile
      console.error("Errore di rete:", error);
      setErrore("Impossibile connettersi al server. Assicurati che il backend sia avviato.");
    }
  };

  return (
    <div className="auth-card">
      <h2>Crea Account</h2>
      
      {errore && (
        <div style={{ color: '#ff4d4d', backgroundColor: '#331a1a', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center', border: '1px solid #ff4d4d' }}>
          {errore}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome</label>
          <input 
            type="text" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Mario" 
            required 
          />
        </div>

        <div className="form-group">
          <label>Cognome</label>
          <input 
            type="text" 
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
            placeholder="Rossi" 
            required 
          />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="mariorossi" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mario@email.com" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            required 
          />
        </div>

        <div className="form-group">
          <label>Conferma Password</label>
          <input 
            type="password" 
            value={confermaPassword}
            onChange={(e) => setConfermaPassword(e.target.value)}
            placeholder="••••••••" 
            required 
          />
        </div>
        
        <button type="submit" className="btn-primary">Registrati</button>
      </form>
      
      <div className="auth-links">
        <Link to="/login">Hai già un account? Accedi</Link>
      </div>
    </div>
  );
}

export default Register;