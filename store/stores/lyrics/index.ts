import { RootState } from '@/store/store'
export {
    syncLines,
    editVariant,
    createVariant,
    setVariantLanguages,
    setVariantName,
    deleteVariant,
} from './reducer'

export const HEADER_INITIAL = '\u200B'

export const useLines = (workspaceId: string, variantId: string) => {
    return (state: RootState) => {
        const lyrics = state.lyrics.instances.find(
            (lyrics) => lyrics.workspace == workspaceId
        )

        const variant = lyrics?.variants.find(
            (variant) => variant.id === variantId
        )

        return variant?.lines
    }
}

export const useVariants = (workspaceId: string) => {
    return (state: RootState) => {
        const lyrics = state.lyrics.instances.find(
            (lyric) => lyric.workspace === workspaceId
        )

        return lyrics?.variants ?? []
    }
}
