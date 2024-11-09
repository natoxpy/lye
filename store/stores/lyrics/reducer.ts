import SyncLines from './actions/syncLines'
import CreateVariant from './actions/createVariant'
import EditVariant from './actions/editVariant'
import SetVariantLanguages from './actions/setVariantLanguages'
import SetVariantName from './actions/setVariantName'
import DeleteVariant from './actions/deleteVariant'
import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { TemporaryWorkspaceID } from '../workspaces/reducer'

export type Line = {
    id: string
    content: string
}

export type Language = {
    code: string
    nativeName: string
}

export type Variant = {
    id: string
    name: string
    languages: Language[]
    lines: Line[]
    editing?: 'languages' | 'name'
}

export type LinesSync =
    | { type: 'add'; id: string; line: number }
    | { type: 'remove'; id: string }
    | { type: 'remap'; id: string; nid: string; line: number }

export type Instance = {
    id: string
    workspace: string
    primary: string
    linesSync: LinesSync[]
    variants: Variant[]
}

export type State = { instances: Instance[] }

const initialState: State = {
    instances: [
        {
            id: uuidv4(),
            workspace: TemporaryWorkspaceID,
            primary: 'original',
            linesSync: [],
            variants: [],
        },
    ],
}

export const Slice = createSlice({
    name: 'lyrics',
    initialState,
    reducers: {
        syncLines: SyncLines,
        createVariant: CreateVariant,
        editVariant: EditVariant,
        setVariantLanguages: SetVariantLanguages,
        setVariantName: SetVariantName,
        deleteVariant: DeleteVariant,
    },
})

export const {
    syncLines,
    createVariant,
    editVariant,
    setVariantLanguages,
    setVariantName,
    deleteVariant,
} = Slice.actions
export default Slice.reducer
