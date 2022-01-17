import { useCallback, useEffect, useState } from 'react';
import { Menu } from 'antd';
import { getDatabase, onChildAdded, ref } from 'firebase/database';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setCurrentRoom } from '@store/modules/chatRoom';
import { MenuGroup, MenuItem } from '../styles';

type User = {
  uid: string;
  name: string;
};

function DirectMessages() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const currentRoom = useAppSelector((state) => state.chatRoom.currentRoom);
  const [users, setUsers] = useState<User[]>([]);
  const [curRoomId, setCurRoomId] = useState('');

  const addUser = (user: User) => {
    setUsers((oldUsers) => [...oldUsers, user]);
  };

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, 'users');
    const unsubscribe = onChildAdded(usersRef, (snapshot) => {
      const data = snapshot.val();

      if (currentUser?.uid !== snapshot.key) {
        addUser({
          uid: snapshot.key as string,
          name: data.name,
        });
      }
    });

    return () => {
      unsubscribe();
      setUsers([]);
    };
  }, []);

  useEffect(() => {
    if (currentRoom?.private) {
      const otherUserId = currentRoom.id.split('/').find((s) => s !== currentUser?.uid);
      setCurRoomId(otherUserId || '');
    } else {
      setCurRoomId('');
    }
  }, [currentRoom]);

  const setCurrentRoomInfo = useCallback(
    (key: string) => {
      const otherUser = users.find((o) => o.uid === key);
      if (otherUser && currentUser) {
        const otherUserId = otherUser.uid;
        const curUserId = currentUser.uid;
        const roomId = otherUserId > curUserId ? `${otherUserId}/${curUserId}` : `${curUserId}/${otherUserId}`;
        dispatch(
          setCurrentRoom({
            id: roomId,
            name: otherUser.name,
            private: true,
          })
        );
      }
    },
    [users]
  );

  const handleSelect = ({ key }: { key: string }) => setCurrentRoomInfo(key);

  return (
    <Menu theme="dark" onSelect={handleSelect} selectedKeys={curRoomId ? [curRoomId] : undefined}>
      <MenuGroup title="Direct Messages">
        {users.map((user) => (
          <MenuItem key={user.uid}>@{user.name}</MenuItem>
        ))}
      </MenuGroup>
    </Menu>
  );
}

export default DirectMessages;
