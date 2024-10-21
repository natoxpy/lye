import { PayloadAction } from '@reduxjs/toolkit'
import { State } from '../reducer'
import { v4 as uuidv4 } from 'uuid'

export default function Action(
    state: State,
    action: PayloadAction<{
        name: string
        workspace: string
        id?: string
        editing?: 'name' | 'languages'
    }>
) {
    const index = state.instances.findIndex(
        (item) => item.workspace === action.payload.workspace
    )

    if (index == -1) return

    const instance = state.instances[index]
    if (!instance) return

    if (action.payload.name === 'original' && instance.variants.length > 0)
        return

    instance.variants.push({
        id: action.payload.id ?? uuidv4(),
        editing: action.payload.editing,
        languages: [],
        name: action.payload.name,
        lines: [
            {
                id: uuidv4(),
                content: '',
            },
        ],
    })
}
