///
/// This is an internal component, and should not be access by any outside component,
/// for external purposes use ./component.tsx
///
/// The I in IComponent stands for Internal, for Internal Component
///

import TicksView from './TicksView'
import PlayHead from './PlayHead'
import LinesView from './LinesView'

export default function IComponent() {
    return (
        <>
            <div className="w-full flex grow" data-testid="focusview-root-component">
                <div className="min-w-16 max-w-16 bg-text-500">LW</div>
                <div
                    id="focusview-root"
                    className="flex z-10 overflow-y-hidden overflow-x-hidden flex-col grow bg-background-800 bg-gradient-to-b from-background-950 to-45% to-background-900"
                >
                    <div className="flex flex-col grow relative w-full">
                        <PlayHead />
                        <TicksView />
                        <LinesView />
                    </div>
                </div>
            </div>
        </>
    )
}
