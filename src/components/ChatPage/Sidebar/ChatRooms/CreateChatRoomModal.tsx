import { Form, Input, Modal } from 'antd';
import { useEffect } from 'react';

type CreateChatRoomModalProps = {
  visible: boolean;
  onCreated: (values: FormInputValues) => void;
  onClose: () => void;
};

type FormInputValues = {
  name: string;
  desc?: string;
};

function CreateChatRoomModal(props: CreateChatRoomModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [props.visible]);

  const handleConfirm = () => form.submit();
  const handleSubmit = (values: FormInputValues) => {
    console.log(values);
    props.onCreated(values);
  };

  return (
    <Modal title="채팅방 생성" forceRender={true} visible={props.visible} onCancel={props.onClose} onOk={handleConfirm}>
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
