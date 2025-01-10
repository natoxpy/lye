import { RefObject } from 'react'
import generateTicks, {
    BigTick,
    SmallTick,
} from '@/app/workspaces/[workspace]/_sync/utils/generateCanvasTicks'
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
        if (tick instanceof SmallTick)
            ctx.fillRect(timeToPx(tick.value), 0, 1, 6)
        else if (tick instanceof BigTick) {
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
