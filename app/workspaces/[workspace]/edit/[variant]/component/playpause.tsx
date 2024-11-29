import PlayIcon from '@/app/components/icons/play'
import PauseIcon from '@/app/components/icons/pause'
import {
    usePlayerDispatch,
    usePlayerState,
} from '@/app/components/player/state'

export default function PLayPause() {
    const { paused } = usePlayerState()
    const dispatch = usePlayerDispatch()
    const PlayerStateIcon = paused ? PlayIcon : PauseIcon

    return (
        <button
            onClick={() => {
                dispatch({
                    type: 'set-paused',
                    payload: !paused,
                })
            }}
            className="outline-none cursor-pointer group flex items-center justify-center h-full min-w-[50px] w-[50px]"
        >
            <PlayerStateIcon className="group-hover:fill-txt-2 stroke-txt-2 group-focus-visible:stroke-accent-1" />
        </button>
    )
}
