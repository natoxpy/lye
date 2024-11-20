import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuiv4 } from 'uuid'
import { TemporaryWorkspaceID } from '../workspaces/reducer'

export type Line = {
    id: string
    startMs: number
    durationMs: number
    timeline: 'primary' | 'secondary'
    lineNumber: number
}

export type Instance = {
    id: string
    workspace: string
    lines: Line[]
}

export type State = {
    instances: Instance[]
}

const initialState: State = {
    instances: [
        {
            id: uuiv4(),
            workspace: TemporaryWorkspaceID,
            lines: [],
        },
    ],
}

export const Slice = createSlice({
    name: 'synclines',
    initialState,
    reducers: {
        addLine(state, action: PayloadAction<Line>) {
            // state.lines.push(action.payload)
        },
        removeLine(state, action: PayloadAction<{ lineNumber: number }>) {
            // state.lines = state.lines.filter(
            //     (item) => item.lineNumber !== action.payload.lineNumber
            // )
        },
        setStartMs(
            state,
            action: PayloadAction<{ lineNumber: number; value: number }>
        ) {
            // const index = state.lines.findIndex(
            //     (item) => item.lineNumber === action.payload.lineNumber
            // )
            // if (index == -1) return
            // state.lines[index].startMs = action.payload.value
        },

        setTimeline(
            state,
            action: PayloadAction<{
                lineNumber: number
                value: 'primary' | 'secondary'
            }>
        ) {
            // const index = state.lines.findIndex(
            //     (item) => item.lineNumber === action.payload.lineNumber
            // )
            // if (index == -1) return
            // state.lines[index].timeline = action.payload.value
        },
        setDurationMs(
            state,
            action: PayloadAction<{ lineNumber: number; value: number }>
        ) {
            // const index = state.lines.findIndex(
            //     (item) => item.lineNumber === action.payload.lineNumber
            // )
            // if (index == -1) return
            // state.lines[index].durationMs = action.payload.value
        },
    },
})

export const { setStartMs, setDurationMs, setTimeline, removeLine, addLine } =
    Slice.actions

export default Slice.reducer
