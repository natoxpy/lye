import { PayloadAction } from '@reduxjs/toolkit'
import { State } from '../reducer'

export default function Action(
    state: State,
    action: PayloadAction<{
        workspaceId: string
        variantId: string
        editing?: 'languages' | 'name'
    }>
) {
    const instance = state.instances.find(
        (item) => item.workspace === action.payload.workspaceId
    )

    if (!instance) return

    instance.variants = instance.variants.map((variant) => {
        variant.editing = undefined
        return variant
    })

    const variant = instance?.variants.find(
        (variant) => variant.id === action.payload.variantId
    )

    if (!variant) return

    variant.editing = action.payload.editing
}
