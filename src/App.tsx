import { useEffect } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import styled from 'styled-components';
import ChatPage from '@pages/ChatPage';
import LoginPage from '@pages/LoginPage';
import SignUpPage from '@pages/SignUpPage';
import './App.css';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { clearCurrentUser, setCurrentUser } from '@store/modules/user';
import { clearCurrentRoom } from '@store/modules/chatRoom';

const SpinContainer = styled.div`
  display: flex;
  height: 120px;
  justify-content: center;
  align-items: center;
`;

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
            email: user.email as string,
            name: user.displayName,
            avatar: user.photoURL,
          })
        );
        navigate('/');
      } else {
        dispatch(clearCurrentUser());
        dispatch(clearCurrentRoom());
        navigate('/login');
      }
    });
  }, []);

  if (initializing) {
    return (
      <SpinContainer>
        <Spin tip="Loading..." size="large" indicator={<LoadingOutlined />}></Spin>
      </SpinContainer>
    );
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
