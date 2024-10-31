import { createSlice } from '@reduxjs/toolkit'

export type Line = {
    id: string
    startMs: number
    endMs: number
    timeline: 'primary' | 'secondary'
}

export type State = {
    lines: Line[]
}

const initialState: State = { lines: [] }

export const Slice = createSlice({
    name: 'synclines',
    initialState,
    reducers: {},
})

export const {} = Slice.actions

export default Slice.reducer
