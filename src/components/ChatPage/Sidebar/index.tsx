import { Layout } from 'antd';
import UserInfo from './UserInfo';
import ChatRooms from './ChatRooms';

function Sidebar() {
  return (
    <Layout.Sider style={{ color: '#dce8f3' }}>
      <UserInfo></UserInfo>
      <ChatRooms></ChatRooms>
    </Layout.Sider>
  );
}

export default Sidebar;
