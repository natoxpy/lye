'use client'

import { useSynchronizer } from '@/states/hooks'

function Component({ offsetPixel }: { offsetPixel: number }) {
    return (
        <div
            style={{
                width: '400px',
                left: `${offsetPixel * -1}px`,
            }}
            className="flex text-sm items-center justify-center absolute rounded-lg h-[calc(100%-2rem)] bg-unaccent-accent-1 hover:border-2 border-accent-1 cursor-pointer text-txt-2"
        >
            Frozen stairs, carpet in blood
        </div>
    )
}

export default function Page() {
    const { offsetPx } = useSynchronizer((state) => state)

    return (
        <>
            <Component offsetPixel={offsetPx} />
        </>
    )
}
