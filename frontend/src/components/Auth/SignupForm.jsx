import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/api';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await signup(username, email, password); 
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/chat');
    } catch (error) {
      setError('Signup failed. Please try again.'); 
    }
  };

  return (
    <form onSubmit={handleSignup} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-sm">Username</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg w-full">
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
