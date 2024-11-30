const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export default async function Page() {
    await delay(1_000)
    return <div className="w-full h-full"></div>
}
