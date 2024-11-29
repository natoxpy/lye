'use client'
import { Layout } from './Layout'
import { Canvas } from './Canvas'
import { useEffect, useRef } from 'react'
import { useCanvasResize } from './resizeCanvas'
import { useDraw } from './draw'
import { useBoardManager } from '../../states/boardManager'
import { usePlayerState } from '@/app/components/player/state'

export default function Component() {
    const layout = useRef<HTMLDivElement>(null)
    const canvas = useRef<HTMLCanvasElement>(null)
    const onResize = useCanvasResize(layout, canvas)
    const draw = useDraw(canvas)
    const { offset, width } = useBoardManager()
    const player = usePlayerState()

    onResize(() => {
        draw(width.ms, offset.ms, player.duration)
    })

    useEffect(() => {
        draw(width.ms, offset.ms, player.duration)
    }, [offset, width, draw, player.duration])

    return (
        <Layout ref={layout}>
            <Canvas ref={canvas} />
        </Layout>
    )
}
