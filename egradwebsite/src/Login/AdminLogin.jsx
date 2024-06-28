import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/Login/login', { email, password });
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      if (role === 'admin') {
        navigate('/admin-dashboard');
      }else if (role === 'User') {
        console.log('User access is not allowed on this page');
        alert('You dont have access to this page');
      } else if (role === 'SuperAdmin') {
        console.log('Super Admin access is not allowed on this page');
        alert('You dont have access to this page');
      } else {
        alert('Unauthorized');
      }
    } catch (error) {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
