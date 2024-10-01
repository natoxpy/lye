import FocusEditorView from './FocusView/component'
import FullView from './FullView/component'
import ToolsView from './ToolsView/component'
import { Dispatch, SetStateAction } from 'react'

export default function Component({
    setZoomSize,
    detailTime,
    zoomSize
}: {
    detailTime: number
    zoomSize: number
    setZoomSize: Dispatch<SetStateAction<number>>
}) {
    return (
        <div className="flex fixed bottom-0 w-screen h-44 overflow-hidden bg-background-900">
            <div className="min-w-16 h-full bg-text-950 select-none z-10">WIP</div>
            <div className="flex flex-col w-[calc(100%-4rem)]">
                <ToolsView setZoomSize={setZoomSize} />
                <FullView />
                <FocusEditorView detailTime={detailTime} zoomSize={zoomSize} />
            </div>
        </div>
    )
}
