import EditorWindow from './editorWindow'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col w-full h-[calc(100%-88px)]">
            {children}
            <EditorWindow />
        </div>
    )
}
