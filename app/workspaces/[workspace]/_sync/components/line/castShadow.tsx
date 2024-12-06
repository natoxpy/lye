import { useEffect, useRef } from 'react'
import { useLocalTimelineState } from '../../states/timeline'

export default function Component() {
    const rootRef = useRef<HTMLDivElement>(null)
    const { outsideLineTarget, hideOutsideShadow } = useLocalTimelineState()

    useEffect(() => {
        const root = rootRef.current
        if (root == undefined) return

        const mouseMove = (e: MouseEvent) => {
            const itemH = 35
            const itemW = 45
            const maxh = document.body.getBoundingClientRect().height
            const maxw = document.body.getBoundingClientRect().width
            let midX = e.clientX - itemW / 2
            let midY = e.clientY - itemH / 2

            if (e.clientX - itemW / 2 < 0) midX = 0
            else if (e.clientX + itemW / 2 > maxw) midX = maxw - itemW

            if (e.clientY - itemH / 2 < 0) midY = 0
            else if (e.clientY + itemH / 2 > maxh) midY = maxh - itemH

            root.style.left = midX + 'px'
            root.style.top = midY + 'px'
        }

        document.addEventListener('mousemove', mouseMove)

        return () => {
            document.removeEventListener('mousemove', mouseMove)
        }
    })

    return (
        <div
            ref={rootRef}
            style={{
                display:
                    outsideLineTarget !== null && hideOutsideShadow == false
                        ? 'flex'
                        : 'none',
            }}
            className="absolute w-[45px] h-[35px] z-50 pointer-events-none cursor-move bg-bg-5 border-2 border-accent-1 opacity-35 rounded-[6px]"
        ></div>
    )
}
