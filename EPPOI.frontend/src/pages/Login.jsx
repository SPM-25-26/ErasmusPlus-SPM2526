import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="auth-card">
      <h2>Accedi</h2>
      <form>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="mario@email.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
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