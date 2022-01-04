import { Layout } from 'antd';
import styled from 'styled-components';
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

const MessageWrap = styled.div`
  height: 0;
  flex: 1 1 auto;
  overflow-y: auto;
`;

function MainContent() {
  return (
    <Layout>
      <MessageHeader></MessageHeader>
      <Content>
        <MessageWrap></MessageWrap>
        <MessageForm></MessageForm>
      </Content>
    </Layout>
  );
}

export default MainContent;
