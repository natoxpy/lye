import DividerLocationEditor from './DividerLocationEditor'
import DividerSpacingEditor from './DividerSpacingEditor'
import { useInternalSelector } from './internalState'

export default function Component() {
    const pageOption = useInternalSelector((state) => state.page.state)
    const focusWidth = useInternalSelector((state) => state.page.width * state.page.zoom)

    return (
        <div
            id="timedlyrics-editor-root"
            className="flex flex-col h-full overflow-hidden relative"
            style={{ width: focusWidth + 'px' }}
        >
            {pageOption == 'dividerEditor' && <DividerLocationEditor />}
            {pageOption == 'dividerSpacing' && <DividerSpacingEditor />}
        </div>
    )
}
