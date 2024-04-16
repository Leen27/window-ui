export const isDefined = <T = any>(val?: T): val is T => typeof val !== 'undefined'
