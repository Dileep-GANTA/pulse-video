import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../App.css'; // Import styles

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.role);
      localStorage.setItem('username', username);
      
      navigate('/dashboard');
      window.location.reload(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        {error && <p style={{color: 'red', fontSize: '0.9rem'}}>{error}</p>}
        
        <form onSubmit={handleLogin}>
          <input 
            type="text" placeholder="Username" 
            className="auth-input"
            value={username} onChange={(e) => setUsername(e.target.value)} 
            required
          />
          <input 
            type="password" placeholder="Password" 
            className="auth-input"
            value={password} onChange={(e) => setPassword(e.target.value)} 
            required
          />
          <button type="submit" className="auth-btn">Sign In</button>
        </form>
        
        <p style={{marginTop: '15px', fontSize: '0.9rem', color: '#666'}}>
          New here? <Link to="/register" style={{color: '#4f46e5', fontWeight: 'bold'}}>Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;