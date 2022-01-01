import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CurrentRoomState = {
  roomId: string | null;
};

type ChatRoomState = {
  currentRoom: CurrentRoomState;
};

const initialState: ChatRoomState = {
  currentRoom: {
    roomId: null,
  },
};

const slice = createSlice({
  name: 'chatRoom',
  initialState,
  reducers: {
    setCurrentRoomId: (state, action: PayloadAction<string>) => {
      state.currentRoom.roomId = action.payload;
    },
  },
});

export const { setCurrentRoomId } = slice.actions;

export default slice.reducer;
