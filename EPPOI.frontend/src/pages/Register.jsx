import React, { useState } from 'react';
// 1. Aggiungiamo useNavigate tra le importazioni
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errore, setErrore] = useState('');

  // 2. Inizializziamo l'hook per la navigazione
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const haMaiuscola = /[A-Z]/.test(password);
    const haNumero = /[0-9]/.test(password);
    const haSpeciale = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!haMaiuscola || !haNumero || !haSpeciale) {
      setErrore("La password deve contenere almeno 1 maiuscola, 1 numero e 1 carattere speciale.");
      return;
    }

    setErrore('');
    
    // 3. Potiamo l'utente alla pagina di verifica email
    navigate('/verify-email');
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
          <label>Nome Completo</label>
          <input 
            type="text" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Mario Rossi" 
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
        
        <button type="submit" className="btn-primary">Registrati</button>
      </form>
      
      <div className="auth-links">
        <Link to="/login">Hai già un account? Accedi</Link>
      </div>
    </div>
  );
}

export default Register;