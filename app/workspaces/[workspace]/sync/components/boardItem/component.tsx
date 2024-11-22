import { RefObject, useCallback, useEffect, useRef } from 'react'
import { Layout, Line, ResizeTip } from './layout'
import { useTicks } from '../tickbar/useTicks'
import { Milliseconds, Pixels } from '@/app/utils/units'
import { usePlayerState } from '@/app/player/state'
import { useSpecialKey } from '../../actionEvents/useSpecialKey'
import { useBoardManager, useTimeline } from '../../states/boardManager'
import useMouseMoveHolding from '../../actionEvents/mouseMoveHolding'

const boardOffset = 96 as Pixels

function LeftResize({
    timelineName,
    layoutRef,
}: {
    timelineName: string
    layoutRef: RefObject<HTMLDivElement>
}) {
    const resizeTipRef = useRef<HTMLDivElement>(null)
    const boardManager = useBoardManager()
    const timeline = useTimeline(timelineName)
    const player = usePlayerState()
    const { setOnMove, downOnTarget } = useMouseMoveHolding(resizeTipRef)

    const toMs = useCallback(
        (value: Pixels) =>
            Math.round(
                (value / boardManager.area) * player.duration
            ) as Milliseconds,
        [boardManager.area, player.duration]
    )

    const toPx = useCallback(
        (value: Milliseconds) =>
            ((value / player.duration) * boardManager.area) as Pixels,
        [boardManager.area, player.duration]
    )

    setOnMove(
        useCallback((abs: Pixels | number) => {
            console.log(abs)
        }, [])
    )

    return <ResizeTip ref={resizeTipRef} />
}

function RightResize({ timelineName }: { timelineName: string }) {
    const layoutRef = useRef<HTMLDivElement>(null)
    const boardManager = useBoardManager()
    const timeline = useTimeline(timelineName)
    const player = usePlayerState()
    const { setOnMove, downOnTarget } = useMouseMoveHolding(layoutRef)

    return <ResizeTip ref={layoutRef} />
}

export default function Component({
    line,
    weight,
    left,
    timelineName,
}: {
    line: number
    weight: Milliseconds
    left: Milliseconds
    timelineName: string
}) {
    const layoutRef = useRef<HTMLDivElement>(null)
    const boardManager = useBoardManager()
    const timeline = useTimeline(timelineName)
    const player = usePlayerState()
    const { setOnMove, targetOffset, downOnTarget } =
        useMouseMoveHolding(layoutRef)
    const specialKeys = useSpecialKey()
    const { ticks } = useTicks()

    const toMs = useCallback(
        (value: Pixels) =>
            Math.round(
                (value / boardManager.area) * player.duration
            ) as Milliseconds,
        [boardManager.area, player.duration]
    )

    const toPx = useCallback(
        (value: Milliseconds) =>
            ((value / player.duration) * boardManager.area) as Pixels,
        [boardManager.area, player.duration]
    )

    const dispatchItemUpdate = useCallback(
        (optLeft?: Milliseconds) => {
            const layout = layoutRef.current
            if (!layout || !timeline) return

            const boundary = layout.getBoundingClientRect()
            const left = optLeft
                ? optLeft
                : toMs((boundary.left - boardOffset) as Pixels)

            timeline.update(line, toMs(boundary.width as Pixels), left)
        },
        [line, timeline, toMs]
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

    const clampToSiblings = useCallback(
        (value: Milliseconds): Milliseconds => {
            const itemWidth = toMs(
                (layoutRef.current?.getBoundingClientRect().width ??
                    0) as Pixels
            )
            if (!timeline) return value

            const leftItem = timeline.items
                .filter((item) => item.line < line)
                .map((item) => {
                    return { item, delta: Math.abs(item.line - line) }
                })
                .sort((a, b) => b.delta - a.delta)
                .pop()?.item

            const rightItem = timeline.items
                .filter((item) => item.line > line)
                .map((item) => {
                    return { item, delta: Math.abs(item.line - line) }
                })
                .sort((a, b) => b.delta - a.delta)
                .pop()?.item

            if (leftItem && value < leftItem.left + leftItem.width)
                return (leftItem.left + leftItem.width) as Milliseconds

            if (rightItem && value + itemWidth > rightItem.left)
                return (rightItem.left - itemWidth) as Milliseconds

            return value as Milliseconds
        },
        [toMs, timeline, line]
    )

    const onMove = useCallback(
        (absX: number) => {
            const layout = layoutRef.current
            if (!layout || !timeline) return

            let x = toMs((absX - boardOffset - targetOffset.x) as Pixels)

            const itemDuration = toMs(
                layout.getBoundingClientRect().width as Pixels
            )

            if (!specialKeys.shift) x = clampToTick(x)

            let final = (x + boardManager.offset.ms) as Milliseconds

            final = clampToSiblings(final)

            if (final < 0) {
                final = 0 as Milliseconds
            } else if (final + itemDuration >= player.duration) {
                final = (player.duration - itemDuration) as Milliseconds
            }

            layout.style.left = toPx(final) + 'px'
            dispatchItemUpdate(final)
        },
        [
            boardManager.offset.ms,
            clampToSiblings,
            clampToTick,
            dispatchItemUpdate,
            player.duration,
            specialKeys.shift,
            targetOffset.x,
            timeline,
            toMs,
            toPx,
        ]
    )

    setOnMove(onMove)

    useEffect(() => {
        const layout = layoutRef.current
        if (!layout) return

        layout.style.width = toPx(weight) + 'px'
        layout.style.left = toPx(left) + 'px'
    }, [layoutRef, left, toPx, weight])

    return (
        <Layout ref={layoutRef} holding={downOnTarget}>
            <LeftResize layoutRef={layoutRef} timelineName={timelineName} />
            <Line number={line} />
            <RightResize timelineName={timelineName} />
        </Layout>
    )
}
