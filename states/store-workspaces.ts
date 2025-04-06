import { UNAME } from '@/utils/units'
import { createStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { addWorkspace, deleteWorkspace } from './persistance'

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
        add: (
            id: string,
            shorthand_id: string,
            workspace?: Omit<Workspace, 'id' | 'shorthand_id'>
        ) => void
        delete: (id: string) => void
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
                add(id, shorthand_id, workspace) {
                    set((state) => {
                        const objData = workspace ?? {
                            meta: { album: '', artist: '' },
                            title: 'Unnamed',
                            fileblob: undefined as never,
                            coverblob: undefined as never,
                        }

                        const workspaceObj = {
                            id: id as never,
                            shorthand_id: shorthand_id,
                            ...objData,
                        }

                        addWorkspace(workspaceObj)
                        state.workspaces.push(workspaceObj)
                    })
                },
                delete(id: string) {
                    set((state) => {
                        deleteWorkspace(id)
                        state.workspaces = state.workspaces.filter(
                            (w) => w.id != id
                        )
                    })
                },
            },
        }
    })
)
