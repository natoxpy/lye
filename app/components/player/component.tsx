import StateProvider from './state'
import Syncing from './syncing'

export default function Component({ children }: { children: React.ReactNode }) {
    return (
        <StateProvider>
            <Syncing>{children}</Syncing>
        </StateProvider>
    )
}
