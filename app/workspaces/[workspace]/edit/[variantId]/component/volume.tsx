'use client'

import VolumeMaxIcon from '@/app/icons/volumeMax'
import Scrubber from './scrubber'
import { usePlayerDispatch, usePlayerState } from '@/app/player/state'

export default function Volume() {
    const { volume } = usePlayerState()
    const dispatch = usePlayerDispatch()

    return (
        <div className="flex items-center min-w-[150] h-full px-[10px] gap-[15px]">
            <VolumeMaxIcon className="min-w-[20px] min-h-[20px] fill-txt-1" />
            <Scrubber
                onChange={(value) =>
                    dispatch({ type: 'set-volume', payload: value })
                }
                value={volume}
                max={1}
            />
        </div>
    )
}
