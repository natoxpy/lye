import { useRef } from 'react'
import { Layout, Canvas } from './layout'
import { useCanvasResize } from './resizeCanvas'
import { useDraw } from './draw'

export default function Component() {
    const layout = useRef<HTMLDivElement>(null)
    const canvas = useRef<HTMLCanvasElement>(null)
    const onResize = useCanvasResize(layout, canvas)
    const draw = useDraw(canvas)

    onResize(() => draw())

    return (
        <Layout ref={layout}>
            <Canvas ref={canvas} />
        </Layout>
    )
}
