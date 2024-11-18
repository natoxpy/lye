import ControlsComponent from './controls/index'
import TimelineComponent from './timelines'

export default function Component() {
    return (
        <div className="flex flex-col w-full bg-bg-1 min-h-[152px]">
            <ControlsComponent />
            <TimelineComponent />
        </div>
    )
}
