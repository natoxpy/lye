import CircleGradient from '../gradients/circleGradient'
import TopGradient from '../gradients/TopGradient'
import EditLogo from '../gradients/EditLogo'
import SyncLogo from '../gradients/SyncLogo'
import PerfectSyncLogo from '../gradients/perfectSyncLogo'

function Frame({ children }: { children: React.ReactNode }) {
    return (
        <div
            style={{
                background: 'hsla(210,15%,5%,.35)',
            }}
            className="z-50 w-[1098px] h-[647px] p-[20px] rounded-[20px] select-none"
        >
            {children}
        </div>
    )
}

function GradientBg({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative w-fit h-fit pt-[50px]">
            <div className="z-10 relative">{children}</div>
            <div className="left-[688px] -top-[215px] absolute">
                <TopGradient />
            </div>
            <div className="-left-[230px] top-[260px] absolute">
                <CircleGradient />
            </div>
        </div>
    )
}

function Header() {
    return (
        <div
            style={{
                background: 'hsla(210,15%,5%,.15)',
            }}
            className="flex w-full h-[35px]"
        >
            <div className="flex items-center w-full px-[26px]">
                <div className="flex items-center justify-center gap-[10px]">
                    <div
                        style={{
                            background: 'hsla(245,8%,17%,.15)',
                        }}
                        className="w-[7px] h-[7px] rounded-full"
                    ></div>
                    <div
                        style={{
                            background: 'hsla(245,8%,17%,.15)',
                        }}
                        className="w-[7px] h-[7px] rounded-full"
                    ></div>{' '}
                    <div
                        style={{
                            background: 'hsla(245,8%,17%,.15)',
                        }}
                        className="w-[7px] h-[7px] rounded-full"
                    ></div>
                </div>
            </div>
            <div className="flex items-center justify-center w-full text-txt-2 opacity-75">
                In Hell We Live, Lament
            </div>
            <div className="w-full"></div>
        </div>
    )
}

function Window({ children }: { children: React.ReactNode }) {
    return (
        <div
            style={{
                background: 'hsla(206,18%,8%,.15)',
                border: '1px solid hsla(245,8%,17%,.50)',
            }}
            className="w-full h-full rounded-[12px] overflow-hidden"
        >
            {children}
        </div>
    )
}

function Body() {
    return (
        <div
            style={{
                backgroundColor: 'hsla(207,21%,10%,.15)',
            }}
            className="w-full h-[calc(100%-60px)]"
        ></div>
    )
}

function Navigation() {
    const Item = ({
        children,
        selected,
    }: {
        children: React.ReactNode
        selected?: boolean
    }) => {
        return (
            <div
                style={{
                    background: selected ? 'hsla(207,18%,8%,0.45)' : '',
                }}
                className="flex items-center justify-center relative w-[85px] h-[25px]"
            >
                {children}

                {selected && (
                    <div className="w-full h-[2px] bg-accent-1 absolute bottom-0 left-0"></div>
                )}
            </div>
        )
    }
    return (
        <div
            style={{
                background: 'hsla(210,17%,7%,.25)',
                borderTop: '1px solid hsla(210,17%,7%,.15)',
            }}
            className="flex justify-center w-full h-[25px]"
        >
            <Item>
                <EditLogo />
            </Item>
            <Item selected>
                <SyncLogo />
            </Item>
            <Item>
                <PerfectSyncLogo />
            </Item>
        </div>
    )
}

export default function Animation() {
    return (
        <GradientBg>
            <Frame>
                <Window>
                    <Header />
                    <Body />
                    <Navigation />
                </Window>
            </Frame>
        </GradientBg>
    )
}
