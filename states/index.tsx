import { usePlainLyrics, useWorkspaces } from './hooks'
import { Workspace } from './store-workspaces'

export function useLocalState() {
    const addWorkspace = useWorkspaces((state) => state.actions.add)
    const addPlainlyrics = usePlainLyrics((state) => state.actions.createLyrics)

    return {
        newWorkspace: function NewLocalWorkspace(workspace: Workspace) {
            addPlainlyrics(workspace.id, workspace.shorthand_id as never, '')
            addWorkspace(workspace)
        },
    }
}
