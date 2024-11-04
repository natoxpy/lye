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
            durationMs: 10000,
            timeline: 'primary',
            lineNumber: 1,
        },
        {
            id: '1000',
            startMs: 20000,
            durationMs: 10000,
            timeline: 'primary',
            lineNumber: 3,
        },
        {
            id: '2000',
            startMs: 300,
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
