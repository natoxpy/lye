import { useRef } from 'react'
import { Layout, Line } from './layout'
import useMouseMoveHolding from '../../events/mouseMoveHolding'
import { useBoardManager } from '../../../../states/boardManager'

export default function Component() {
    const layoutRef = useRef<HTMLDivElement>(null)
    const leftOffset = 96
    const boardManager = useBoardManager()

    const { setOnMove } = useMouseMoveHolding(layoutRef)

    setOnMove((absX) => {
        const relX = Math.min(
            Math.max(absX - leftOffset + boardManager.offset.px, 0),
            boardManager.area
        )

        console.log(relX)
    })

    return (
        <Layout ref={layoutRef} variant="main">
            <Line number={1} />
        </Layout>
    )
}
