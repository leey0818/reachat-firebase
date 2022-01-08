import { Col, Layout, Row } from 'antd';
import Search from 'antd/lib/input/Search';
import { useState } from 'react';
import styled from 'styled-components';
import MessageContent from './MessageContent';
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';

const Content = styled(Layout.Content)`
  display: flex;
  flex-direction: column;
  margin: 16px;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 16px;
  padding: 24px 24px 8px;
  background-color: #fff;
`;

function MainContent() {
  const [searchText, setSearchText] = useState<string>('');

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  return (
    <Layout>
      <MessageHeader></MessageHeader>
      <Content>
        <Row justify="end">
          <Col lg={8} md={12} sm={16} xs={24}>
            <Search placeholder="메세지 검색" allowClear={true} onSearch={handleSearch}></Search>
          </Col>
        </Row>
        <MessageContainer>
          <MessageContent searchText={searchText}></MessageContent>
          <MessageForm></MessageForm>
        </MessageContainer>
      </Content>
    </Layout>
  );
}

export default MainContent;
