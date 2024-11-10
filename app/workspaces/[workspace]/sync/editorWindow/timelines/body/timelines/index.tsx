import Handler from './handler'
import { usePlayerState } from '@/app/player/state'
import { useEffect, useRef } from 'react'
import { useLocalTimelineState } from '../../../../states/timeline'

export default function Timelines({ children }: { children: React.ReactNode }) {
    const elementRef = useRef<HTMLDivElement>(null)
    const childElementRef = useRef<HTMLDivElement>(null)
    const { setTimeOffset, setTimeWidth, setCanvasWidthPx, setScrollWidthPx } =
        useLocalTimelineState()
    const { duration } = usePlayerState()

    useEffect(() => {
        const element = elementRef.current
        const childElement = childElementRef.current
        if (element === null || childElement == null) return

        setScrollWidthPx(childElement.getBoundingClientRect().width)

        const scroll = () => {
            const left = element.scrollLeft
            const childWidth = childElement.getBoundingClientRect().width
            const width = element.getBoundingClientRect().width

            setCanvasWidthPx(width)

            const leftPct = left / childWidth
            const widthPct = width / childWidth

            setTimeOffset(Math.floor(duration * leftPct))
            setTimeWidth(Math.floor(duration * widthPct))
        }
        const resize = () => scroll()

        element.addEventListener('scroll', scroll)
        window.addEventListener('resize', resize)
        scroll()

        return () => {
            element.removeEventListener('scroll', scroll)
            window.removeEventListener('resize', resize)
        }
    })

    return (
        <div
            ref={elementRef}
            className="grow min-w-full h-full no-scrollbar overflow-auto overscroll-none border-t-[1px] border-bg-2"
        >
            <Handler />
            <div
                ref={childElementRef}
                className="relative flex flex-col py-[10px] bg-bg-4 w-[4000px] h-full"
            >
                {children}
            </div>
        </div>
    )
}
