import { create, useStore } from 'zustand'

import { timedLinesStore } from './timed-lines'
import { workspacesStore, WorkspaceStore } from './workspaces'

export const useTimedLinesStore = create(() => timedLinesStore)

// Create a custom hook with support for selectors
export const useWorkspaces = <T,>(
    selector: (state: WorkspaceStore) => T
): T => {
    return useStore(workspacesStore, selector)
}
