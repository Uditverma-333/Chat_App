import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import { useEffect, useState } from 'react';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';

function App() {
  const [user, setUser] = useState(null); // User state for authentication

  useEffect(() => {
    // Check for user authentication (get from localStorage or API)
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={user ? <ChatPage /> : <HomePage />} />
    </Routes>
  );
}

export default App;
