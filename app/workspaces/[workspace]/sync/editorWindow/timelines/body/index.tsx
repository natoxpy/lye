'use client'
import Timebar from './timebar'
import State from './state'
import Timelines from './timelines'
import TimelineItem from './timelines/item'
import { MoveTemplate } from './timelines/item'
import { useAppSelector } from '@/store/hooks'

export default function Layout() {
    const lines = useAppSelector((state) => state.syncLines.lines)
    const primaryLines = lines.filter((item) => item.timeline === 'primary')
    const secondaryLines = lines.filter((item) => item.timeline === 'secondary')

    return (
        <div className="flex flex-col w-[calc(100%-96px)]">
            <State>
                <Timebar />
                <Timelines>
                    <div className="flex w-full items-center grow">
                        {primaryLines.map((line, idx) => (
                            <TimelineItem
                                key={idx}
                                number={line.lineNumber}
                                start={line.startMs}
                                duration={line.durationMs}
                            />
                        ))}

                        <MoveTemplate />
                    </div>
                    <div className="flex w-full items-center grow">
                        {secondaryLines.map((line, idx) => (
                            <TimelineItem
                                key={idx}
                                number={line.lineNumber}
                                start={line.startMs}
                                duration={line.durationMs}
                            />
                        ))}
                    </div>
                </Timelines>
            </State>
        </div>
    )
}