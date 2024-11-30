export type Pixels = number & { readonly brand: unique symbol }
export type Milliseconds = number & { readonly brand: unique symbol }
export type Seconds = number & { readonly brand: unique symbol }
export type Hash = number & { readonly brand: unique symbol }
export type UNAME = string & { readonly brand: unique symbol }

export type TimeUnit = Milliseconds | Seconds
