export const PxToMs = (x: number, duration: number, width: number) => duration * (x / width)
export const MsToPx = (x: number, duration: number, width: number) => width * (x / duration)
