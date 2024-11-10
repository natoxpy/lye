'use client'
import EditorWindow from './editorWindow'
import PageLocalStates from './states'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col w-full h-[calc(100%-88px)]">
            <PageLocalStates>
                {children}
                <EditorWindow />
            </PageLocalStates>
        </div>
    )
}
