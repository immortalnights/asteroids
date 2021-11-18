import Scene from './scene'
import Vector2D from './vector2d'
import M from './math'

export default class Ship
{
  scene: Scene
  position: Vector2D
  velocity: Vector2D
  /** Angle in degrees */
  _angle: number
  _speed: number
  size: number

  constructor(scene: Scene, x: number, y: number, size: number)
  {
    this.scene = scene
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
    this._speed = M.clamp(speed, 0, 1000)
  }

  get angle(): number
  {
    return this._angle
  }

  set angle(angle: number)
  {
    this._angle = angle // wrap(angle, 0, 360)

    // fix me
    this.velocity.setToPolar(this.radians, this.speed)
  }

  get radians(): number
  {
    return this.angle * Math.PI / 180
  }

  setVelocity(speed: number)
  {
    this.speed = speed
    this.velocity.setToPolar(this.radians, this.speed)
  }

  update(delta: number): void
  {
    const movement: Vector2D = this.velocity.clone().multiply(delta, delta)
    this.position.add(movement)

    this.position.x = M.wrap(this.position.x, -(this.size * 2), this.scene.canvas.width + (this.size * 2))
    this.position.y = M.wrap(this.position.y, -(this.size * 2), this.scene.canvas.height + (this.size * 2))
  }

  render(context: CanvasRenderingContext2D): void
  {
    const points: Array<Vector2D> = [
      new Vector2D(this.size, 0),
      new Vector2D(-(this.size / 2), this.size / 2),
      new Vector2D(-(this.size / 2), -(this.size / 2)),
    ]

    context.save()
    context.strokeStyle = '#aaaaaa'
    context.fillStyle = '#999999'

    context.translate(this.position.x - this.size / 2, this.position.y - this.size / 2)
    context.rotate(this.radians)

    context.beginPath()
    context.moveTo(points[0].x, points[0].y)
    context.lineTo(points[1].x, points[1].y)
    context.lineTo(points[2].x, points[2].y)
    context.closePath()
    context.stroke()
    context.fill()

    context.setTransform(1, 0, 0, 1, 0, 0)
    context.restore()
  }
}