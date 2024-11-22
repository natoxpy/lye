import ControlsComponent from './controls/index'
import TimelineComponent from './timelines'

export default function Component() {
    return (
        <div className="flex flex-col w-full">
            <ControlsComponent />
            <TimelineComponent />
        </div>
    )
}
