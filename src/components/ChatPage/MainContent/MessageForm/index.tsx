import { ChangeEvent, ChangeEventHandler, KeyboardEvent, useCallback, useState } from 'react';
import { Avatar, Button, Col, Comment, Form, Input, message, Row } from 'antd';
import { PaperClipOutlined, UserOutlined } from '@ant-design/icons';
import { getDatabase, push, ref, serverTimestamp } from 'firebase/database';
import { useAppSelector } from '@store/hooks';

type EditorProps = {
  value: string;
  submitting: boolean;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onSubmit: () => void;
};

function Editor(props: EditorProps) {
  const handlePressEnter = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.ctrlKey || evt.metaKey) {
      evt.preventDefault();
      props.onSubmit();
    }
  };

  return (
    <>
      <Form.Item extra="Enter: 줄바꿈, Ctrl+Enter: 전송">
        <Input.TextArea
          style={{ resize: 'none' }}
          rows={4}
          value={props.value}
          onChange={props.onChange}
          onPressEnter={handlePressEnter}
        ></Input.TextArea>
      </Form.Item>
      <div>
        <Row justify="space-between">
          <Col>
            <Button shape="circle" icon={<PaperClipOutlined />} disabled={props.submitting}></Button>
          </Col>
          <Col>
            <Button htmlType="submit" type="primary" loading={props.submitting} onClick={props.onSubmit}>
              Send
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
}

function MessageForm() {
  const user = useAppSelector((state) => state.user.currentUser);
  const chatRoom = useAppSelector((state) => state.chatRoom.currentRoom);
  const avatarUrl = user?.avatar;

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (evt: ChangeEvent<HTMLTextAreaElement>) => setValue(evt.target.value);
  const handleSubmit = useCallback(() => {
    if (value.trim() === '') return;
    if (!chatRoom || !user) return;

    const db = getDatabase();
    const msgRef = ref(db, `messages/${chatRoom.id}`);
    const msgValue = {
      timestamp: serverTimestamp(),
      message: value.trim(),
      user: user.uid,
    };

    setLoading(true);

    push(msgRef, msgValue)
      .then(() => setValue(''))
      .catch((error) => message.error(error.message))
      .finally(() => setLoading(false));
  }, [value]);

  return (
    <Comment
      avatar={avatarUrl ? <Avatar src={avatarUrl}></Avatar> : <Avatar icon={<UserOutlined />}></Avatar>}
      content={<Editor value={value} submitting={loading} onChange={handleChange} onSubmit={handleSubmit}></Editor>}
    ></Comment>
  );
}

export default MessageForm;
