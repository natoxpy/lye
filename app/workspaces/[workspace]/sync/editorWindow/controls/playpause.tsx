'use client'
import PlayIcon from '@/app/icons/play'
import PauseIcon from '@/app/icons/pause'
import { usePlayerDispatch, usePlayerState } from '@/app/player/state'

export default function PlayPause() {
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
            className="outline-none cursor-pointer group flex items-center justify-center h-full min-w-[50px] w-[50px] min-h-[32px]"
        >
            <PlayerStateIcon
                width={16}
                height={16}
                className="group-hover:fill-txt-2 stroke-txt-2 group-focus-visible:stroke-accent-1"
            />
        </button>
    )
}
