'use client'
import Dropdown from '@/app/components/header-dropdown'
import Header from '@/app/components/workspaces-header'
import { useHeader } from '@/states/hooks'

export default function Page() {
    const {
        tab,
        active,
        actions: { setActive, setTab },
    } = useHeader((state) => state)

    return (
        <Header
            dropdown={
                <Dropdown tab={[tab, setTab]} active={[active, setActive]} />
            }
            onClick={() => setActive(!active)}
        />
    )
}
