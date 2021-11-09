
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
}

class Ship
{
  position: Vector2D
  /** Angle in degrees */
  _angle: number
  size: number

  constructor(x: number, y: number, size: number)
  {
    this.position = new Vector2D(x, y)
    this.size = size
    this._angle = 0
  }

  get angle()
  {
    return this._angle
  }

  set angle(angle: number)
  {
    this._angle = wrap(angle, 0, 360)
  }

  render(context: CanvasRenderingContext2D)
  {
    const points: Array<Vector2D> = [
      new Vector2D(this.size, 0),
      new Vector2D(-(this.size / 2), this.size / 2),
      new Vector2D(-(this.size / 2), -(this.size / 2)),
    ]

    context.strokeStyle = '#aaaaaa'

    context.translate(this.position.x - this.size / 2, this.position.y - this.size / 2)
    context.rotate(this.angle * Math.PI / 180)

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
  context: CanvasRenderingContext2D
  animationFrameId: number

  ship: Ship

  constructor(canvas: HTMLCanvasElement)
  {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.ship = new Ship(100, 100, 10)
  }

  play(): void
  {
    this.animationFrameId = window.requestAnimationFrame(this.render.bind(this))
  }

  stop(): void
  {
    window.cancelAnimationFrame(this.animationFrameId)
  }

  render(): void
  {
    const context: CanvasRenderingContext2D = this.context
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ship.render(context)

    this.play()

    this.ship.angle += 1
  }
}