import { useEffect, useState } from 'react';
import { Form, Input, message, Modal } from 'antd';
import { getDatabase, push, ref, set } from 'firebase/database';
import { getAuth, User } from 'firebase/auth';

type CreateChatRoomModalProps = {
  visible: boolean;
  onCreated: (values: FormInputValues) => void;
  onClose: () => void;
};

type FormInputValues = {
  name: string;
  desc?: string;
};

const createChatRoom = (name: string, desc?: string) => {
  const db = getDatabase();
  const chatRoomsRef = ref(db, 'chatRooms');
  const newRoomRef = push(chatRoomsRef);

  const auth = getAuth();
  const user = auth.currentUser as User;
  const roomData = {
    id: newRoomRef.key,
    name: name,
    description: desc || '',
    createdBy: {
      uid: user.uid,
      time: new Date().toUTCString(),
    },
  };

  return set(newRoomRef, roomData);
};

function CreateChatRoomModal(props: CreateChatRoomModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.resetFields();
  }, [props.visible]);

  const handleConfirm = () => form.submit();
  const handleSubmit = (values: FormInputValues) => {
    setLoading(true);

    // 채팅방 생성
    createChatRoom(values.name, values.desc)
      .then(() => {
        setLoading(false);
        props.onCreated(values);
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.message);
      });
  };

  return (
    <Modal
      title="채팅방 생성"
      okText="생성"
      confirmLoading={loading}
      forceRender={true}
      visible={props.visible}
      onCancel={props.onClose}
      onOk={handleConfirm}
    >
      <Form layout="vertical" requiredMark="optional" form={form} onFinish={handleSubmit}>
        <Form.Item label="방 이름" name="name" rules={[{ required: true, message: '방 이름을 입력하세요.' }]}>
          <Input autoFocus />
        </Form.Item>
        <Form.Item label="설명" name="desc">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export type { CreateChatRoomModalProps, FormInputValues };
export default CreateChatRoomModal;
