import { useCallback, useEffect, useState } from 'react';
import { getDatabase, off, onChildAdded, onChildChanged, onChildRemoved, ref } from 'firebase/database';
import { PlusCircleFilled } from '@ant-design/icons';
import { Menu } from 'antd';
import { MenuGroup, MenuItem } from '../styles';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setCurrentRoom } from '@store/modules/chatRoom';
import CreateChatRoomModal from './CreateChatRoomModal';

type ChatRoom = {
  id: string;
  name: string;
  desc?: string;
};

function ChatRooms() {
  const dispatch = useAppDispatch();
  const curRoomId = useAppSelector((state) => state.chatRoom.currentRoom?.id);
  const [modalVisible, setModalVisible] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const db = getDatabase();
    const roomsRef = ref(db, 'chatRooms');

    onChildAdded(roomsRef, (snapshot) => {
      const data = snapshot.val();
      addChatRoom({
        id: data.id,
        name: data.name,
        desc: data.description,
      });
    });
    onChildChanged(roomsRef, (snapshot) => {
      const data = snapshot.val();
      const roomInfo = {
        id: data.id,
        name: data.name,
        desc: data.description,
      };
      updateChatRoom(roomInfo.id, roomInfo);
    });
    onChildRemoved(roomsRef, (snapshot) => {
      const data = snapshot.val();
      removeChatRoom(data.id);
    });

    return () => {
      setRooms([]);
      off(roomsRef);
    };
  }, []);

  // Select first chat room (use debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (rooms.length && !curRoomId) {
        setCurrentRoomInfo(rooms[0].id);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [rooms]);

  const addChatRoom = (room: ChatRoom) => {
    setRooms((oldRooms) => [room, ...oldRooms]);
  };

  const updateChatRoom = (roomId: string, roomInfo: ChatRoom) => {
    setRooms((oldRooms) =>
      oldRooms.reduce((acc, o) => {
        if (o.id === roomId) {
          acc.push({ ...roomInfo });
        } else {
          acc.push(o);
        }
        return acc;
      }, [] as ChatRoom[])
    );
  };

  const removeChatRoom = (roomId: string) => {
    setRooms((oldRooms) => oldRooms.filter((o) => o.id !== roomId));
  };

  const setCurrentRoomInfo = useCallback(
    (key: string) => {
      const room = rooms.find((o) => o.id === key);
      if (room) {
        dispatch(
          setCurrentRoom({
            id: room.id,
            name: room.name,
            description: room.desc,
          })
        );
      }
    },
    [rooms]
  );

  const handleClickAdd = () => setModalVisible(true);
  const handleClose = () => setModalVisible(false);
  const handleCreated = () => setModalVisible(false);
  const handleSelect = ({ key }: { key: string }) => setCurrentRoomInfo(key);

  return (
    <>
      <Menu theme="dark" onSelect={handleSelect} selectedKeys={curRoomId ? [curRoomId] : undefined}>
        <MenuGroup title="채팅방 목록" icon={<PlusCircleFilled />} onClick={handleClickAdd}>
          {rooms.map((room) => (
            <MenuItem key={room.id}># {room.name}</MenuItem>
          ))}
        </MenuGroup>
      </Menu>

      <CreateChatRoomModal visible={modalVisible} onCreated={handleCreated} onClose={handleClose}></CreateChatRoomModal>
    </>
  );
}

export default ChatRooms;
