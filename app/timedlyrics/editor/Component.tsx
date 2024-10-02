///
/// This is an internal component, and should not be access by any outside component,
/// for external purposes use ./component.tsx
///

import IComponent from './IComponent'
import LoadExternal from './LoadExternal'
import ReactiveComponents from './reactive'

export default function Component({ lyric }: { lyric: string }) {
    return (
        <>
            <ReactiveComponents />
            <LoadExternal />
            <IComponent lyric={lyric} />
        </>
    )
}
