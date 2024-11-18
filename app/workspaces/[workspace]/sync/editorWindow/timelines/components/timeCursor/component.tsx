import { useRef } from 'react'
import { Layout } from './layout'
import useMouseMoveHolding from '../../events/mouseMoveHolding'
import { useBoardManager } from '../../../../states/boardManager'
import { usePlayerState } from '@/app/player/state'

export default function Component({ leftOffset }: { leftOffset: number }) {
    const layoutRef = useRef<HTMLDivElement>(null)
    const { setOnMove } = useMouseMoveHolding(layoutRef)
    // const player = usePlayerState()
    // const boardManager = useBoardManager()

    // setOnMove((x) => {
    //     const layout = layoutRef.current
    //     if (!layout) return
    //     const offset = layout.getBoundingClientRect().width / 2 + leftOffset

    //     // console.log(
    //     //     (boardManager.width.ms / player.duration) * boardManager.width.px
    //     // )

    //     layout.style.left = x - offset + 'px'
    // })

    return <Layout ref={layoutRef} />
}
