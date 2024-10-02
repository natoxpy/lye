///
/// This component needs refactoring
///
import TimelineDetails from './TimelineDetails'
import { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '@/lib/hooks'

export default function FullView() {
    const rootDiv = useRef<HTMLDivElement>(null)
    const duration = useAppSelector((state) =>
        Math.floor((state.audioPlayer.audio?.duration ?? 0) * 1000)
    )

    const timedlines = useAppSelector((state) => state.timedlines)
    const [width, setWidth] = useState(0)

    useEffect(() => {
        if (!rootDiv.current) return
        setWidth(rootDiv.current.getBoundingClientRect().width)
    }, [rootDiv])

    useEffect(() => {
        const handleResize = () => {
            if (!rootDiv.current) return
            setWidth(rootDiv.current.getBoundingClientRect().width)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    })

    return (
        <div className="flex min-h-14">
            <div className="min-w-16 max-w-16 z-10 h-full bg-text-600"></div>
            <div
                className="grow flex flex-col bg-background-800 bg-gradient-to-b from-background-900  to-95% to-background-950 border-b-background-900 border-t-background-950 border-y-2"
                ref={rootDiv}
            >
                <div className="flex justify-between h-5 w-full">
                    <TimelineDetails duration={duration} divwidth={width} detailTime={1000} />
                </div>

                <div className="flex w-full h-5 relative">
                    {timedlines.primary.map((item, i) => (
                        <div
                            key={i}
                            className="border-text-800 border-[1px] absolute rounded-sm flex justify-center items-center bg-background-800 h-4"
                            style={{
                                width: ((item.end - item.start) / duration) * width + 'px',
                                left: (item.start / duration) * width + 'px'
                            }}
                        >
                            <div className="flex justify-center grow-[1]">
                                <span className="text-xs text-text-400 select-none">
                                    {item.displayLineNumber}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex w-full h-5 relative">
                    {timedlines.secondary.map((item, i) => (
                        <div
                            key={i}
                            className="border-text-800 border-[1px] absolute rounded-sm flex justify-center items-center bg-background-800 h-4"
                            style={{
                                width: ((item.end - item.start) / duration) * width + 'px',
                                left: (item.start / duration) * width + 'px'
                            }}
                        >
                            <div className="flex justify-center grow-[1]">
                                <span className="text-xs text-text-400 select-none">
                                    {item.displayLineNumber}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
