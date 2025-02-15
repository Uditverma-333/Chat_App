import { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import SignupForm from '../components/Auth/SignupForm';

export default function HomePage() {
  const [activeForm, setActiveForm] = useState(null);

  const handleToggleForm = (formType) => {
    if (activeForm === formType) {
      setActiveForm(null); 
    } else {
      setActiveForm(formType); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">
          Welcome to the Chat App!
        </h1>

        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => handleToggleForm('login')}
            className={`px-6 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              activeForm === 'login'
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-400 hover:bg-gray-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => handleToggleForm('signup')}
            className={`px-6 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              activeForm === 'signup'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 hover:bg-gray-500'
            }`}
          >
            Sign Up
          </button>
        </div>

        {activeForm === 'login' && <LoginForm />}
        {activeForm === 'signup' && <SignupForm />}
      </div>
    </div>
  );
}
