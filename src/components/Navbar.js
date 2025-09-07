import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = JSON.parse(localStorage.getItem('user'))?.username;

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

  return (
    <nav>
      <Link to="/">Shop</Link>
      <Link to="/cart">Cart</Link>
      {!token ? (
        <>
          <Link to="/signup">Signup</Link>
          <Link to="/login">Login</Link>
        </>
      ) : (
        <>
          <span style={{ marginLeft: 'auto', marginRight: 8 }}>Hi, {username}</span>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}
