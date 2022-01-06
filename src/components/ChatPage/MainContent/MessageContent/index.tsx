import moment from 'moment';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { get, getDatabase, off, onChildAdded, orderByChild, query, ref } from 'firebase/database';
import { Avatar, Comment, Tooltip } from 'antd';
import { useAppSelector } from '@store/hooks';
import { UserOutlined } from '@ant-design/icons';
import Moment from 'react-moment';

type ChatUser = {
  key: string;
  name: string;
  avatar: string;
};

type ChatMessage = {
  key: string;
  message: string;
  timestamp: number;
  user?: ChatUser;
};

const MessageWrap = styled.div`
  height: 0;
  flex: 1 1 auto;
  overflow-y: auto;
  scroll-behavior: smooth;
`;

const ChatMessage = styled(Comment)`
  .ant-comment-inner {
    padding: 8px 0;
  }
`;

function MessageContent() {
  const chatRoom = useAppSelector((state) => state.chatRoom.currentRoom);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addChatMessage = (message: ChatMessage) => {
    setMessages((oldMessages) => [...oldMessages, message]);
  };

  const setChatMessageUser = (message: ChatMessage, user: ChatUser) => {
    setMessages((oldMessages) => {
      const idx = oldMessages.indexOf(message);
      if (idx !== -1) {
        const items = [...oldMessages];
        items[idx] = { ...oldMessages[idx], user };
        return items;
      }
      return oldMessages;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const elem = wrapRef.current;
      if (elem) {
        elem.scrollTop = elem.scrollHeight - elem.clientHeight;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    if (chatRoom) {
      const userPromises = new Map<string, PromiseLike<ChatUser>>();
      const db = getDatabase();
      const msgRef = ref(db, `messages/${chatRoom.id}`);

      onChildAdded(query(msgRef, orderByChild('timestamp')), (snapshot) => {
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

        addChatMessage(message);
        userPromise.then((user) => setChatMessageUser(message, user));
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
        <ChatMessage
          key={msg.key}
          author={msg.user && msg.user.name}
          avatar={msg.user ? <Avatar src={msg.user.avatar}></Avatar> : <Avatar icon={<UserOutlined />}></Avatar>}
          content={<p>{msg.message}</p>}
          datetime={
            <Tooltip title={moment(msg.timestamp).format('YYYY-MM-DD a hh:mm')}>
              <Moment format="MM-DD a hh:mm" fromNowDuring={moment().diff(moment().startOf('day'))} fromNow={true}>
                {msg.timestamp}
              </Moment>
            </Tooltip>
          }
        ></ChatMessage>
      ))}
    </MessageWrap>
  );
}

export default MessageContent;
