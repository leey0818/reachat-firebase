import { Button, Card, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
      <Card style={{ width: 500 }}>
        <Typography.Title style={{ textAlign: 'center' }}>로그인</Typography.Title>
        <Form layout="vertical">
          <Form.Item label="Email">
            <Input></Input>
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password></Input.Password>
          </Form.Item>
          <div>
            <Button type="primary" htmlType="submit" block>
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
