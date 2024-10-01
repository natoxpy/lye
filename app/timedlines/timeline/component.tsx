import FocusEditorView from './FocusView/component'
import FullView from './FullView/component'
import ToolsView from './ToolsView/component'
import { useEditorDispatch } from '../localState'

export default function Component() {
    const editorDispatch = useEditorDispatch()

    const setZoomSize = (value: number) =>
        editorDispatch({ type: 'zoomSize/update', payload: value })

    return (
        <div className="flex fixed bottom-0 w-screen h-44 overflow-hidden bg-background-900">
            <div className="min-w-16 h-full bg-text-950 select-none z-10">WIP</div>
            <div className="flex flex-col w-[calc(100%-4rem)]">
                <ToolsView setZoomSize={setZoomSize} />
                <FullView />
                <FocusEditorView />
            </div>
        </div>
    )
}
