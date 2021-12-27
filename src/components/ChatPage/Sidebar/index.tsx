import { Layout } from 'antd';
import UserInfo from './UserInfo';

function Sidebar() {
  return (
    <Layout.Sider style={{ color: '#dce8f3' }}>
      <UserInfo></UserInfo>
    </Layout.Sider>
  );
}

export default Sidebar;
