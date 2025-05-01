import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import SkillSelection from './components/SkillSelection';
import Profile from './components/Profile';
import './App.css';

function App() {
  const [auth, setAuth] = useState({
    userId: null,
    userData: null
  });

  const handleAuth = (userId, userData) => {
    setAuth({ 
      userId: Number(userId),
      userData: {
        ...userData,
        id: Number(userId)
      }
    });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route 
          path="/login" 
          element={auth.userId ? 
            <Navigate to="/profile" replace /> : 
            <LoginForm onLogin={handleAuth} />} 
        />
        
        <Route path="/register" element={<RegistrationForm onUserRegistered={handleAuth} />} />
        
        <Route 
          path="/skills" 
          element={auth.userId ? 
            <SkillSelection userId={auth.userId} userData={auth.userData} /> : 
            <Navigate to="/login" replace />} 
        />
        
        <Route 
          path="/profile" 
          element={auth.userId ? 
            <Profile userId={auth.userId} userData={auth.userData} /> : 
            <Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;