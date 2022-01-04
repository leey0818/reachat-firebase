import moment from 'moment';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { get, getDatabase, off, onChildAdded, ref } from 'firebase/database';
import { Avatar, Comment, Tooltip } from 'antd';
import { useAppSelector } from '@store/hooks';

type ChatUser = {
  key: string;
  name: string;
  avatar: string;
};

type ChatMessage = {
  key: string;
  user: ChatUser;
  message: string;
  timestamp: number;
};

const MessageWrap = styled.div`
  height: 0;
  flex: 1 1 auto;
  overflow-y: auto;
  scroll-behavior: smooth;
`;

function MessageContent() {
  const chatRoom = useAppSelector((state) => state.chatRoom.currentRoom);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addChatMessage = (message: ChatMessage) => {
    setMessages((oldMessages) => [...oldMessages, message]);
  };

  useEffect(() => {
    if (chatRoom) {
      const userPromises = new Map<string, PromiseLike<ChatUser>>();
      const db = getDatabase();
      const msgRef = ref(db, `messages/${chatRoom.id}`);
      onChildAdded(msgRef, (snapshot) => {
        const data = snapshot.val();
        const message = {
          key: snapshot.key as string,
          message: data.message,
          timestamp: data.timestamp,
        };

        let userPromise = userPromises.get(data.user);
        if (!userPromise) {
          userPromise = get(ref(db, `users/${data.user}`)).then((snapshot) => {
            const userData = snapshot.val();
            const chatUser: ChatUser = {
              key: snapshot.key as string,
              name: userData.name,
              avatar: userData.avatar,
            };

            return chatUser;
          });

          userPromises.set(data.user, userPromise);
        }

        userPromise.then((user) => addChatMessage({ ...message, user }));
      });

      return () => {
        off(msgRef);
        setMessages([]);
      };
    }
  }, [chatRoom]);

  return (
    <MessageWrap ref={wrapRef}>
      {messages.map((msg) => (
        <Comment
          key={msg.key}
          author={msg.user.name}
          avatar={<Avatar src={msg.user.avatar}></Avatar>}
          content={<p>{msg.message}</p>}
          datetime={
            <Tooltip title={moment(msg.timestamp).format('YYYY-MM-DD a hh:mm')}>
              <span>{moment(msg.timestamp).fromNow()}</span>
            </Tooltip>
          }
        ></Comment>
      ))}
    </MessageWrap>
  );
}

export default MessageContent;
