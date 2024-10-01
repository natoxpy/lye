///
/// This component should be considered impure and
/// should only be called within component.tsx
///
import LinkActivityTick from './LinkActivityTick'
import LinkMousePosition from './LinkMousePosition'
import LinkActivityEnd from './LinkActivityEnd'
import LinkRootWidth from './LinkRootWidth'

export default function Component() {
    return (
        <>
            <LinkActivityTick />
            <LinkMousePosition />
            <LinkActivityEnd />
            <LinkRootWidth />
        </>
    )
}
