import { UNAME } from '@/utils/units'
import { createStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type Workspace = {
    id: UNAME
}

type WorkspacesState = {
    workspaces: Workspace[]
}

type WorkspaceActions = {
    actions: object
}

type WorkspaceStore = WorkspacesState & WorkspaceActions

export const useWorkspaces = createStore<WorkspaceStore>()(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    immer((set) => ({
        workspaces: [],
        actions: {},
    }))
)
