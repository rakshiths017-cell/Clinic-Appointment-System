import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:5000/api";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient'); // <-- NEW: 'patient' or 'doctor'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Determine which API endpoint to call
    const loginUrl = role === 'patient' 
      ? `${API_URL}/auth/login` 
      : `${API_URL}/auth/doctor/login`;

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); 
      
      // 2. Redirect based on role
      if (data.user.role === 'doctor') {
        navigate('/doctor-portal');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          
          {/* === NEW ROLE TOGGLE === */}
          <div className="role-toggle">
            <label>
              <input 
                type="radio" 
                name="role" 
                value="patient"
                checked={role === 'patient'} 
                onChange={() => setRole('patient')} 
              />
              <span>Patient</span>
            </label>
            <label>
              <input 
                type="radio" 
                name="role" 
                value="doctor"
                checked={role === 'doctor'} 
                onChange={() => setRole('doctor')} 
              />
              <span>Doctor</span>
            </label>
          </div>
          {/* === END NEW TOGGLE === */}

          <input 
            type="email" 
            placeholder="Your Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="btn">Login as {role}</button>
        </form>
         <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          No Patient account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}