import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CurrentUserState = {
  uid: string;
  email: string | null;
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
    setCurrentUser: (state, action: PayloadAction<CurrentUserState | null>) => {
      state.initializing = false;
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = slice.actions;

export default slice.reducer;
