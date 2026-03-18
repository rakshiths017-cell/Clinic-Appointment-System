import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div>
        <Link to="/" className="navbar-brand">ClinicApp</Link>
      </div>
      <div className="navbar-links">
        {token && user ? (
          <>
            <span className="navbar-user">Welcome, {user.name}</span>
            {user.role === 'patient' && (
              <Link to="/dashboard">My Dashboard</Link>
            )}
            {user.role === 'doctor' && (
              <Link to="/doctor-portal">Doctor Portal</Link>
            )}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}