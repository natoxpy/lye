import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col items-center w-screen h-screen bg-bg-2 text-txt-2 overflow-y-auto overflow-x-hidden">
            {children}
        </div>
    )
}
