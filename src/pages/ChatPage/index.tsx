import { Layout } from 'antd';
import Sidebar from '@components/ChatPage/Sidebar';
import MainContent from '@components/ChatPage/MainContent';

function ChatPage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar></Sidebar>
      <MainContent></MainContent>
    </Layout>
  );
}

export default ChatPage;
