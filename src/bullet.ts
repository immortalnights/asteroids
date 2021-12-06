import Scene from "./scene"
import Vector2D from "./vector2d"
import M from './math'

export default class Bullet
{
  scene: Scene
  active: boolean
  pooled: boolean
  position: Vector2D
  size: number
  velocity: Vector2D

  constructor(scene: Scene, x: number, y: number, velocity: Vector2D, size: number = 2)
  {
    this.scene = scene
    this.active = true
    this.pooled = true
    this.position = new Vector2D(x, y)
    this.size = size
    this.velocity = velocity
  }

  update(delta: number): void
  {
    if (this.active)
    {
      const velocity = this.velocity.clone().multiply(delta, delta)
      this.position.add(velocity)

      // TODO destroy if offscreen
      // this.position.x = M.wrap(this.position.x, -(this.size * 2), this.scene.canvas.width + (this.size * 2))
      // this.position.y = M.wrap(this.position.y, -(this.size * 2), this.scene.canvas.height + (this.size * 2))
      const size2 = this.size * 2
      const offscreen = this.position.x < -size2 || this.position.x > this.scene.width + size2 || this.position.y < -size2 || this.position.y > this.scene.height + size2
      if (offscreen)
      {
        this.scene.destroyGameObject(this)
      }
    }
  }

  render(context: CanvasRenderingContext2D): void
  {
    if (this.active)
    {
      context.save()

      context.fillStyle = '#ffffff'

      context.beginPath()
      context.arc(this.position.x, this.position.y, this.size, 0, 360, false)
      context.fill()
      context.closePath()
      context.restore()
    }
  }
}
