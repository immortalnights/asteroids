import Scene from './scene'
import { Box, GameObject } from './gameobject'
import Vector2D from './vector2d'
import M from './math'
import { Thruster } from './particleemitter'

const SHIP_MAXIMUM_SPEED = 500

export default class Ship implements GameObject
{
  scene: Scene
  active: boolean
  position: Vector2D
  velocity: Vector2D
  /** Angle in degrees */
  _angle: number
  speed: number
  size: number
  thruster: Thruster

  rotateTo: number | null
  rotationSpeed: number

  weaponCooldown: number

  constructor(scene: Scene, x: number, y: number, size: number = 20)
  {
    this.scene = scene
    this.active = true
    this.position = new Vector2D(x, y)
    this.velocity = new Vector2D(0, 0)
    this.size = size
    this._angle = 0
    this.speed = 25
    this.thruster = new Thruster(this.position.x, this.position.y, 3, 180, 0.05, [200, 200, 200, 1])
    this.thruster.burn = false

    this.rotateTo = null
    this.rotationSpeed = 0

    this.weaponCooldown = 0
  }

  get angle(): number
  {
    return this._angle
  }

  get radians(): number
  {
    return M.Angle.toRadians(this.angle)
  }

  // control interface
  /**
   *
   * @param direction positive right, negative left
   */
  turn(direction: number)
  {
    switch (direction)
    {
      case -1:
      {
        this.rotationSpeed = -5
        break
      }
      case 0:
      {
        this.rotationSpeed = 0
        break
      }
      case 1:
      {
        this.rotationSpeed = 5
        break
      }
    }
  }

  /**
   *
   * @param angle target angle in degrees
   */
  turnTo(angle: number | null)
  {
    this.rotateTo = angle
  }

  accelerate()
  {
    const xAcc = Math.cos(this.radians) * this.speed
    if ((xAcc > 0 && this.velocity.x < 300) || (xAcc < 0 && this.velocity.x > -300))
    {
      this.velocity.x += xAcc
    }

    const yAcc = Math.sin(this.radians) * this.speed
    if ((yAcc > 0 && this.velocity.y < 300) || (yAcc < 0 && this.velocity.y > -300))
    {
      this.velocity.y += yAcc
    }
  }

  brake()
  {
    if (this.velocity.x > 0.1)
    {
      this.velocity.x -= Math.cos(this.radians) * this.speed;
    }
    else if (this.velocity.x < -0.1)
    {
      this.velocity.x += Math.cos(this.radians) * this.speed;
    }

    if (this.velocity.y > 0.1)
    {
      this.velocity.y -= Math.sin(this.radians) * this.speed;
    }
    else if (this.velocity.y < -0.1)
    {
      this.velocity.y += Math.sin(this.radians) * this.speed;
    }
  }

  fire()
  {
    const ok = this.weaponCooldown === 0
    if (ok)
    {
      this.weaponCooldown = .125
    }
    return ok
  }

  set angle(angle: number)
  {
    this._angle = angle // M.wrap(angle, 0, 360)
  }

  getBoundingBox(): Box
  {
    const x = this.position.x
    const y = this.position.y
    return {
      x,
      y,
      top: y - this.size / 2,
      right: x + this.size,
      bottom: y + this.size / 2,
      left: x - this.size / 2,
    }
  }

  update(delta: number): void
  {
    // update angle by turn speed
    if (this.rotationSpeed != 0)
    {
      this.angle += this.rotationSpeed
    }
    else if (this.rotateTo != null)
    {
      this.angle = M.Angle.toDegrees(M.Angle.rotateTo(this.radians, M.Angle.toRadians(this.rotateTo)))
    }

    this.weaponCooldown = M.dec(this.weaponCooldown, delta, 0)

    // update velocity by speed
    const velocity = this.velocity.clone().multiply(delta, delta)
    this.position.add(velocity)

    this.position.x = M.wrap(this.position.x, -(this.size * 2), this.scene.canvas.width + (this.size * 2))
    this.position.y = M.wrap(this.position.y, -(this.size * 2), this.scene.canvas.height + (this.size * 2))

    this.thruster.burn = (velocity.x !== 0 && velocity.y !== 0)
    this.thruster.angle = 180 + this.angle
    this.thruster.position.x = this.position.x
    this.thruster.position.y = this.position.y
    this.thruster.update(delta, this.scene.canvas)
  }

  render(context: CanvasRenderingContext2D): void
  {
    const points: Array<Vector2D> = [
      new Vector2D(this.size, 0),
      new Vector2D(-(this.size / 2), this.size / 2),
      new Vector2D(-(this.size / 2), -(this.size / 2)),
    ]

    this.thruster.render(context)

    context.save()
    context.strokeStyle = '#aaaaaa'
    context.fillStyle = '#999999'

    // context.translate(this.position.x + (this.size / 2), this.position.y + (this.size / 2))
    context.translate(this.position.x, this.position.y)
    context.rotate(this.radians)

    context.beginPath()
    context.moveTo(points[0].x, points[0].y)
    context.lineTo(points[1].x, points[1].y)
    context.lineTo(points[2].x, points[2].y)
    context.closePath()
    context.stroke()
    context.fill()

    // center point
    // context.fillStyle = '#ffffff'
    // context.fillRect(-1, -1, 2, 2)

    context.setTransform(1, 0, 0, 1, 0, 0)
    context.restore()
  }
}