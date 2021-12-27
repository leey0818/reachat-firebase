import { Layout } from 'antd';
import Sidebar from '@components/ChatPage/Sidebar';

const { Content } = Layout;

function ChatPage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar></Sidebar>
      <Layout>
        <Content>Content</Content>
      </Layout>
    </Layout>
  );
}

export default ChatPage;
