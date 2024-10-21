import { configureStore } from '@reduxjs/toolkit'
import WorkspaceReducer from './stores/workspaces/reducer'
import LyricsReducer from './stores/lyrics/reducer'

export const store = configureStore({
    reducer: {
        lyrics: LyricsReducer,
        workspaces: WorkspaceReducer,
    },
})

export type AppStore = typeof store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
