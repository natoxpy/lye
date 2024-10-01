import { UHash } from '@/app/cachedb'
import { Line, MouseActivities } from '../internalState'

export default function Component({
    line,
    triggerActivity,
    duration,
    width
}: {
    line: Line
    duration: number
    width: number
    triggerActivity: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        activity: MouseActivities,
        target: UHash
    ) => void
}) {
    return (
        <>
            <div
                id={`detail-item-${line.uhash}`}
                className="border-text-800 border-[1px] absolute rounded flex justify-center items-center bg-background-800 h-8"
                style={{
                    top: line.timeline == 'primary' ? '20px' : '55px',
                    width: ((line.end - line.start) / duration) * width + 'px',
                    left: (line.start / duration) * width + 'px'
                }}
            >
                <div
                    onMouseDown={(e) => {
                        triggerActivity(e, 'resize-left', line.uhash)
                    }}
                    className="left-0 absolute cursor-w-resize w-2 h-full"
                ></div>
                <div
                    onMouseDown={(e) => {
                        triggerActivity(e, 'move', line.uhash)
                    }}
                    className="flex justify-center cursor-move grow-[1]"
                >
                    <span className="text-text-400 select-none">{line.displayLine}</span>
                </div>
                <div
                    onMouseDown={(e) => {
                        triggerActivity(e, 'resize-right', line.uhash)
                    }}
                    className="right-0 absolute w-2 h-full cursor-w-resize"
                ></div>
            </div>
        </>
    )
}
