import { usePlayerState } from '@/app/player/state'
import redraw from './timebar-canvas'
import { useEffect, useRef } from 'react'
import { useLocalState } from './state'

export default function Component() {
    const canvas = useRef<HTMLCanvasElement>(null)
    const { duration } = usePlayerState()
    const { timeOffset, timeWidth, setVisibleMarks } = useLocalState()

    useEffect(() => {
        const canvaselement = canvas.current
        if (canvaselement == null) return

        const ctx = canvaselement.getContext('2d')
        if (ctx == null) return

        const resize = () => {
            const width = document.body.getBoundingClientRect().width - 96
            const height = document.body.getBoundingClientRect().height

            canvaselement.width = width

            redraw({
                canvas: {
                    canvas: canvaselement,
                    ctx,
                    width,
                    height,
                },
                player: {
                    duration,
                },
                window: {
                    timeOffset,
                    timeWidth,
                },
                state: {
                    setVisibleMarks,
                },
            })
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
