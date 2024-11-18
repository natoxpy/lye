'use client'
import { Layout } from './layout'
import Timeline from '../components/timeline/component'
import TickBar from '../components/tickbar/component'
import TimelineCursor from '../components/timeCursor/component'
import Timelines from '../components/timelines/component'

export default function Component() {
    return (
        <Layout
            timelineCursor={<TimelineCursor leftOffset={96} />}
            tickbar={<TickBar />}
            board={
                <Timelines>
                    <Timeline name="main" />
                </Timelines>
            }
        ></Layout>
    )
}

// export default function Layout() {
//     const lines = useAppSelector((state) => state.syncLines.lines)
//     const primaryLines = lines.filter((item) => item.timeline === 'primary')
//     const secondaryLines = lines.filter((item) => item.timeline === 'secondary')
//
//     return (
//         <div className="relative flex flex-col w-[calc(100%-96px)]">
//             <TimelineCursor />
//             <TickBar />
//             <Timelines>
//                 <div className="flex w-full items-center grow">
//                     {primaryLines.map((line, idx) => (
//                         <TimelineItem
//                             key={idx}
//                             number={line.lineNumber}
//                             start={line.startMs}
//                             duration={line.durationMs}
//                         />
//                     ))}
//
//                     <MoveTemplate timeline="primary" />
//                     <TrueMoveTemplate timeline="primary" />
//                 </div>
//                 <div className="flex w-full items-center grow">
//                     {secondaryLines.map((line, idx) => (
//                         <TimelineItem
//                             key={idx}
//                             number={line.lineNumber}
//                             start={line.startMs}
//                             duration={line.durationMs}
//                         />
//                     ))}
//
//                     <MoveTemplate timeline="secondary" />
//                     <TrueMoveTemplate timeline="secondary" />
//                 </div>
//             </Timelines>
//         </div>
//     )
// }
//
