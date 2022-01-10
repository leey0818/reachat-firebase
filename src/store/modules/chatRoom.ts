import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CurrentRoomState = {
  id: string;
  name: string;
  description?: string;
  private: boolean;
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
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
    },
  },
});

export type { CurrentRoomState };
export const { setCurrentRoom, clearCurrentRoom } = slice.actions;

export default slice.reducer;
