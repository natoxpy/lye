'use client'
import { RefObject, useCallback, useEffect, useRef } from 'react'
import generateTicks, { BigTick, SmallTick } from '@/utils/generate_ticks'
import { Milliseconds } from '@/utils/units'
import { formatMS } from '@/utils/time'
import { useSynchronizer } from '@/states/hooks'

const colors = {
    tick: 'hsl(211, 22%, 21%)',
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
    options: { tickLength: Milliseconds | number; inbetweenTicks: number } = {
        tickLength: 10_000,
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
            tickLength: tickLength as Milliseconds,
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

    ctx.fillStyle = colors.tick
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
            ctx.fillStyle = colors.tick
        }
    }
}

export function useDraw(canvas: RefObject<HTMLCanvasElement>) {
    const { frame, duration, maxwidth } = useSynchronizer((state) => state)

    return (
        width: Milliseconds,
        offset: Milliseconds,
        playerDuration: Milliseconds
    ) => {
        if (!canvas.current) return
        const vstep = 0.1
        const targetL = 200

        let v = 0
        let l = Infinity

        while (l > targetL) {
            v += 0.1
            l = frame / v
        }
        l = frame / (v - vstep)

        const t = (l / maxwidth) * duration
        const final =
            t > 800 ? Math.round(t / 1000) * 1000 : Math.ceil(t / 100) * 100

        draw(canvas.current, width, offset, playerDuration, {
            tickLength: final,
            inbetweenTicks: 5,
        })
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
    onFrameWidth?: (widthPx: number) => void
    onFullWidth?: (widthMs: Milliseconds, widthPx: number) => void
}) {
    const refparent = useRef<HTMLDivElement>(null)
    const refcanvas = useRef<HTMLCanvasElement>(null)
    const draw = useDraw(refcanvas)

    const getWidth = useCallback(() => {
        const wp = refparent.current?.getBoundingClientRect().width as 0
        const wd = (duration * (wp / maxWidth)) as Milliseconds
        if (onFrameWidth) onFrameWidth(Math.floor(wp))
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
        <div ref={refparent} className="w-full bg-bg-3">
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
