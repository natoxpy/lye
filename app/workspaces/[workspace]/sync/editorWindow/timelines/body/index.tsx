'use client'
import Timebar from './timebar'
import State from './state'
import { useEffect, useRef } from 'react'
import { usePlayerState } from '@/app/player/state'
import { useLocalState } from './state'

function Timelines({ children }: { children: React.ReactNode }) {
    const elementRef = useRef<HTMLDivElement>(null)
    const childElementRef = useRef<HTMLDivElement>(null)
    const { setTimeOffset, setTimeWidth, setCanvasWidthPx } = useLocalState()
    const { duration } = usePlayerState()

    useEffect(() => {
        const element = elementRef.current
        const childElement = childElementRef.current
        if (element === null || childElement == null) return

        // setTimeout(() => {
        //     element.scrollTo(element.scrollLeft + 10, 0)
        // }, 10)

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
            <div
                ref={childElementRef}
                className="relative flex flex-col py-[10px] bg-bg-4 w-[4000px] h-full"
            >
                {children}
            </div>
        </div>
    )
}

function Item({ start, duration }: { start: number; duration: number }) {
    const { timeWidth, canvasWidthPx } = useLocalState()
    const timeToPx = (t: number) => Math.floor((t / timeWidth) * canvasWidthPx)

    const left = timeToPx(start) + 'px'
    const width = timeToPx(duration) + 'px'

    return (
        <div
            style={{ left, width }}
            className="flex cursor-pointer items-center justify-center absolute rounded-[6px] h-[32px] bg-unaccent-accent-1"
        >
            <span className="text-[16px] text-txt-2 select-none">2</span>
        </div>
    )
}

export default function Layout() {
    return (
        <div className="flex flex-col w-[calc(100%-96px)]">
            <State>
                <Timebar />
                <Timelines>
                    <div className="flex w-full items-center grow">
                        <Item start={1000 * 10} duration={5000} />
                        <Item start={1000 * 60 * 1.5} duration={10000} />
                        <Item start={1000 * 60 * 2} duration={5000} />
                    </div>
                    <div className="flex w-full items-center grow">
                        <Item start={1000 * 10} duration={3000} />
                        <Item start={1000 * 60} duration={6000} />
                    </div>
                </Timelines>
            </State>
        </div>
    )
}
