'use client'
import { useAppSelector } from '@/store/hooks'
import LineComponent from './components/line'

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
    })

    const lines = Array.from(
        useAppSelector((state) => state.syncLines.lines)
    ).sort((a, b) => a.lineNumber - b.lineNumber)

    return (
        <Layout>
            <LineByLineLayout>
                {lyrics.map((line, key) => (
                    <LineComponent
                        key={key}
                        lineNumber={line.line}
                        text={line.content}
                        notIntimeLine={false}
                    />
                ))}
            </LineByLineLayout>
        </Layout>
    )
}
