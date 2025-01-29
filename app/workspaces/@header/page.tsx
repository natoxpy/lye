'use client'
import Dropdown from '@/app/components/header-dropdown'
import Header from '@/app/components/workspaces-header'

export default function Page() {
    return <Header dropdown={<Dropdown initialTab={2} />} />
}
