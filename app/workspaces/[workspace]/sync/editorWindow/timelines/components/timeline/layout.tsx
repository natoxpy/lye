import { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex relative w-full h-[36px] items-center grow">
            {children}
        </div>
    )
}
