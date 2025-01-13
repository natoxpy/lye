// import { Hash, Milliseconds, UNAME } from '@/utils/units'
import { createStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { v4 as uuidv4 } from 'uuid'

type States = {
    workspaces: Array<{
        id: string
        displayName: string
    }>
}

type Actions = {
    loadWorkspaces: (workspaces: States['workspaces']) => void
    createWorkspace: (name: string) => void
    deleteWorkspace: (id: string) => void
}

export const timedLinesStore = createStore<States & Actions>()(
    immer((set) => ({
        workspaces: [],
        loadWorkspaces: (workspaces) =>
            set((state) => {
                state.workspaces = workspaces
            }),
        createWorkspace: (name) =>
            set((state) => {
                state.workspaces.push({ id: uuidv4(), displayName: name })
            }),
        deleteWorkspace: (id: string) =>
            set((state) => {
                const index = state.workspaces.findIndex(
                    (workspace) => workspace.id == id
                )
                state.workspaces.splice(index, 1)
            }),
    }))
)
