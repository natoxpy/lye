import { GradientBg, Frame, Window, Header, Navigation } from './window'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <GradientBg>
            <Frame>
                <Window>
                    <Header />
                    {children}
                    <Navigation />
                </Window>
            </Frame>
        </GradientBg>
    )
}
