import React from 'react'

export const Layout = React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode }
>((props, ref) => {
    return (
        <div className="w-full" ref={ref}>
            {props.children}
        </div>
    )
})

Layout.displayName = 'Layout'
