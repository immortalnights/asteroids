import Vector2D from "./vector2d"

export const applyFriction = (velocity: Vector2D, friction: Vector2D) => {
  let negative
  let value
  if (velocity.x !== 0 && friction.x !== 0)
  {
    negative = velocity.x < 0

    value = Math.abs(velocity.x) * (1 - friction.x)
    if (value < 0)
    {
      value = 0
    }

    velocity.x = negative ? -value : value
  }

  if (velocity.y !== 0 && friction.y !== 0)
  {
    negative = velocity.y < 0

    value = Math.abs(velocity.y) * (1 - friction.y)
    if (value < 0)
    {
      value = 0
    }

    velocity.y = negative ? -value : value
  }
}

export default class Particle
{
  life: number
  position: Vector2D
  velocity: Vector2D
  friction: Vector2D
  size: number
  color: number[]
  active: boolean

  constructor(x: number, y: number, size: number, color: number[])
  {
    this.life = 100
    this.position = new Vector2D(x, y)
    this.velocity = new Vector2D()
    this.friction = new Vector2D()
    this.size = size
    this.color = color
    this.active = true
  }

  clone()
  {
    const p = new Particle(this.position.x, this.position.y, this.size, this.color)
    p.life = this.life
    p.position = this.position.clone()
    p.velocity = this.velocity.clone()
    p.friction = this.friction.clone()
    p.size = this.size
    p.color = this.color
    p.active = this.active
    return p
  }

  reset(x?: number, y?: number)
  {
    this.active = true
    this.life = 100

    if (x && y)
    {
      this.position.x = x
      this.position.y = y
    }
  }

  setPosition(x: number, y: number)
  {
    this.position.x = x
    this.position.y = y
  }

  setVelocity(x: number, y: number)
  {
    this.velocity.x = x
    this.velocity.y = y
  }

  setFriction(x: number, y: number)
  {
    this.friction.x = x
    this.friction.y = y
  }

  update(delta: number, canvas: HTMLCanvasElement)
  {
    this.life -= 1
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.life < 0)
    {
      this.active = false
    }
    if ((this.position.x > canvas.width || this.position.x < 0) || (this.position.y > canvas.height || this.position.y < 0))
    {
      this.active = false
    }

    applyFriction(this.velocity, this.friction)
  }

  render(ctx: CanvasRenderingContext2D)
  {
    const alpha = this.life / 100
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2, false)
    ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${alpha})`
    ctx.fill()
  }
}