import { Button, Card, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';

function SignUp() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
      <Card style={{ width: 500 }}>
        <Typography.Title style={{ textAlign: 'center' }}>회원가입</Typography.Title>
        <Form layout="vertical">
          <Form.Item label="Email">
            <Input></Input>
          </Form.Item>
          <Form.Item label="Name">
            <Input></Input>
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password></Input.Password>
          </Form.Item>
          <Form.Item label="Password Confirm">
            <Input.Password></Input.Password>
          </Form.Item>
          <div>
            <Button type="primary" block>
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
