import Input from './input'
import M from './math'
import Ship from './ship'
import Bullet from './bullet'
import Particle from './particle'
import Rock from './rock'
import StarBackground from './starbackground'
import RND from './rnd'

const MAX_ROCK_COUNT: number = 10


export default class Scene
{
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D | null
  input: Input
  displayList: Array<any>

  ship: Ship | null
  rocks: Array<Rock>
  bullets: Array<Bullet>
  particals: Array<Particle>

  constructor(canvas: HTMLCanvasElement)
  {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.input = new Input(this.canvas)
    this.displayList = []

    this.ship = null
    this.rocks = []
    this.bullets = []
    this.particals = []
  }

  get width(): number
  {
    return this.canvas.width
  }

  get height(): number
  {
    return this.canvas.height
  }

  addGameObject(obj: object): void
  {
    this.displayList.push(obj)
  }

  destroyGameObject(obj: any): void
  {
    const index = this.displayList.indexOf(obj)

    if (obj.pooled)
    {
      obj.active = false
    }

    this.displayList.splice(index, 1)
  }

  create()
  {
    this.ship = new Ship(this, this.width / 2, this.height / 2)

    this.addGameObject(new StarBackground(this))

    // Create rocks
    for (let count: number = 0; count < MAX_ROCK_COUNT; count++)
    {
      const rock: Rock = new Rock(this, RND.between(0, this.width), RND.between(0, this.height))
      this.addGameObject(rock)
    }

    this.addGameObject(this.ship)
  }

  destroy()
  {
    this.input.destroy()
  }

  update(delta: number)
  {
    // Turn ship towards the pointer location
    const ship = this.ship as Ship

    if (this.input.changed)
    {
      ship.turn(this.input.turn)
      ship.turnTo(null)

      if (1 === this.input.accelerate)
      {
        ship.accelerate()
      }
      else if (-1 === this.input.accelerate)
      {
        ship.brake()
      }
      // shoot
      this.input.changed = false
    }

    if (this.input.turnToMouse && this.input.pointer.in)
    {
      const angle = M.Angle.between(ship.position, this.input.pointer)
      ship.turnTo(angle)
    }
  }

  render(delta: number): void
  {
    const context = this.context as CanvasRenderingContext2D
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.displayList.forEach(item => {
      item.update(delta)
      item.render(this.context)
    })

    const ship = this.ship as Ship

    context.fillStyle = '#ffffff'
    context.fillText(`${this.input.pointer.x.toFixed(2)}, ${this.input.pointer.y.toFixed(2)}; ${ship.radians.toFixed(2)}, ${M.Angle.toRadians(ship.rotateTo || 0).toFixed(2)} ${ship.rotationSpeed.toFixed(2)}; ${ship.speed.toFixed(2)} ${ship.velocity.x.toFixed(2)}, ${ship.velocity.y.toFixed(2)}`, 10, 10)
    context.fillText(`Controls ${this.input.accelerate}, ${this.input.turn}, ${this.input.shoot}`, 10, 20)
  }
}
