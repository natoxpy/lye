import { PayloadAction } from '@reduxjs/toolkit'
import { Language, State } from '../reducer'

export default function Action(
    state: State,
    action: PayloadAction<{
        workspaceId: string
        variantId: string
        languages: Language[]
    }>
) {
    const instance = state.instances.find(
        (item) => item.workspace === action.payload.workspaceId
    )
    const variant = instance?.variants.find(
        (item) => item.id === action.payload.variantId
    )

    if (!variant) return

    variant.languages = action.payload.languages
}
