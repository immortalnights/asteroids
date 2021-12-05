import { VectorLike } from './types'

const PI2 = Math.PI * 2

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

  toDegrees(radians: number): number
  {
    return radians * (180 / Math.PI)
  },

  toRadians(degrees: number): number
  {
    return degrees *  (Math.PI / 180)
  },

  /**
   *
   * @param a
   * @param b
   * @returns angle in degrees
   */
  between(a: VectorLike, b: VectorLike): number
  {
    return Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI)
  },

  rotateTo(current: number, target: number, lerp: number = 0.05): number
  {
    if (current !== target)
    {
      if (Math.abs(target - current) <= lerp || Math.abs(target - current) >= (PI2 - lerp))
      {
        current = target
      }
      else
      {
        if (Math.abs(target - current) > Math.PI)
        {
          if (target < current)
          {
            target += PI2
          }
          else
          {
            target -= PI2
          }
        }

        if (target > current)
        {
          current += lerp
        }
        else if (target < current)
        {
          current -= lerp
        }
      }
    }

    return current
  }
}

export default {
  clamp,
  wrap,
  Angle
}