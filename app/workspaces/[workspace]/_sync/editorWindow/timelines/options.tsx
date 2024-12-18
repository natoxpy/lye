'use client'
import LockedIcon from '@/app/components/icons/locked'
import { usePlayerState } from '@/app/components/player/state'
import { formatMS } from '@/utils/time'

function Timeline() {
    return (
        <div className="flex gap-[18px] stroke-bg-6 items-center justify-center w-full min-h-[65px]">
            <div className="cursor-not-allowed">
                <LockedIcon />
            </div>
        </div>
    )
}

function Primary() {
    return <Timeline />
}

export default function Layout() {
    const player = usePlayerState()
    return (
        <div className="z-30 h-full min-w-[96px] bg-bg-5 flex flex-col items-center border-r-[2px] border-bg-3 justify-center">
            <div className="flex justify-center items-center w-full min-h-[28px] select-none">
                <span className="text-txt-1 text-xs">
                    {formatMS(player.currentTime)}
                </span>
            </div>

            <div className="w-full h-full py-[10px]">
                <Primary />
            </div>
        </div>
    )
}
