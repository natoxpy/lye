'use client'
import Dropdown from '@/app/components/header-dropdown'
import Header from '@/app/components/workspaces-header'
import { useState } from 'react'

export default function Page() {
    const [tabIndex, setTabIndex] = useState(0)
    const [active, setActive] = useState(false)

    return (
        <Header
            dropdown={
                <Dropdown
                    tab={[tabIndex, setTabIndex]}
                    active={[active, setActive]}
                />
            }
            onClick={() => setActive((act) => !act)}
        />
    )
}
