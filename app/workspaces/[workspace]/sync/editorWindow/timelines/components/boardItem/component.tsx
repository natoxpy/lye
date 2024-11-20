import { useCallback, useRef } from 'react'
import { Layout, Line } from './layout'
import useMouseMoveHolding from '../../events/mouseMoveHolding'
import { useBoardManager } from '../../../../states/boardManager'
import { useTicks } from '../tickbar/useTicks'
import { Milliseconds, Pixels } from '@/app/utils/units'
import { usePlayerState } from '@/app/player/state'
import { useSpecialKey } from '../../../../actionEvents/useSpecialKey'

export default function Component() {
    const boardOffset = 96 as Pixels
    const layoutRef = useRef<HTMLDivElement>(null)
    const boardManager = useBoardManager()
    const player = usePlayerState()

    const { setOnMove, targetOffset } = useMouseMoveHolding(layoutRef)
    const specialKeys = useSpecialKey()

    const { ticks } = useTicks()

    const toMs = useCallback(
        (value: Pixels) =>
            ((value / boardManager.area) * player.duration) as Milliseconds,
        [boardManager.area, player.duration]
    )

    const toPx = useCallback(
        (value: Milliseconds) =>
            ((value / player.duration) * boardManager.area) as Pixels,
        [boardManager.area, player.duration]
    )

    const clampToTick = useCallback(
        (value: Milliseconds) => {
            return ticks
                .map((t) => ({
                    value: t.value,
                    delta: Math.abs(value - t.value),
                }))
                .sort((a, b) => a.delta - b.delta)[0].value
        },
        [ticks]
    )

    setOnMove(
        useCallback(
            (absX) => {
                const layout = layoutRef.current
                if (!layout) return

                let x = toMs((absX - boardOffset - targetOffset.x) as Pixels)

                const itemDuration = toMs(
                    layout.getBoundingClientRect().width as Pixels
                )

                if (!specialKeys.shift) x = clampToTick(x)

                let final = (x + boardManager.offset.ms) as Milliseconds

                if (final < 0) {
                    final = 0 as Milliseconds
                } else if (final + itemDuration >= player.duration) {
                    final = (player.duration - itemDuration) as Milliseconds
                }

                layout.style.left = toPx(final) + 'px'
            },
            [
                boardManager.offset.ms,
                clampToTick,
                player.duration,
                specialKeys.shift,
                targetOffset.x,
                toMs,
                toPx,
            ]
        )
    )

    return (
        <Layout ref={layoutRef} variant="main">
            <Line number={1} />
        </Layout>
    )
}
