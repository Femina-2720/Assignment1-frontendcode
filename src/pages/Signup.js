import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr(null);

    try {
      console.log("📤 Sending signup request:", { username, email, password }); // Debug
      const res = await API.post('/auth/signup', { username, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (error) {
      console.error("❌ Signup error:", error.response?.data || error.message);
      setErr(error.response?.data?.error || 'Signup failed');
    }
  }

  return (
    <div className="card">
      <h2>Signup</h2>
      <form onSubmit={submit}>
        <div>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Enter your Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Create account</button>
        </div>
        {err && <div className="small" style={{ color: 'crimson' }}>{err}</div>}
      </form>
    </div>
  );
}
