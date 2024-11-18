import { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode; variant: 'main' }) {
    return (
        <div
            style={{ left: '10px' }}
            className="flex cursor-pointer items-center justify-center bg-unaccent-accent-1 w-[100px] h-[30px] rounded-[6px]"
        >
            {children}
        </div>
    )
}

export const Line = ({ number }: { number: number }) => {
    return <span className="text-txt-2 text-[16px]">{number}</span>
}
