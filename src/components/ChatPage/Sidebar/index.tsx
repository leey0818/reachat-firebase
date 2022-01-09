import { Layout } from 'antd';
import UserInfo from './UserInfo';
import ChatRooms from './ChatRooms';
import DirectMessages from './DirectMessages';

function Sidebar() {
  return (
    <Layout.Sider style={{ color: '#dce8f3' }}>
      <UserInfo></UserInfo>
      <ChatRooms></ChatRooms>
      <DirectMessages></DirectMessages>
    </Layout.Sider>
  );
}

export default Sidebar;
