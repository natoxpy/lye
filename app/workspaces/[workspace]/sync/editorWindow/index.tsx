import ControlsComponent from './controls'
import MinimapComponent from './minimap'
import TimelineComponent from './timelines'

export default function Component() {
    return (
        <div className="flex flex-col w-full bg-bg-1 h-[208px]">
            <ControlsComponent />
            <MinimapComponent />
            <TimelineComponent />
        </div>
    )
}
