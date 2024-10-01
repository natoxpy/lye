import TimelineTicks from './components/TimelineTicks'
import { useInternalSelector } from './internalState'

export default function Component() {
    const duration = useInternalSelector((state) => state.player.duration)
    const width = useInternalSelector((state) => state.root.width)

    if (duration === undefined || width === undefined) return <></>

    return (
        <>
            <div className="flex justify-between h-4 w-full">
                <TimelineTicks detailTime={1000} duration={duration} divwidth={width} />
            </div>
        </>
    )
}
