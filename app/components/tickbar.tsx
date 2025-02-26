'use client'
import { RefObject, useCallback, useEffect, useRef } from 'react'
import generateTicks, { BigTick, SmallTick } from '@/utils/generate_ticks'
import { Milliseconds } from '@/utils/units'
import { formatMS } from '@/utils/time'

const colors = {
    unaccented_1: 'rgb(45,51,57)',
    text_3: 'rgb(101,115,125)',
}

function clear(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

export function draw(
    canvas: HTMLCanvasElement,
    timeWidth: Milliseconds,
    timeOffset: Milliseconds,
    duration: Milliseconds,
    options: { tickLength: Milliseconds; inbetweenTicks: number } = {
        tickLength: 10_000 as Milliseconds,
        inbetweenTicks: 10,
    }
) {
    const dpr = window.devicePixelRatio
    const { tickLength, inbetweenTicks } = options
    clear(canvas)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const ticks = generateTicks({
        config: {
            tickLength,
            inbetweenTicks,
        },
        player: {
            duration,
        },
        window: {
            timeOffset,
            timeWidth,
        },
    })

    const timeToPx = (t: number) => (t / timeWidth) * (canvas.width / dpr)

    ctx.font = '12px Inter, serif'

    for (const tick of ticks) {
        if (tick instanceof SmallTick) {
            ctx.fillRect(timeToPx(tick.value), 0, 1, 6)
        } else if (tick instanceof BigTick) {
            ctx.fillRect(timeToPx(tick.value), 0, 1, 18)
            ctx.fillStyle = colors.text_3
            ctx.fillText(
                formatMS(tick.value + timeOffset),
                timeToPx(tick.value) + 5,
                23
            )
            ctx.fillStyle = colors.unaccented_1
        }
    }
}

export function useDraw(canvas: RefObject<HTMLCanvasElement>) {
    return (
        width: Milliseconds,
        offset: Milliseconds,
        playerDuration: Milliseconds
    ) => {
        if (!canvas.current) return
        draw(canvas.current, width, offset, playerDuration)
    }
}

export function fitCanvasOnParent(
    parent: HTMLDivElement,
    canvas: HTMLCanvasElement
) {
    const parentBoundaryBox = parent.getBoundingClientRect()
    const width = parentBoundaryBox.width
    const staticHeight = 28
    const ctx = canvas.getContext('2d')

    const dpr = window.devicePixelRatio ?? 1

    canvas.width = width * dpr
    canvas.height = staticHeight * dpr
    canvas.style.height = staticHeight + 'px'

    ctx?.scale(dpr, dpr)
}

export function getTickbarWidth() {
    return 0
}

export default function Component({
    maxWidth,
    duration,
    offset,
    onFrameWidth,
}: {
    offset: Milliseconds
    maxWidth: number
    duration: Milliseconds
    onFrameWidth?: (widthMs: Milliseconds, widthPx: number) => void
    onFullWidth?: (widthMs: Milliseconds, widthPx: number) => void
}) {
    const refparent = useRef<HTMLDivElement>(null)
    const refcanvas = useRef<HTMLCanvasElement>(null)
    const draw = useDraw(refcanvas)

    const getWidth = useCallback(() => {
        const wp = refparent.current?.getBoundingClientRect().width as 0
        const wd = (duration * (wp / maxWidth)) as Milliseconds
        if (onFrameWidth)
            onFrameWidth(Math.floor(wd) as Milliseconds, Math.floor(wp))
        return wd
    }, [duration, maxWidth, onFrameWidth])

    const resize = useCallback(() => {
        const parent = refparent.current!
        fitCanvasOnParent(parent, refcanvas.current!)
        draw(getWidth(), offset, duration as Milliseconds)
    }, [draw, duration, offset, getWidth])

    useEffect(() => {
        resize()
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    })

    return (
        <div ref={refparent} className="w-screen bg-bg-4">
            <canvas
                ref={refcanvas}
                style={{
                    height: 28 + 'px',
                }}
                className="w-full rendering-pixelated"
                height={28}
            />
        </div>
    )
}
