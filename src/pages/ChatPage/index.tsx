import { Layout } from 'antd';
import Sidebar from '@components/ChatPage/Sidebar';
import MainContent from '@components/ChatPage/MainContent';

function ChatPage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar></Sidebar>
      <Layout>
        <MainContent></MainContent>
      </Layout>
    </Layout>
  );
}

export default ChatPage;
