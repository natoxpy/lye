'use client'
import { useAppSelector } from '@/store/hooks'
import LineComponent from './components/line'

function Layout({ children }: { children: React.ReactNode }) {
    return <div className="w-full h-full overflow-auto">{children}</div>
}

function LineByLineLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center gap-[10px] py-[32px]">
            {children}
        </div>
    )
}

export default function Page() {
    const lines = Array.from(useAppSelector((state) => state.syncLines.lines))
    return (
        <Layout>
            <LineByLineLayout>
                {lines
                    .sort((a, b) => a.lineNumber - b.lineNumber)
                    .map((line, key) => (
                        <LineComponent
                            key={key}
                            lineNumber={line.lineNumber}
                            text="How much I wished for another"
                            timeframe={[
                                line.startMs,
                                line.startMs + line.durationMs,
                            ]}
                        />
                    ))}
            </LineByLineLayout>
        </Layout>
    )
}
