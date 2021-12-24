import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ChatPage from '@pages/ChatPage';
import LoginPage from '@pages/LoginPage';
import './App.css';
import './firebase';

function App() {
  return (
    <BrowserRouter>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>

      <Routes>
        <Route path="/" element={<ChatPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
