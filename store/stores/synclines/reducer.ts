import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Line = {
    id: string
    startMs: number
    durationMs: number
    timeline: 'primary' | 'secondary'
    lineNumber: number
}

export type State = {
    lines: Line[]
}

const initialState: State = {
    lines: [
        {
            id: '100',
            startMs: 1000,
            durationMs: 5000,
            timeline: 'primary',
            lineNumber: 1,
        },
    ],
}

export const Slice = createSlice({
    name: 'synclines',
    initialState,
    reducers: {
        addLine(state, action: PayloadAction<Line>) {
            state.lines.push(action.payload)
        },
        removeLine(state, action: PayloadAction<{ lineNumber: number }>) {
            state.lines = state.lines.filter(
                (item) => item.lineNumber !== action.payload.lineNumber
            )
        },
        setStartMs(
            state,
            action: PayloadAction<{ lineNumber: number; value: number }>
        ) {
            const index = state.lines.findIndex(
                (item) => item.lineNumber === action.payload.lineNumber
            )

            if (index == -1) return

            state.lines[index].startMs = action.payload.value
        },

        setTimeline(
            state,
            action: PayloadAction<{
                lineNumber: number
                value: 'primary' | 'secondary'
            }>
        ) {
            const index = state.lines.findIndex(
                (item) => item.lineNumber === action.payload.lineNumber
            )

            if (index == -1) return

            state.lines[index].timeline = action.payload.value
        },
        setDurationMs(
            state,
            action: PayloadAction<{ lineNumber: number; value: number }>
        ) {
            const index = state.lines.findIndex(
                (item) => item.lineNumber === action.payload.lineNumber
            )

            if (index == -1) return

            state.lines[index].durationMs = action.payload.value
        },
    },
})

export const { setStartMs, setDurationMs, setTimeline, removeLine } =
    Slice.actions

export default Slice.reducer
