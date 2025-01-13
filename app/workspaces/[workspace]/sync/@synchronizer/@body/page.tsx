function Component() {
    return (
        <div
            style={{
                width: '400px',
                left: '100px',
            }}
            className="flex text-sm items-center justify-center absolute rounded-lg h-[calc(100%-2rem)] bg-unaccent-accent-1 hover:border-2 border-accent-1 cursor-pointer text-txt-2"
        >
            Frozen stairs, carpet in blood
        </div>
    )
}

export default function Page() {
    return (
        <>
            <Component />
        </>
    )
}
