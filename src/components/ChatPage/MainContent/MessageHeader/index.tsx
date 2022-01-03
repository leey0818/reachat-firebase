import { StarOutlined, UnlockOutlined } from '@ant-design/icons';
import { useAppSelector } from '@store/hooks';
import { Avatar, Col, Layout, Row, Space } from 'antd';
import styled from 'styled-components';

const ShadowHeader = styled(Layout.Header)`
  background-color: #fff;
  box-shadow: 0 0 5px 0 #b0b6bb;
`;

const Title = styled.h1`
  margin: 0;
`;

const SubTitle = styled.small`
  margin-left: 5px;
  color: #888;
`;

function MessageHeader() {
  const curRoom = useAppSelector((state) => state.chatRoom.currentRoom);

  return (
    <ShadowHeader>
      <Row justify="space-between">
        <Col>
          <Space size={6}>
            <UnlockOutlined />
            <StarOutlined />
            <Title>
              {curRoom?.name}
              {curRoom?.description && <SubTitle>{curRoom.description}</SubTitle>}
            </Title>
          </Space>
        </Col>
        <Col>
          <Avatar></Avatar>
        </Col>
      </Row>
    </ShadowHeader>
  );
}

export default MessageHeader;
