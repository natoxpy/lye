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
    const changeOffset = useSynchronizer((state) => state.changeOffset)
    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!container.current) return
        const el = container.current

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            e.stopPropagation()

            const delta = e.deltaX == 0 ? e.deltaY : e.deltaX
            changeOffset(delta * 68)
        }

        el.addEventListener('wheel', onWheel, { passive: false })

        return () => {
            el.removeEventListener('wheel', onWheel)
        }
    }, [container, changeOffset])

    return (
        <div className="h-full bg-bg-4">
            {options}

            <div ref={container}>
                {tickbar}
                {body}
            </div>
        </div>
    )
}
