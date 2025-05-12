const outpad = '\u2061'
const inpad = '\u2063'
const b0 = '\u2064'
const b1 = '\u2062'

export function extractFromString(s: string): Array<string> {
    const regex = new RegExp(
        `${outpad}${inpad}[${b0}${b1}]*${inpad}${outpad}`,
        'g'
    )
    const dataArray = s.match(regex)
    if (!dataArray) return []

    return dataArray.map((v) => decode(v, { inpad, outpad, b1 }) ?? '')
}

///
/// Ensures all encoded values are removed no matter if they are properly formatted or not
export function greedyRemoveEncodedSections(s: string): string {
    return s.replace(new RegExp(`[${outpad}${inpad}${b0}${b1}]`, 'g'), '')
}

export function removeEncodings(s: string): string {
    const decodings = extractFromString(s)

    let sr = s

    for (const decoded of decodings) {
        sr = sr.replace(encode(decoded), '')
    }

    return sr
}

export function encode(
    message: string,
    symbols: { inpad: string; outpad: string; b0: string; b1: string } = {
        inpad,
        outpad,
        b0,
        b1,
    }
) {
    const utf8 = new Uint8Array(message.length)
    const encoder = new TextEncoder()

    encoder.encodeInto(message, utf8)
    const data = Array.from(utf8)

    const getBit = (v: number, i: number, op1: string, op2: string) => {
        return v & Math.pow(2, i) ? op2 : op1
    }

    const binaryData = data.map((v) =>
        Array.from({ length: 8 })
            .map((_, i) => getBit(v, i, symbols.b0, symbols.b1))
            .join('')
    )

    return (
        symbols.outpad +
        symbols.inpad +
        binaryData.join('') +
        symbols.inpad +
        symbols.outpad
    )
}

export function decode(
    encodedMessage: string,
    symbols: { inpad: string; outpad: string; b1: string } = {
        inpad,
        outpad,
        b1,
    }
): string | undefined {
    if (
        !encodedMessage.startsWith(symbols.outpad + symbols.inpad) ||
        encodedMessage.endsWith(symbols.outpad + symbols.inpad)
    )
        return

    const decoder = new TextDecoder()

    const chunks = (size: number) => {
        return (arr: Array<string>, current: string) => {
            const i = arr.length - 1
            if (i < 0 || arr[i].length >= size) arr.push(current)
            else arr[i] += current
            return arr
        }
    }

    const data = encodedMessage
        .slice(2)
        .slice(0, -2)
        .split('')
        .reduce(chunks(8), [])

    const toIntBit = (b: string, i: number, op1: string) => {
        return b == op1 ? Math.pow(2, i) : 0
    }

    const originalData = data.map((v) =>
        v.split('').reduce((a, c, i) => a + toIntBit(c, i, symbols.b1), 0)
    )

    return decoder.decode(new Uint8Array(originalData))
}

export function isEncodingArea(c: string): boolean {
    return c == outpad || c == inpad || c == b0 || c == b1
}

export function testProcess(
    content: string,
    from: { start: number; end: number },
    to: { start: number; end: number },
    direction: 'forward' | 'backward' | 'none'
): number | undefined {
    const cursor = to.start
    let wantedDirection = from.start > to.start ? 'left' : 'right'

    if (isEncodingArea(content[cursor])) {
        let i = cursor

        while (isEncodingArea(content[i])) {
            i = wantedDirection == 'left' ? i - 1 : i + 1
            if (i < 0) {
                wantedDirection = wantedDirection == 'left' ? 'right' : 'left'
                i = wantedDirection == 'left' ? i - 1 : i + 1
            }
        }

        console.log(i)

        // return i
    }
}
