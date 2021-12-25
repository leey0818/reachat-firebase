import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rule } from 'antd/lib/form';
import { Button, Card, Form, Input, message, Typography } from 'antd';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

type FormInputValues = {
  email: string;
  password: string;
};

const getFormRequiredRule = (name: string): Rule => ({
  required: true,
  message: `${name}을 입력하세요.`,
});

function LoginPage() {
  const emailRef = useRef<Input>(null);
  const passwordRef = useRef<Input>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: FormInputValues) => {
    setLoading(true);

    // login user
    const auth = getAuth();
    signInWithEmailAndPassword(auth, values.email, values.password).catch((error) => {
      setLoading(false);

      if (error.code === 'auth/user-not-found') {
        form.setFields([{ name: 'email', errors: ['사용자가 존재하지 않습니다.'] }]);
        emailRef.current?.focus();
      } else if (error.code === 'auth/wrong-password') {
        form.setFields([{ name: 'password', errors: ['패스워드가 일치하지 않습니다.'] }]);
        passwordRef.current?.focus();
      } else if (error.code === 'auth/too-many-requests') {
        message.error('로그인을 너무 많이 시도했습니다. 잠시 후 다시 이용해 주세요.');
      } else {
        message.error(`${error.message} (${error.code})`);
      }
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
      <Card style={{ width: 500 }}>
        <Typography.Title style={{ textAlign: 'center' }}>로그인</Typography.Title>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[getFormRequiredRule('이메일')]}>
            <Input type="email" ref={emailRef}></Input>
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[getFormRequiredRule('패스워드')]}>
            <Input.Password ref={passwordRef}></Input.Password>
          </Form.Item>
          <div>
            <Button type="primary" htmlType="submit" block={true} loading={loading}>
              Login
            </Button>
            <Link to="/signup">
              <Typography.Text type="secondary">계정이 없으신가요?</Typography.Text>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default LoginPage;
