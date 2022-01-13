import moment from 'moment';
import styled from 'styled-components';
import Moment from 'react-moment';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { get, getDatabase, off, onChildAdded, orderByChild, query, ref } from 'firebase/database';
import { Avatar, Comment, Image, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAppSelector } from '@store/hooks';

type MessageType = 'text' | 'image';

type ChatUser = {
  key: string;
  name: string;
  avatar: string;
};

type ChatUserMap = {
  [key: string]: ChatUser | undefined;
};

type ChatMessage = {
  key: string;
  type: MessageType;
  uid: string;
  message: string;
  timestamp: number;
};

type MessageProps = {
  type: MessageType;
  children: string;
};

type MessageContentProps = {
  searchText?: string;
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

function throttledQueue<T>(fn: (queueDatas: T[]) => void, delay: number) {
  let queue: T[] = [];
  let timer: NodeJS.Timeout | null = null;
  return (data: T) => {
    queue.push(data);
    if (!timer) {
      timer = setTimeout(() => {
        const queueDatas = queue.slice();
        timer = null;
        queue = [];
        fn(queueDatas);
      }, delay);
    }
  };
}

function Message(props: MessageProps) {
  if (props.type === 'image') {
    return <Image src={props.children} style={{ maxWidth: 200, maxHeight: 200 }}></Image>;
  }

  return <p>{props.children}</p>;
}

function MessageContent(props: MessageContentProps) {
  const chatRoom = useAppSelector((state) => state.chatRoom.currentRoom);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<ChatUserMap>({});
  const [searchResults, setSearchResults] = useState<ChatMessage[]>([]);

  const addChatMessage = useMemo(
    () =>
      throttledQueue((messages: ChatMessage[]) => {
        setMessages((oldMessages) => [...oldMessages, ...messages]);
      }, 50),
    []
  );

  const addChatUserInfo = useCallback(
    (user: ChatUser) => {
      setUsers({
        ...users,
        [user.key]: user,
      });
    },
    [users]
  );

  const getChatUserInfo = useCallback((uid: string) => users[uid], [users]);

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
      const userSet = new Set<string>();
      const db = getDatabase();
      const msgRef = ref(db, `messages/${chatRoom.id}`);

      onChildAdded(query(msgRef, orderByChild('timestamp')), (snapshot) => {
        const data = snapshot.val();
        const message = {
          key: snapshot.key as string,
          type: data.type || 'text',
          uid: data.user,
          message: data.message,
          timestamp: data.timestamp,
        };

        if (!userSet.has(data.user)) {
          userSet.add(data.user);
          get(ref(db, `users/${data.user}`)).then((snapshot) => {
            const userData = snapshot.val();
            const chatUser: ChatUser = {
              key: data.user,
              name: userData?.name || '',
              avatar: userData?.avatar || '',
            };

            addChatUserInfo(chatUser);
          });
        }

        addChatMessage(message);
      });

      return () => {
        off(msgRef);
        setMessages([]);
        setUsers({});
      };
    }
  }, [chatRoom]);

  useEffect(() => {
    if (props.searchText) {
      const regex = new RegExp(props.searchText, 'gi');
      const searchResults = messages.reduce((acc, message) => {
        if (message.type === 'text' && message.message.match(regex)) {
          acc.push(message);
        }
        return acc;
      }, [] as ChatMessage[]);
      setSearchResults(searchResults);
    }

    return () => setSearchResults([]);
  }, [props.searchText]);

  const renderChatMessages = (chatMessages: ChatMessage[]) =>
    chatMessages.map((msg) => {
      const user = getChatUserInfo(msg.uid);
      return (
        <ChatMessage
          key={msg.key}
          author={user?.name}
          avatar={user?.avatar ? <Avatar src={user.avatar}></Avatar> : <Avatar icon={<UserOutlined />}></Avatar>}
          content={<Message type={msg.type}>{msg.message}</Message>}
          datetime={
            <Tooltip title={moment(msg.timestamp).format('YYYY-MM-DD a hh:mm')}>
              <Moment format="MM-DD a hh:mm" fromNowDuring={moment().diff(moment().startOf('day'))} fromNow={true}>
                {msg.timestamp}
              </Moment>
            </Tooltip>
          }
        ></ChatMessage>
      );
    });

  return <MessageWrap ref={wrapRef}>{renderChatMessages(props.searchText ? searchResults : messages)}</MessageWrap>;
}

export default MessageContent;
