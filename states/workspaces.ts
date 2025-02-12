import { UNAME } from '@/utils/units'
import { createStore } from 'zustand'

type Workspace = {
    shorthand_id: string
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
                    shorthand_id: '50685e09',
                    id: '50685e09-4e7f-4b1d-b113-b9eb2a9edb9a' as UNAME,
                    title: 'Iron Lotus',
                    fileblob: undefined as never,
                },
                {
                    shorthand_id: 'f122e5d2',
                    id: 'f122e5d2-0f1e-400a-8829-cc927e46f1fc' as UNAME,
                    title: 'In Hell We Live, Lament',
                    fileblob: undefined as never,
                },
                {
                    shorthand_id: '098cf7e1',
                    id: '098cf7e1-ca8b-4c90-a841-2b5127db048d' as UNAME,
                    title: 'Grown-up\'s Paradise',
                    fileblob: undefined as never,
                },
            ],
            actions: {},
        }
    }
)
