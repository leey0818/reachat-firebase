import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ChatPage from '@pages/ChatPage';
import LoginPage from '@pages/LoginPage';
import SignUpPage from '@pages/SignUpPage';
import './App.css';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setCurrentUser } from '@store/modules/user';

function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const initializing = useAppSelector((state) => state.user.initializing);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            avatar: user.photoURL,
          })
        );
        navigate('/');
      } else {
        dispatch(setCurrentUser(null));
        navigate('/login');
      }
    });
  }, []);

  if (initializing) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<ChatPage />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/signup" element={<SignUpPage />}></Route>
    </Routes>
  );
}

export default App;
