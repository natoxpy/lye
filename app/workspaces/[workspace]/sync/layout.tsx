import React from 'react'

export default function Layout({
    children,
    synchronizer,
}: {
    children: React.ReactNode
    synchronizer: React.ReactNode
}) {
    return (
        <div
            style={{
                height: 'calc(100% - (40px + 48px))',
            }}
            className="grow flex flex-col bg-bg-2"
        >
            <div className="grow flex flex-col items-center overflow-y-auto py-4 gap-4">
                {children}
            </div>
            <div className="h-fit">{synchronizer}</div>
        </div>
    )
}
