'use client'

import { useSynchronizer } from '@/states/hooks'
import { useEffect, useRef } from 'react'

export default function Layout({
    options,
    tickbar,
    body,
}: {
    options: React.ReactNode
    tickbar: React.ReactNode
    body: React.ReactNode
}) {
    const {changeOffset, frame, duration} = useSynchronizer((state) => state)
    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!container.current) return
        const el = container.current

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            e.stopPropagation()

            const delta = e.deltaX == 0 ? e.deltaY : e.deltaX
            changeOffset(delta * (frame.duration/duration) * 50 * -1)
        }

        el.addEventListener('wheel', onWheel, { passive: false })

        return () => {
            el.removeEventListener('wheel', onWheel)
        }
    }, [container, changeOffset, frame, duration])

    return (
        <div className="flex flex-col h-full gap-2">
            <div className="bg-bg-3 border-2 border-unaccent-accent-1 rounded-md overflow-hidden">{options}</div>

            <div className="bg-bg-3 px-1 border-2 border-unaccent-accent-1 rounded-md overflow-hidden h-fit" ref={container}>
                {tickbar}
                {body}
            </div>
        </div>
    )
}
