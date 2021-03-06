import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CurrentUserState = {
  uid: string;
  email: string;
  name: string | null;
  avatar: string | null;
};
type UserState = {
  initializing: boolean;
  currentUser: CurrentUserState | null;
};

const initialState: UserState = {
  initializing: true,
  currentUser: null,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<CurrentUserState>) => {
      state.initializing = false;
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.initializing = false;
      state.currentUser = null;
    },
    setAvatarURL: (state, action: PayloadAction<string>) => {
      state.currentUser && (state.currentUser.avatar = action.payload);
    },
  },
});

export type { CurrentUserState };
export const { setCurrentUser, clearCurrentUser, setAvatarURL } = slice.actions;

export default slice.reducer;
