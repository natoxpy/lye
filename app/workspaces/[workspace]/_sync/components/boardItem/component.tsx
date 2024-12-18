import { RefObject, useCallback, useEffect, useRef } from 'react'
import { Layout, Line, ResizeTip } from './layout'
import { useTicks } from '../tickbar/useTicks'
import { Milliseconds, Pixels } from '@/utils/units'
import { usePlayerState } from '@/app/components/player/state'
import { useSpecialKey } from '../../actionEvents/useSpecialKey'
import { useBoardManager, useTimeline } from '../../states/boardManager'
import useMouseMoveHolding from '../../actionEvents/mouseMoveHolding'

const boardOffset = 96 as Pixels

function LeftResize({
    timelineName,
    line,
    layoutRef,
}: {
    timelineName: string
    line: number
    layoutRef: RefObject<HTMLDivElement>
}) {
    const resizeTipRef = useRef<HTMLDivElement>(null)
    const boardManager = useBoardManager()
    const timeline = useTimeline(timelineName)
    const player = usePlayerState()
    const { ticks } = useTicks()
    const { setOnMove, downOnTarget, targetOffset } =
        useMouseMoveHolding(resizeTipRef)
    const specialKeys = useSpecialKey()

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

    const updateLeft = useCallback(
        (left: Milliseconds) => {
            const layout = layoutRef.current
            const item = timeline?.getItem(line)
            if (!timeline || !layout || !item) return

            layout.style.width =
                toPx((item.right - left) as Milliseconds) + 'px'
            layout.style.left = toPx(left) + 'px'

            timeline.updateLeft(line, left)
        },
        [layoutRef, timeline, line, toPx]
    )

    const clampToSiblings = useCallback(
        (value: Milliseconds): Milliseconds => {
            if (!timeline) return value

            const leftItem = timeline.items
                .filter((item) => item.line < line)
                .map((item) => {
                    return { item, delta: Math.abs(item.line - line) }
                })
                .sort((a, b) => b.delta - a.delta)
                .pop()?.item

            if (
                leftItem &&
                value < leftItem.left + (leftItem.right - leftItem.left)
            )
                return (leftItem.left +
                    (leftItem.right - leftItem.left)) as Milliseconds

            return value as Milliseconds
        },
        [line, timeline]
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
            (absX: number) => {
                const item = timeline?.getItem(line)
                if (!timeline || !item) return

                let x = toMs((absX - boardOffset - targetOffset.x) as Pixels)

                if (!specialKeys.shift) x = clampToTick(x)

                let final = (x + boardManager.offset.ms) as Milliseconds

                final = clampToSiblings(final)

                if (final < 0) final = 0 as Milliseconds
                if (item.right - final < 2_000)
                    final = (item.right - 2000) as Milliseconds

                updateLeft(final)
            },
            [
                timeline,
                line,
                toMs,
                targetOffset.x,
                specialKeys.shift,
                clampToTick,
                boardManager.offset.ms,
                clampToSiblings,
                updateLeft,
            ]
        )
    )

    return <ResizeTip holding={downOnTarget} ref={resizeTipRef} />
}

function RightResize({
    timelineName,
    line,
    layoutRef,
}: {
    timelineName: string
    line: number
    layoutRef: RefObject<HTMLDivElement>
}) {
    const resizeTipRef = useRef<HTMLDivElement>(null)
    const boardManager = useBoardManager()
    const timeline = useTimeline(timelineName)
    const player = usePlayerState()
    const { ticks } = useTicks()
    const { setOnMove, downOnTarget, targetOffset } =
        useMouseMoveHolding(resizeTipRef)
    const specialKeys = useSpecialKey()

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

    const clampToSiblings = useCallback(
        (value: Milliseconds): Milliseconds => {
            if (!timeline) return value

            const rightItem = timeline.items
                .filter((item) => item.line > line)
                .map((item) => {
                    return { item, delta: Math.abs(item.line - line) }
                })
                .sort((a, b) => b.delta - a.delta)
                .pop()?.item

            if (rightItem && value > rightItem.left)
                return rightItem.left as Milliseconds

            return value as Milliseconds
        },
        [timeline, line]
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

    const updateRight = useCallback(
        (right: Milliseconds) => {
            const layout = layoutRef.current
            const item = timeline?.getItem(line)
            if (!timeline || !layout || !item) return

            layout.style.width =
                toPx((right - item.left) as Milliseconds) + 'px'
            timeline.updateRight(line, right)
        },
        [line, timeline, layoutRef, toPx]
    )

    setOnMove(
        useCallback(
            (absX: number) => {
                const item = timeline?.getItem(line)
                if (!timeline || !item) return

                let x = toMs((absX - boardOffset - targetOffset.x) as Pixels)

                if (!specialKeys.shift) x = clampToTick(x)

                let final = (x + boardManager.offset.ms) as Milliseconds

                final = clampToSiblings(final)

                if (final - item.left < 2000)
                    final = (item.left + 2000) as Milliseconds

                updateRight(final)
            },
            [
                timeline,
                line,
                toMs,
                targetOffset.x,
                specialKeys.shift,
                clampToTick,
                boardManager.offset.ms,
                clampToSiblings,
                updateRight,
            ]
        )
    )

    return <ResizeTip holding={downOnTarget} ref={resizeTipRef} />
}

export default function Component({
    line,
    width,
    left,
    timelineName,
}: {
    line: number
    width: Milliseconds
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

            timeline.update(
                line,
                left,
                (left + toMs(boundary.width as Pixels)) as Milliseconds
            )
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

            if (
                leftItem &&
                value < leftItem.left + (leftItem.right - leftItem.left)
            )
                return (leftItem.left +
                    (leftItem.right - leftItem.left)) as Milliseconds

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

        layout.style.left = toPx(left) + 'px'
        layout.style.width = toPx(width) + 'px'
    }, [layoutRef, left, toPx, width])

    return (
        <Layout ref={layoutRef} holding={downOnTarget}>
            <LeftResize
                line={line}
                layoutRef={layoutRef}
                timelineName={timelineName}
            />
            <Line number={line} />
            <RightResize
                line={line}
                layoutRef={layoutRef}
                timelineName={timelineName}
            />
        </Layout>
    )
}
