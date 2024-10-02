///
/// This is an internal component, and should not be access by any outside component,
/// for external purposes use ./component.tsx
///
/// The I in IComponent stands for Internal, for Internal Component
///

import EditorView from './EditorView'
import ToolsView from './ToolsView'
import { useEffect } from 'react'
import { useInternalDispatch } from './internalState/index'

export default function IComponent({ lyric }: { lyric: string }) {
    const dispatch = useInternalDispatch()
    let width = 700
    const focusWidth = 100
    if (focusWidth == 100) width = 700

    useEffect(() => {
        dispatch({
            type: 'lyric/update',
            payload: lyric
        })
    })

    return (
        <div
            className="flex flex-col text-lg h-32 overflow-x-auto overflow-y-hidden w-full bg-background-800 bg-gradient-to-t from-background-900  to-95% to-background-950"
            style={{
                minWidth: width == 0 ? '' : width + 'px',
                maxWidth: width == 0 ? '' : width + 'px'
            }}
        >
            <ToolsView />
            <EditorView />
        </div>
    )
}
