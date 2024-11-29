export type Pixels = number & { readonly brand: unique symbol }
export type Milliseconds = number & { readonly brand: unique symbol }
export type Seconds = number & { readonly brand: unique symbol }

export type TimeUnit = Milliseconds | Seconds

// export function toPixels(px: number): Pixels {
//     return px as Pixels
// }
//
// export function toMilliseconds(ms: number): Milliseconds {
//     return ms as Milliseconds
// }
//
// export function toSeconds(ms: number): Seconds {
//     return ms as Seconds
// }
