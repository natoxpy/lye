import { RootState } from '@/store/store'

export const hasWorkspace = (id: string) => {
    return (state: RootState) =>
        state.workspaces.items.findIndex((workspace) => workspace.id === id) !==
        -1
}
