import Header from './header'
import Animation from './animation'
import SyncGradientBG from './gradients/syncGradient'

function Title() {
    return (
        <div className="flex justify-center text-center flex-col pt-[40px]">
            <span className="text-[64px] text-txt-2 font-bold tracking-wide">
                Effortlessly{' '}
                <span className="text-accent-blue relative">
                    <div className="-left-[93px] -top-[74px] absolute ">
                        <SyncGradientBG />
                    </div>
                    Sync
                </span>{' '}
                Lyrics
            </span>
            <span className="text-[64px] text-txt-2 font-bold tracking-wide">
                For Your Favorite Tracks
            </span>
        </div>
    )
}

function Description() {
    return (
        <div className="flex max-w-[800px] text-center py-[25px]">
            <span className="text-txt-1 text-[20px] leading-loose">
                Feel the Words as You Listen. Sync, Sing, and Connect with Every
                Beat. Unlock the Hidden Layers of Your Favorite Songs. Sync the
                Lyrics, Hear the Difference.
            </span>
        </div>
    )
}

export default function Layout() {
    return (
        <div className="flex flex-col items-center w-screen h-screen bg-bg-2 text-txt-2 overflow-y-auto overflow-x-hidden">
            <Header />
            <Title />
            <Description />
            <Animation />
        </div>
    )
}
