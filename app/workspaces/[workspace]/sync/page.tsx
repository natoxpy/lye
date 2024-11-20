'use client'
import { useAppSelector } from '@/store/hooks'
import LineComponent from './components/line'
import LineCastShadow from './components/line/castShadow'
import LineHandler from './components/line/handler'

import { HEADER_INITIAL } from '@/store/stores/lyrics'

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-full max-h-full overflow-y-auto">
            {children}
        </div>
    )
}

function LineByLineLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center gap-[10px] py-[32px]">
            {children}
        </div>
    )
}

export default function Page() {
    const lyrics = useAppSelector((state) => {
        const instance = state.lyrics.instances[0]
        const variant = instance.variants.find(
            (item) => item.id === instance.primaryId
        )

        return variant?.lines ?? []
    }).filter((line) => !line.content.startsWith(HEADER_INITIAL))

    const lines = Array.from([] as any).sort(
        (a, b) => a.lineNumber - b.lineNumber
    )

    return (
        <Layout>
            <LineHandler />
            <LineCastShadow />

            <LineByLineLayout>
                {lyrics.map((line, key) => {
                    let timeframe: [number, number] | undefined = undefined

                    const ln = lines.find((ln) => ln.lineNumber === line.line)
                    if (ln) timeframe = [ln.startMs, ln.startMs + ln.durationMs]

                    return (
                        <LineComponent
                            key={key}
                            lineId={line.id}
                            lineNumber={line.line}
                            text={line.content}
                            inTimeLine={!!ln}
                            timeframe={timeframe}
                        />
                    )
                })}
            </LineByLineLayout>
        </Layout>
    )
}
