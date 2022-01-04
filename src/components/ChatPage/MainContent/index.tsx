import { Layout } from 'antd';
import styled from 'styled-components';
import MessageContent from './MessageContent';
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';

const Content = styled(Layout.Content)`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 16px;
  padding: 24px 24px 8px;
  background-color: #fff;
`;

function MainContent() {
  return (
    <Layout>
      <MessageHeader></MessageHeader>
      <Content>
        <MessageContent></MessageContent>
        <MessageForm></MessageForm>
      </Content>
    </Layout>
  );
}

export default MainContent;
