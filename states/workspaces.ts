import { UNAME } from '@/utils/units'
import { createStore } from 'zustand'

type Workspace = {
    id: UNAME
    title: string
    fileblob: Blob
}

type WorkspacesState = {
    workspaces: Workspace[]
}

type WorkspaceActions = {
    actions: object
}

export type WorkspaceStore = WorkspacesState & WorkspaceActions

export const workspacesStore = createStore<WorkspaceStore>()(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set) => {
        return {
            workspaces: [
                {
                    id: '50685e09-4e7f-4b1d-b113-b9eb2a9edb9a' as UNAME,
                    title: 'Iron Lotus',
                    fileblob: undefined as never,
                },
            ],
            actions: {},
        }
    }
)
