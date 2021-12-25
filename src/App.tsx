import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ChatPage from '@pages/ChatPage';
import LoginPage from '@pages/LoginPage';
import SignUpPage from '@pages/SignUpPage';
import './App.css';
import './firebase';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
      } else {
        navigate('/login');
      }
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<ChatPage />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/signup" element={<SignUpPage />}></Route>
    </Routes>
  );
}

export default App;
