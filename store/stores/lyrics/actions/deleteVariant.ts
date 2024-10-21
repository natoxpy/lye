import { PayloadAction } from '@reduxjs/toolkit'
import { State } from '../reducer'

export default function Action(
    state: State,
    action: PayloadAction<{ workspaceId: string; variantId: string }>
) {
    const instance = state.instances.find(
        (item) => item.workspace === action.payload.workspaceId
    )

    if (!instance) return

    instance.variants = instance.variants.filter(
        (item) => item.id !== action.payload.variantId
    )
}
