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
            id: '1000',
            startMs: 0,
            durationMs: 5000,
            timeline: 'primary',
            lineNumber: 1,
        },
        {
            id: '3000',
            startMs: 5000,
            durationMs: 5000,
            timeline: 'primary',
            lineNumber: 3,
        },
        {
            id: '4000',
            startMs: 10000,
            durationMs: 5000,
            timeline: 'primary',
            lineNumber: 4,
        },
        {
            id: '5000',
            startMs: 15000,
            durationMs: 5000,
            timeline: 'primary',
            lineNumber: 5,
        },
        {
            id: '6000',
            startMs: 20000,
            durationMs: 5000,
            timeline: 'primary',
            lineNumber: 6,
        },
        {
            id: '2000',
            startMs: 50_000,
            durationMs: 4750,
            timeline: 'secondary',
            lineNumber: 2,
        },
    ],
}

export const Slice = createSlice({
    name: 'synclines',
    initialState,
    reducers: {
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

export const { setStartMs, setDurationMs } = Slice.actions

export default Slice.reducer
