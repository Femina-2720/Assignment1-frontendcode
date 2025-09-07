import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    try {
      const res = await API.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Merge anonymous local cart into server cart if present
      const anon = JSON.parse(localStorage.getItem('anon_cart') || '[]');
      if (anon.length > 0) {
        await API.post('/cart/merge', { anonymousCart: anon });
        localStorage.removeItem('anon_cart');
      }

      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        {err && <div className="small" style={{ color: 'crimson' }}>{err}</div>}
      </form>
    </div>
  );
}
