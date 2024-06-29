import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '.././EgradTutorFrontEnd/AuthContext';
const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Login form submitted with:', { email, password });

    try {
      const response = await axios.post('http://localhost:5001/Login/login', { email, password });
      const { token,user_Id, role } = response.data;
      // console.log('Login successful:', { token, role });

      localStorage.setItem('token', token);
      if (!user_Id) {
        console.error('userId is undefined in response data');  // Debugging statement
        alert('Login failed, please try again');
        return;
      }

      // Use the login function from AuthContext
      login(token, user_Id, role);
      // Navigate based on role
      if (role === 'User') {
        // console.log('Navigating to user dashboard');
        navigate(`/user-dashboard/${user_Id}`);
      } else if (role === 'Admin') {
        // console.log('Admin access is not allowed on this page');
        alert('You dont have access to this page');
      } else if (role === 'SuperAdmin') {
        // console.log('Super Admin access is not allowed on this page');
        alert('You dont have access to this page');
      } else {
        console.log('Unauthorized role:', role);
        alert('Unauthorized');
      }
   
    } catch (error) {
      console.error('Error during login:', error);
      alert('Invalid email or password');
    }
  };

  return (
    <div className="container mt-4">
      <h1>User Login</h1>
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

export default UserLogin;
