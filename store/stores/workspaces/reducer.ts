import { createSlice } from '@reduxjs/toolkit'

export const TemporaryWorkspaceID = 'main'

export type Workspace = {
    id: string
    name: string
}

export type State = { items: Workspace[] }

const initialState: State = {
    items: [
        {
            id: TemporaryWorkspaceID,
            name: 'main',
        },
    ],
}

export const Slice = createSlice({
    name: 'workspaces',
    initialState,
    reducers: {},
})

export const {} = Slice.actions
export default Slice.reducer
