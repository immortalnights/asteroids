import { VectorLike } from './types'

export const clamp: Function = (value: number, min: number, max: number): number => {
  if (value < min)
  {
    value = min
  }

  if (value > max)
  {
    value = max
  }

  return value
}

export const wrap: Function = (value: number, min: number, max: number): number => {
  if (value < min)
  {
    value = max + (value % max)
  }

  if (value > max)
  {
    value = min + (value % max)
  }

  return value
}

export const Angle = {
  /**
   * 
   * @param a 
   * @param b 
   * @returns angle in degrees
   */
  between(a: VectorLike, b: VectorLike): number
  {
    return Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI)
  }
}

export default {
  clamp,
  wrap,
  Angle
}