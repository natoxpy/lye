import EyeOpenIcon from '@/app/icons/eyeOpen'
// import EyeCloseIcon from '@/app/icons/eyeClose'
import LockedIcon from '@/app/icons/locked'
// import UnlockedIcon from '@/app/icons/unlocked'

function Timeline({ last }: { last?: boolean }) {
    return (
        <div
            style={{
                borderTopWidth: '1px',
                borderBottomWidth: last ? '1px' : '',
            }}
            className="flex gap-[18px] stroke-txt-1 items-center justify-center w-full h-[36px] border-bg-2"
        >
            <EyeOpenIcon />
            <LockedIcon />
        </div>
    )
}

function Primary() {
    return <Timeline />
}

function Secondary() {
    return <Timeline last />
}

export default function Layout() {
    return (
        <div className="gap-3 z-30 h-full min-w-[96px] bg-bg-5 flex flex-col items-center border-r-2 border-bg-2 justify-center">
            <div className="w-full h-[28px]" />
            <div className="w-full h-full py-[10px]">
                <Primary />
                <Secondary />
            </div>
        </div>
    )
}
