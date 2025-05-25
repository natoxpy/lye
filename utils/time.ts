function zeropad(num: number) {
    if (num >= 10) return num.toString()
    else if (num < 10 && num >= 0) return '0' + num
    else if (num < 0 && num > -10) return '-0' + Math.abs(num)
    else return num.toString()
}

export function formatMS(ms?: number): string {
    if (ms === undefined) return '--:--.--'

    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10) // Only 2 digits for milliseconds

    const formattedMinutes = zeropad(minutes)
    const formattedSeconds = zeropad(seconds)
    const formattedMilliseconds = zeropad(milliseconds)

    return `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`
}

export function formatS(ms?: number): string {
    if (ms === undefined) return '--:--'

    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)

    const formattedMinutes = zeropad(minutes)
    const formattedSeconds = zeropad(seconds)

    return `${formattedMinutes}:${formattedSeconds}`
}
