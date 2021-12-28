import { PlusCircleFilled } from '@ant-design/icons';
import { useState } from 'react';
import { Menu } from 'antd';
import { MenuGroup, MenuItem } from '../styles';
import CreateChatRoomModal, { FormInputValues } from './CreateChatRoomModal';

type ChatRoom = {
  id: string;
  name: string;
  desc?: string;
};

let count = 1;

function ChatRooms() {
  const [modalVisible, setModalVisible] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  const handleClickAdd = () => setModalVisible(true);
  const handleClose = () => setModalVisible(false);
  const handleCreated = (values: FormInputValues) => {
    setRooms([
      ...rooms,
      {
        id: '' + count++,
        name: values.name,
        desc: values.desc,
      },
    ]);
    setModalVisible(false);
  };

  return (
    <>
      <Menu theme="dark" selectable={false}>
        <MenuGroup title="채팅방 목록" icon={<PlusCircleFilled />} onClick={handleClickAdd}>
          {rooms.map((room) => (
            <MenuItem key={room.id}>{room.name}</MenuItem>
          ))}
        </MenuGroup>
      </Menu>

      <CreateChatRoomModal visible={modalVisible} onCreated={handleCreated} onClose={handleClose}></CreateChatRoomModal>
    </>
  );
}

export default ChatRooms;
