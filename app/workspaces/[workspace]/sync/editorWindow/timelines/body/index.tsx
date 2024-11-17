'use client'
import Timeline from '../components/timeline/component'
import { Layout, TimelineCursor, Timelines, TickBar } from './layout'

export default function Component() {
    return (
        <Layout
            timelineCursor={<TimelineCursor />}
            tickbar={<TickBar />}
            board={
                <Timelines>
                    <Timeline name="main" />
                    <Timeline name="secondary" />
                    <Timeline name="third" />
                    <Timeline name="fourth" />
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
