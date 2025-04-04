export function formatMS(ms?: number): string {
    if (ms === undefined) return '--:--.--'

    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10) // Only 2 digits for milliseconds

    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = seconds.toString().padStart(2, '0')
    const formattedMilliseconds = milliseconds.toString().padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`
}

export function formatS(ms?: number): string {
    if (ms === undefined) return '--:--'

    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)

    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = seconds.toString().padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
}
