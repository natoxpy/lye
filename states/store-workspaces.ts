import { UNAME } from '@/utils/units'
import { createStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type Workspace = {
    shorthand_id: string
    id: UNAME
    title: string
    meta: {
        artist: string
        album: string
    }
    fileblob: Blob
    coverblob: Blob
}

type WorkspacesState = {
    workspaces: Workspace[]
}

type WorkspaceActions = {
    actions: {
        setWorkspaces: (workspaces: Workspace[]) => void
        update: (workspace: Workspace) => void
        add: (workspace: Workspace) => void
    }
}

export type WorkspaceStore = WorkspacesState & WorkspaceActions

export const workspacesStore = createStore<WorkspaceStore>()(
    immer((set) => {
        return {
            workspaces: [],
            actions: {
                setWorkspaces(workspaces) {
                    set((state) => {
                        state.workspaces = workspaces
                    }, true)
                },
                update(workspace) {
                    set((state) => {
                        const index = state.workspaces.findIndex(
                            (w) => w.id === workspace.id
                        )

                        if (index !== -1) state.workspaces[index] = workspace
                    })
                },
                add(workspace) {
                    set((state) => {
                        state.workspaces.push(workspace)
                    })
                },
            },
        }
    })
)
