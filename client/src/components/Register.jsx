import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../App.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer'); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/register', { username, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.role);
      localStorage.setItem('username', username);
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <p style={{color: 'red', fontSize: '0.9rem'}}>{error}</p>}
        
        <form onSubmit={handleRegister}>
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
          
          <select 
            className="auth-input"
            value={role} onChange={(e) => setRole(e.target.value)}
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="auth-btn">Sign Up</button>
        </form>

        <p style={{marginTop: '15px', fontSize: '0.9rem', color: '#666'}}>
          Already have an account? <Link to="/login" style={{color: '#4f46e5', fontWeight: 'bold'}}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;