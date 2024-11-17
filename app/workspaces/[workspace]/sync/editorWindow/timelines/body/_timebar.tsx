import { usePlayerState } from '@/app/player/state'
import { Ref, useEffect, useRef } from 'react'
import { useLocalTimelineState } from '../../../states/timeline'
import { Pixels } from '@/app/utils/units'

const colors = {
    unaccented_1: 'rgb(45,51,57)',
    text_3: 'rgb(101,115,125)',
}

function useMarkdraw(canvas: Ref<HTMLCanvasElement>) {
    console.log(canvas)
    const { timeOffset, timeWidth } = useLocalTimelineState()

    // ctx.clearRect(0, 0, width, height)
    // ctx.fillStyle = colors.unaccented_1
}

export default function Component() {
    const canvas = useRef<HTMLCanvasElement>(null)
    const { duration } = usePlayerState()
    const { timeOffset, timeWidth } = useLocalTimelineState()

    useMarkdraw(canvas)

    useEffect(() => {
        const canvaselement = canvas.current
        if (canvaselement == null) return

        const ctx = canvaselement.getContext('2d')
        if (ctx == null) return

        const resize = () => {
            const width = (document.body.getBoundingClientRect().width -
                96) as Pixels
            const height = document.body.getBoundingClientRect()
                .height as Pixels

            canvaselement.width = width
            // DrawMarks(ctx, width, height)
        }

        window.addEventListener('resize', resize)

        resize()

        return () => window.removeEventListener('resize', resize)
    }, [canvas, duration, timeWidth, timeOffset])

    return (
        <div className="w-full h-[28px]">
            <canvas
                width={100}
                height={28}
                className="bg-bg-4 rendering-pixelated"
                ref={canvas}
            />
        </div>
    )
}
