import { forwardRef, ReactNode } from 'react'

export const Layout = forwardRef<
    HTMLDivElement,
    { children: ReactNode; variant: 'main' }
>(({ children }, ref) => {
    return (
        <div
            ref={ref}
            className="flex absolute cursor-pointer items-center justify-center bg-unaccent-accent-1 w-[100px] h-[30px] rounded-[6px]"
        >
            {children}
        </div>
    )
})
Layout.displayName = 'layout'

export const Line = ({ number }: { number: number }) => {
    return <span className="text-txt-2 text-[16px]">{number}</span>
}
