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
    return (
        <Layout>
            <LineByLineLayout>
                <LineComponent
                    lineNumber={1}
                    text="How much I wished for another"
                />
                <LineComponent
                    lineNumber={2}
                    text="Better, happier, brighter future"
                />
                <LineComponent
                    lineNumber={3}
                    text="Here I am at the gate I stand"
                />
            </LineByLineLayout>
        </Layout>
    )
}
