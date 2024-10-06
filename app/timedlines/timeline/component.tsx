import FocusEditorView from './FocusView/component'
import FullView from './FullView/component'
import ToolsView from './ToolsView/component'
import { useEditorDispatch } from '../localState'

export default function Component() {
    const editorDispatch = useEditorDispatch()

    const setZoomSize = (value: number) =>
        editorDispatch({ type: 'zoomSize/update', payload: value })

    return (
        <div className="flex fixed bottom-10 w-screen h-44 overflow-hidden bg-background-900">
            <div className="flex flex-col w-full">
                <ToolsView setZoomSize={setZoomSize} />
                <FullView />
                <FocusEditorView />
            </div>
        </div>
    )
}
