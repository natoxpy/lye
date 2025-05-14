import xxhash from 'xxhashjs'

export const seed = 0x0

export function hash(message: string) {
    return xxhash.h32(message, seed).toString(16)
}

export function hashRandom() {
    return hash(String(Math.random()))
}
