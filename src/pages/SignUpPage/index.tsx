import { Button, Card, Form, Input, message, Typography } from 'antd';
import { Rule } from 'antd/lib/form';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

type FormInputValues = {
  email: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
};

const createFormRulesWithRequired = (name: string, ...rules: Rule[]): Rule[] => [
  { required: true, message: `${name}을 입력하세요.` },
  ...rules,
];

function SignUp() {
  const navigate = useNavigate();
  const emailRef = useRef<Input>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: FormInputValues) => {
    setLoading(true);

    // create user to firebase
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        console.log(userCredential);
        message.success('정상적으로 가입되었습니다.');
        navigate('/login');
      })
      .catch((error) => {
        setLoading(false);

        if (error.code === 'auth/email-already-in-use') {
          form.setFields([{ name: 'email', errors: ['이미 등록된 이메일입니다. 다른 이메일을 사용해 주세요.'] }]);
          emailRef.current?.focus();
        } else {
          message.error(`${error.message} (${error.code}))`);
        }
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
      <Card style={{ width: 500 }}>
        <Typography.Title style={{ textAlign: 'center' }}>회원가입</Typography.Title>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={createFormRulesWithRequired('이메일', {
              type: 'email',
              message: '이메일 형식으로 입력하세요.',
            })}
          >
            <Input type="email" ref={emailRef}></Input>
          </Form.Item>
          <Form.Item label="Name" name="nickname" rules={createFormRulesWithRequired('닉네임')}>
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={createFormRulesWithRequired('비밀번호', { min: 8, message: '최소 ${min}자리 이상 입력해야 합니다.' })}
          >
            <Input.Password></Input.Password>
          </Form.Item>
          <Form.Item
            label="Password Confirm"
            name="passwordConfirm"
            rules={createFormRulesWithRequired('비밀번호', ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
              },
            }))}
          >
            <Input.Password></Input.Password>
          </Form.Item>
          <div>
            <Button type="primary" block={true} loading={loading} onClick={() => form.submit()}>
              Submit
            </Button>
            <Link to="/login">
              <Typography.Text type="secondary">이미 계정이 있으신가요?</Typography.Text>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default SignUp;
