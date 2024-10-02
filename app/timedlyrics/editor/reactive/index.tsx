///
/// This component should be considered impure and
/// should only be called within component.tsx
///

import LinkMousePosition from './LinkMousePosition'
import LinkRootLeft from './LinkRootLeft'
import LinkActivityEnd from './LinkActivityEnd'
import LinkActivityTick from './LinkActivityTick'

export default function Component() {
    return (
        <>
            <LinkRootLeft />
            <LinkMousePosition />
            <LinkActivityEnd />
            <LinkActivityTick />
        </>
    )
}
