import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CurrentRoomState = {
  id: string;
  name: string;
  description?: string;
};

type ChatRoomState = {
  currentRoom: CurrentRoomState | null;
};

const initialState: ChatRoomState = {
  currentRoom: null,
};

const slice = createSlice({
  name: 'chatRoom',
  initialState,
  reducers: {
    setCurrentRoom: (state, action: PayloadAction<CurrentRoomState>) => {
      state.currentRoom = action.payload;
    },
  },
});

export type { CurrentRoomState };
export const { setCurrentRoom } = slice.actions;

export default slice.reducer;
