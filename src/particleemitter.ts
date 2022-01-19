import Vector2D from "./vector2d"
import Particle from "./particle"
import rnd from "./rnd"
import { Color } from "./types"


// TODO - an explosion is just a thruster which has a limited "burn" and larger angle (or visa-versa)

export class Explosion
{
  active: boolean
  position: Vector2D
  particles: Particle[]

  constructor(x: number, y: number, intensity: number = 4)
  {
    this.active = true
    this.position = new Vector2D(x, y)
    this.particles = []

    const particleCount = intensity * 10
    const angleStep = 360 / particleCount
    for (let i = 0; i < particleCount; i++)
    {
      const rad = (angleStep * i) * (Math.PI / 180)
      const distance = 0
      const x = this.position.x + Math.cos(rad) * distance
      const y = this.position.y + Math.sin(rad) * distance
      const size = 2
      const color = [140, 85, 35]
      const speed = rnd.floatBetween(2, 6)

      const p = new Particle(x, y, size, color)
      p.setVelocity(Math.cos(rad) * speed, Math.sin(rad) * speed)
      p.setFriction(0.05, 0.05)
      this.particles.push(p)
    }
  }

  update(delta: number, canvas: HTMLCanvasElement)
  {
    if (this.active)
    {
      this.particles.forEach(p => {
        p.update(delta, canvas)
        this.active = Boolean(this.active && p.active)
      })

      if (!this.active)
      {
        console.log("dead")
      }
    }
  }

  render(ctx: CanvasRenderingContext2D)
  {
    if (this.active)
    {
      this.particles.forEach(p => p.render(ctx))
    }
  }
}

export class Thruster
{
  active: boolean
  burn: boolean
  intensity: number
  angle: number
  spread: number
  position: Vector2D
  color: Color
  pool: Particle[]
  particles: Particle[]

  constructor(x: number, y: number, intensity: number = 4, angle: number = 0, spread: number = 0.1, color: Color = [140, 85, 35, 1])
  {
    this.active = true
    this.burn = true
    this.intensity = intensity
    this.angle = angle === 0 ? 360 : angle
    this.spread = spread
    this.position = new Vector2D(x, y)
    this.pool = []
    this.particles = []
    this.color = color
    const size = 2
    const particleCount = 50
    for (let i = 0; i < particleCount; i++)
    {
      this.pool.push(new Particle(this.position.x, this.position.y, size, color))
    }
  }

  addParticle()
  {
    const dither = 360 * (rnd.floatBetween((1 - this.spread), (1 + this.spread)))
    const rad = (this.angle + dither) * (Math.PI / 180)
    const speed = rnd.floatBetween(this.intensity / 2, this.intensity)

    let p
    if (this.pool.length === 0)
    {
      p = new Particle(this.position.x, this.position.y, 2, [140, 85, 35])
    }
    else
    {
      p = this.pool.pop() as Particle
      p.reset(this.position.x, this.position.y)
    }

    // p.angle = rad
    // p.speed = speed
    p.life = rnd.between(40, 100)
    p.setVelocity(Math.cos(rad) * speed, Math.sin(rad) * speed)
    p.setFriction(0.05, 0.05)
    this.particles.push(p)
  }

  stop()
  {
    this.burn = false
  }

  kill()
  {
    this.active = false
    this.particles.forEach(p => {
      p.active = false
      this.pool.push(p)
    })
    this.particles.length = 0
  }

  update(delta: number, canvas: HTMLCanvasElement)
  {
    if (this.active)
    {
      if (this.burn)
      {
        this.addParticle()
      }

      const dead: number[] = []
      this.particles.forEach((p, index) => {
        p.update(delta, canvas)

        if (false === p.active)
        {
          dead.push(index)
        }
      })

      dead.forEach(index => {
        const removed = this.particles.splice(index, 1)
        removed.forEach(p => this.pool.push(p))
      })
    }
  }

  render(ctx: CanvasRenderingContext2D)
  {
    if (this.active)
    {
      this.particles.forEach(p => p.render(ctx))
    }
  }
}
