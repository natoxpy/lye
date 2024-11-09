'use client'
import { usePlayerState } from '@/app/player/state'
import { formatMS } from '@/app/utils/time'

export default function Component() {
    const { currentTime } = usePlayerState()
    return (
        <div className="border-b-[3px] border-bg-2 bg-bg-4 w-full h-full  min-h-[56px]">
            <div className="flex items-center justify-center w-[96px] h-full bg-bg-5 border-r-2 border-bg-2">
                <span className="text-[12px] text-txt-1 select-none">
                    {formatMS(currentTime)}
                </span>
            </div>
            <div></div>
        </div>
    )
}
