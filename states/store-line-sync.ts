import { createStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type LineSync = {
    targetId: string
}

export type LineSyncState = {
    workspaces: {
        id: string
        workspace: string
        content: LineSync[]
    }[]
}

export type LineSyncAction = {
    actions: {}
}

export type LineSyncStore = LineSyncState & LineSyncAction

export const LineSyncStore = createStore<LineSyncStore>()(
    immer((set) => ({
        workspaces: [],
        actions: {},
    }))
)
