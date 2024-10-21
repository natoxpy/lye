import { PayloadAction } from '@reduxjs/toolkit'
import { State } from './reducer'
import { v4 as uuidv4 } from 'uuid'
import * as Diff from 'diff'

function linesDiff(
    preLines: string[],
    newLines: string[]
): { from?: string[]; fromLineNumber: number; to?: string[] }[] {
    const diff = Diff.diffArrays(preLines, newLines)

    let c = null
    let ln = 0
    const fd: { from?: string[]; fromLineNumber: number; to?: string[] }[] = []

    console.log(diff)

    for (const d of diff) {
        if (d.removed || d.added) {
            if (d.added && c == null) {
                fd.push({ fromLineNumber: ln, to: d.value })
            } else if (c == null) {
                c = fd.length
                fd.push({ from: d.value, fromLineNumber: ln })
                ln += d.value.length
            } else {
                fd[c]['to'] = d.value
                c = null
            }
        } else {
            if (c !== null) {
                fd[c]['to'] = []
                c = null
            }

            fd.push({ from: d.value, fromLineNumber: ln })
            ln += d.value.length
        }
    }

    return fd
}

type Payload = {
    lines: string[]
    workspaceId: string
    variantId: string
}

export default function Reducer(state: State, action: PayloadAction<Payload>) {
    const lines = state.instances
        .find((lyrics) => lyrics.workspace == action.payload.workspaceId)
        ?.variants.find((variant) => variant.id == action.payload.variantId)
        ?.lines.map((line) => line.content)

    if (!lines) return

    const diff = linesDiff(lines, action.payload.lines)

    const instance = state.instances.find(
        (item) => item.workspace === action.payload.workspaceId
    )

    const variant = instance?.variants.find(
        (item) => item.id === action.payload.variantId
    )

    if (!variant) return

    const newlines = []

    for (const diffItem of diff) {
        if (diffItem.to === undefined && diffItem.from !== undefined) {
            newlines.push(
                ...diffItem.from.map((content, idx) => ({
                    id: variant.lines[idx + diffItem.fromLineNumber]?.id,
                    content,
                }))
            )
        } else if (diffItem.to !== undefined) {
            newlines.push(
                ...diffItem.to.map((content) => ({
                    id: uuidv4(),
                    content,
                }))
            )
        }
    }

    variant.lines = newlines
}
