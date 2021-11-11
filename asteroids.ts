
const clamp = function(value: number, min: number, max: number): number {
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

const wrap = function(value: number, min: number, max: number): number {
  if (value < min)
  {
    value = max
  }

  if (value > max)
  {
    value = min
  }

  return value
}

class Vector2D
{
  x: number
  y: number

  constructor(x: number, y: number)
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

class Ship
{
  game: Asteroids
  position: Vector2D
  velocity: Vector2D
  /** Angle in degrees */
  _angle: number
  _speed: number
  size: number

  constructor(game: Asteroids, x: number, y: number, size: number)
  {
    this.game = game
    this.position = new Vector2D(x, y)
    this.velocity = new Vector2D(0, 0)
    this.size = size
    this._angle = 0
    this._speed = 0
  }

  get speed(): number
  {
    return this._speed
  }

  set speed(speed: number)
  {
    this._speed = clamp(speed, 0, 1000)

    this.velocity.setToPolar(this.radians, this.speed)
  }

  get angle(): number
  {
    return this._angle
  }

  set angle(angle: number)
  {
    this._angle = wrap(angle, 0, 360)
  }

  get radians(): number
  {
    return this.angle * Math.PI / 180
  }

  update(delta: number): void
  {
    const movement: Vector2D = this.velocity.clone().multiply(delta, delta)
    this.position.add(movement)

    this.position.x = wrap(this.position.x, -(this.size * 2), this.game.canvas.width + (this.size * 2))
    this.position.y = wrap(this.position.y, -(this.size * 2), this.game.canvas.height + (this.size * 2))
  }

  render(context: CanvasRenderingContext2D): void
  {
    const points: Array<Vector2D> = [
      new Vector2D(this.size, 0),
      new Vector2D(-(this.size / 2), this.size / 2),
      new Vector2D(-(this.size / 2), -(this.size / 2)),
    ]

    context.strokeStyle = '#aaaaaa'

    context.translate(this.position.x - this.size / 2, this.position.y - this.size / 2)
    context.rotate(this.radians)

    context.beginPath()
    context.moveTo(points[0].x, points[0].y)
    context.lineTo(points[1].x, points[1].y)
    context.lineTo(points[2].x, points[2].y)
    context.closePath()
    context.stroke()

    context.setTransform(1, 0, 0, 1, 0, 0)
  }
}

export default class Asteroids
{
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D | null
  animationFrameId: number

  ship: Ship
  lastFrameTime: number

  constructor(canvas: HTMLCanvasElement)
  {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.animationFrameId = 0
    this.ship = new Ship(this, 100, 100, 10)
    this.lastFrameTime = 0
  }

  play(): void
  {
    this.animationFrameId = window.requestAnimationFrame(this.render.bind(this))
  }

  stop(): void
  {
    window.cancelAnimationFrame(this.animationFrameId)
  }

  render(time: number): void
  {
    const context = this.context as CanvasRenderingContext2D
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const delta = time - this.lastFrameTime
    this.ship.update(delta / 1000)
    this.ship.render(context)
    this.lastFrameTime = time

    this.play()

    this.ship.angle = 40
    this.ship.speed = 500
  }
}