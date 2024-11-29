import { useEffect, useRef } from 'react'
import { Layout } from './layout'
import { useBoardManager } from '../../states/boardManager'
import { usePlayerDispatch, usePlayerState } from '@/app/player/state'
import { Milliseconds, Pixels, Seconds } from '@/app/utils/units'
import useMouseMoveHolding from '../../actionEvents/mouseMoveHolding'

export default function Component({
    leftOffset,
    height,
}: {
    leftOffset: number
    height: Pixels
}) {
    const layoutRef = useRef<HTMLDivElement>(null)
    const { setOnMove } = useMouseMoveHolding(layoutRef)
    const player = usePlayerState()
    const dispatchPlayer = usePlayerDispatch()
    const boardManager = useBoardManager()

    setOnMove((absX) => {
        const layout = layoutRef.current
        if (!layout) return

        const relX = Math.min(
            Math.max(absX - leftOffset + boardManager.offset.px, 0),
            boardManager.area
        )

        const time = ((relX / boardManager.area) *
            player.duration) as Milliseconds

        dispatchPlayer({
            type: 'sync-currentTime',
            payload: (time / 1000) as Seconds,
        })

        dispatchPlayer({
            type: 'set-currentTime',
            payload: time,
        })
    })

    useEffect(() => {
        const layout = layoutRef.current
        if (!layout) return
        const widthOffset = layout.getBoundingClientRect().width / 2

        const leftOffset =
            (boardManager.offset.ms / player.duration) * -boardManager.area
        const xs = (player.currentTime / player.duration) * boardManager.area

        const left = xs - widthOffset + leftOffset

        layout.style.left = left + 'px'
        layout.style.visibility = 'visible'
    })

    return <Layout height={height} ref={layoutRef} />
}
