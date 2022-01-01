import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import user from './modules/user';
import chatRoom from './modules/chatRoom';

const reducer = combineReducers({ user, chatRoom });

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([logger]),
});

export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
