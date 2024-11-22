import { Pixels } from '@/app/utils/units'
import { ReactNode } from 'react'

export function Layout({
    children,
    height,
}: {
    height: Pixels | number
    children: ReactNode
}) {
    return (
        <div
            style={{
                height: height + 'px',
            }}
            className="flex relative w-full items-center grow"
        >
            {children}
        </div>
    )
}
