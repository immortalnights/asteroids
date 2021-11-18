
export default class Vector2D
{
  x: number
  y: number

  constructor(x: number = 0, y: number = 0)
  {
    this.x = x
    this.y = y
  }

  clone(): Vector2D
  {
    return new Vector2D(this.x, this.y)
  }

  set(x: number, y: number): void
  {
    this.x = x
    this.y = y
  }

  add(x: number | Vector2D, y: number | undefined = undefined): this
  {
    if (y === undefined)
    {
      y = (x as Vector2D).y
      x = (x as Vector2D).x
    }

    this.x += x as number
    this.y += y as number

    return this
  }

  multiply(x: number | Vector2D, y: number | undefined = undefined): this
  {
    if (y === undefined)
    {
      y = (x as Vector2D).y
      x = (x as Vector2D).x
    }

    this.x *= x as number
    this.y *= y as number

    return this
  }

  setToPolar(azimuth: number, radius: number = 1): this
  {
    this.x = Math.cos(azimuth) * radius
    this.y = Math.sin(azimuth) * radius

    return this
  }
}