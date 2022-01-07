import { ChangeEvent, ChangeEventHandler, DragEvent, KeyboardEvent, useCallback, useRef, useState } from 'react';
import { Avatar, Button, Col, Comment, Form, Input, message, Row } from 'antd';
import { PictureOutlined, UserOutlined } from '@ant-design/icons';
import { getDatabase, push, ref, serverTimestamp } from 'firebase/database';
import { useAppSelector } from '@store/hooks';
import md5 from 'md5';
import { getDownloadURL, getStorage, ref as storageRef, uploadBytesResumable } from 'firebase/storage';

type MessageType = 'text' | 'image';

type EditorProps = {
  value: string;
  percent: string;
  submitting: boolean;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onSubmit: () => void;
  onUploadImage: (file: File) => void;
};

function Editor(props: EditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePressEnter = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!evt.shiftKey) {
      evt.preventDefault();
      props.onSubmit();
    }
  };

  const handleClickUploadFile = () => {
    fileRef.current?.click();
  };

  const handleChangeFile = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;
    if (files?.length) {
      const file = files[0];
      props.onUploadImage(file);
    }
    evt.target.value = '';
  };

  const handleDrop = (evt: DragEvent<HTMLTextAreaElement>) => {
    //TODO
    console.log(evt.dataTransfer.files);
    evt.preventDefault();
  };

  return (
    <>
      <Form.Item extra="Enter: 전송, Shift+Enter: 줄바꿈">
        <Input.TextArea
          style={{ resize: 'none' }}
          rows={3}
          value={props.value}
          onChange={props.onChange}
          onPressEnter={handlePressEnter}
          onDrop={handleDrop}
        ></Input.TextArea>
      </Form.Item>
      <div>
        <Row justify="space-between">
          <Col>
            <Button
              shape="circle"
              icon={<PictureOutlined />}
              disabled={props.submitting}
              onClick={handleClickUploadFile}
            ></Button>
            <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={handleChangeFile} />
          </Col>
          <Col>
            <Button htmlType="submit" type="primary" loading={props.submitting} onClick={props.onSubmit}>
              {props.percent ? `Uploading... ${props.percent}%` : 'Send'}
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
}

const createNewMessage = (roomId: string, uid: string, message: string, type: MessageType) => {
  const db = getDatabase();
  const msgRef = ref(db, `messages/${roomId}`);
  const msgValue = {
    timestamp: serverTimestamp(),
    user: uid,
    message,
    type,
  };

  return push(msgRef, msgValue);
};

function MessageForm() {
  const user = useAppSelector((state) => state.user.currentUser);
  const chatRoom = useAppSelector((state) => state.chatRoom.currentRoom);
  const avatarUrl = user?.avatar;

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState('');

  const handleChange = (evt: ChangeEvent<HTMLTextAreaElement>) => setValue(evt.target.value);
  const handleSubmit = useCallback(() => {
    if (value.trim() === '') return;
    if (!chatRoom || !user) return;

    setLoading(true);

    createNewMessage(chatRoom.id, user.uid, value.trim(), 'text')
      .then(() => setValue(''))
      .catch((error) => message.error(error.message))
      .finally(() => setLoading(false));
  }, [value]);

  const handleUploadImage = (file: File) => {
    if (!chatRoom || !user) return;
    if (!file.type.startsWith('image/')) return message.warn('이미지 파일만 업로드할 수 있습니다.');
    if (file.size > 5 * 1024 * 1024) return message.warn('5MB 이하의 이미지 파일만 업로드할 수 있습니다.');

    const md5Name = md5(file.lastModified + '_' + file.name);
    const storage = getStorage();
    const fileRef = storageRef(storage, `messages/${chatRoom?.id}/${md5Name}`);

    setLoading(true);

    // upload file
    const uploadTask = uploadBytesResumable(fileRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPercent(progress.toFixed(0));
      },
      (error) => {
        setLoading(false);
        setUploadPercent('');
        message.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((imageUrl) => createNewMessage(chatRoom.id, user.uid, imageUrl, 'image'))
          .finally(() => {
            setLoading(false);
            setUploadPercent('');
          });
      }
    );
  };

  return (
    <Comment
      avatar={avatarUrl ? <Avatar src={avatarUrl}></Avatar> : <Avatar icon={<UserOutlined />}></Avatar>}
      content={
        <Editor
          value={value}
          percent={uploadPercent}
          submitting={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onUploadImage={handleUploadImage}
        ></Editor>
      }
    ></Comment>
  );
}

export default MessageForm;
