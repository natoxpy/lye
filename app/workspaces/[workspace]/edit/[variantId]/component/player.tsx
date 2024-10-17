'use client'

import PlaybackRate from './playbackRate'
import Scrubber from './scrubber'
import TimeComponent from './TimeComponent'
import PLayPause from './playpause'
import Volume from './volume'
import { usePlayerDispatch, usePlayerState } from '@/app/player/state'

export default function Component() {
    const { duration, currentTime } = usePlayerState()
    const dispatch = usePlayerDispatch()

    const onChangeCurrentTime = (value: number) => {
        dispatch({
            type: 'sync-currentTime',
            payload: value / 1000,
        })

        dispatch({
            type: 'set-currentTime',
            payload: value,
        })
    }

    return (
        <div className="flex items-center w-full min-h-[50px] bg-bg-3">
            <div className="flex px-[25px] h-[32px] w-full">
                <PlaybackRate />
                <PLayPause />
                <TimeComponent milliseconds={currentTime} />
                <Scrubber
                    onChange={onChangeCurrentTime}
                    value={currentTime}
                    max={duration}
                />
                <TimeComponent milliseconds={duration} />
                <Volume />
            </div>
        </div>
    )
}
