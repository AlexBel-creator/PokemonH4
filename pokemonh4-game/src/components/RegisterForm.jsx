import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/auth/register', {
        username,
        email,
        password,
      });
      console.log('Redirecting to login');
      navigate('/login');
    } catch (err) {
      setError('Failed to register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 flex items-center justify-center">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-lg shadow-2xl"
        style={{ width: '320px' }}
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Sign Up
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
