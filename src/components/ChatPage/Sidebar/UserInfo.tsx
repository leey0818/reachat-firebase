import styled from 'styled-components';
import { Avatar, Dropdown, Menu, message, Modal } from 'antd';
import { DownOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { getAuth, signOut } from 'firebase/auth';
import { useAppSelector } from '@store/hooks';
import ProfileUploadModal from './ProfileUploadModal';
import { useState } from 'react';

type UserAvatarProps = {
  name?: string;
  src?: string;
};

const UserInfoBox = styled.div`
  margin: 16px 14px;
`;

const DropdownText = styled.a`
  color: inherit;
  :hover {
    color: inherit;
  }
`;

const UserAvatar = (props: UserAvatarProps) => {
  const style = { marginRight: 6 };

  if (props.src) {
    return <Avatar style={style} src={props.src}></Avatar>;
  } else if (props.name) {
    const firstWord = props.name.charAt(0).toUpperCase();
    return <Avatar style={style}>{firstWord}</Avatar>;
  } else {
    return <Avatar style={style} icon={<UserOutlined />}></Avatar>;
  }
};

function UserInfo() {
  const user = useAppSelector((state) => state.user.currentUser);
  const userName = user?.name || '';
  const avatarUrl = user?.avatar || '';
  const [modalVisible, setModalVisible] = useState(false);

  const handleClickSignOut = () => {
    Modal.confirm({
      title: '로그아웃하시겠습니까?',
      content: '로그아웃 후 로그인 페이지로 이동합니다.',
      icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
      onOk: () => {
        const auth = getAuth();
        return signOut(auth);
      },
    });
  };

  const handleClickChangeImage = () => {
    setModalVisible(true);
  };

  const handleModalChanged = () => {
    message.success('변경되었습니다.');
    setModalVisible(false);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <UserInfoBox>
      <UserAvatar src={avatarUrl} name={userName}></UserAvatar>

      <ProfileUploadModal visible={modalVisible} onChanged={handleModalChanged} onClose={handleModalClose}></ProfileUploadModal>

      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="setimage">
              <a onClick={handleClickChangeImage}>프로필 사진 변경</a>
            </Menu.Item>
            <Menu.Item key="signout">
              <a onClick={handleClickSignOut}>로그아웃</a>
            </Menu.Item>
          </Menu>
        }
        trigger={['click']}
      >
        <DropdownText>
          {userName} <DownOutlined />
        </DropdownText>
      </Dropdown>
    </UserInfoBox>
  );
}

export default UserInfo;
