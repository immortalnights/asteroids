import Input from './input'
import M from './math'
import Ship from './ship'
import Bullet from './bullet'
import Particle from './particle'
import Rock from './rock'
import StarBackground from './starbackground'
import RND from './rnd'
import Vector2D from './vector2d'
import { GameObject, Box } from './gameobject'
import { Explosion, Thruster } from './particleemitter'

const MAX_ROCK_COUNT: number = 10

class ObjectPool<T>
{
  items: Array<T>

  constructor()
  {
    this.items = []
  }
}

type CollisionCallbackFn = (a: GameObject, b: GameObject) => boolean


class Collider
{
  readonly a: GameObject[]
  readonly b: GameObject[]
  readonly callback: CollisionCallbackFn

  constructor(a: GameObject[], b: GameObject[], callback: CollisionCallbackFn)
  {
    this.a = a
    this.b = b
    this.callback = callback
  }

  check(): GameObject[]
  {
    const overlaps = (a: GameObject, b: GameObject) => {
      const aBox: Box  = a.getBoundingBox()
      const bBox: Box = b.getBoundingBox()

      const overlap = !(
        aBox.right <= bBox.left ||
        aBox.bottom <= bBox.top ||
        aBox.x >= bBox.right ||
        aBox.y >= bBox.bottom
      )

      return overlap
    }

    this.a.forEach(a => {
      if (a.active)
      {
        this.b.forEach(b => {
          if (b.active)
          {
            if (overlaps(a, b))
            {
              this.callback(a, b)
            }
          }
        })
      }
    })

    return []
  }
}

export default class Scene
{
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D | null
  input: Input
  displayList: Array<any>

  ship: Ship | null
  rocks: Array<Rock>
  bullets: Array<Bullet>
  explosions: Array<Explosion>
  colliders: Collider[]

  constructor(canvas: HTMLCanvasElement)
  {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.input = new Input(this.canvas)
    this.displayList = []

    this.ship = null
    this.rocks = []
    this.bullets = []
    this.explosions = []
    this.colliders = []
  }

  // add all input listeners
  activate()
  {
    this.input.bind()
  }

  // remove all input listeners
  deactivate()
  {
    this.input.unbind()
  }

  get width(): number
  {
    return this.canvas.width
  }

  get height(): number
  {
    return this.canvas.height
  }

  addGameObject(obj: object, before: object | undefined = undefined, after: object | undefined = undefined): void
  {
    if (before)
    {
      const index = this.displayList.indexOf(before)
      this.displayList.splice(index - 1, 0, obj)
    }
    else if (after)
    {
      const index = this.displayList.indexOf(after)
      this.displayList.splice(index, 0, obj)
    }
    else
    {
      this.displayList.push(obj)
    }
  }

  addCollider(a: GameObject | GameObject[], b: GameObject | GameObject[], callback: CollisionCallbackFn)
  {
    a = Array.isArray(a) ? a : [ a ]
    b = Array.isArray(b) ? b : [ b ]
    const collider = new Collider(a, b, callback)
    this.colliders.push(collider)
    return collider
  }

  destroyGameObject(obj: any): void
  {
    const index = this.displayList.indexOf(obj)

    if (obj.pooled)
    {
      obj.active = false
    }

    if (index >= 0)
    {
      this.displayList.splice(index, 1)
    }
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
      this.rocks.push(rock)
    }

    this.addGameObject(this.ship)

    this.addCollider(this.ship, this.rocks, this.onShipCrash.bind(this))
    this.addCollider(this.bullets, this.rocks, this.onBulletHitRock.bind(this))
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
      else if (true === this.input.shoot)
      {
        if (ship.fire())
        {
          const velocity = new Vector2D(600, 0)
          // velocity.setToPolar(800, ship.radians)
          velocity.rotate(ship.radians)
          const bullet = new Bullet(this, ship.position.x, ship.position.y, velocity)
          this.bullets.push(bullet)
          this.addGameObject(bullet, ship)
        }
        this.input.shoot = false
      }
      this.input.changed = false
    }

    if (this.input.turnToMouse && this.input.pointer.in)
    {
      const angle = M.Angle.between(ship.position, this.input.pointer)
      ship.turnTo(angle)
    }

    const expired: number[] = []
    this.explosions.forEach((e, index) => {
      e.update(delta, this.canvas)
      if (false === e.active)
      {
        expired.push(index)
      }
    })
    expired.forEach(i => this.explosions.splice(i, 1))

    this.colliders.forEach(collider => {
      collider.check()
    })
  }

  render(delta: number): void
  {
    const context = this.context as CanvasRenderingContext2D
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.explosions.forEach(e => e.render(context))

    this.displayList.forEach(item => {
      item.update(delta)
      item.render(this.context)
    })

    const ship = this.ship as Ship

    context.fillStyle = '#ffffff'
    context.font = 'normal 12px monospace'
    const lines: string[] = [
      `Mouse    ${this.input.pointer.x.toFixed(2)}, ${this.input.pointer.y.toFixed(2)}`,
      `Speed    ${ship.speed.toFixed(2)}, ${ship.velocity.x.toFixed(2)}, ${ship.velocity.y.toFixed(2)}`,
      `Rotation ${ship.radians.toFixed(2)}, ${M.Angle.toRadians(ship.rotateTo || 0).toFixed(2)}, ${ship.rotationSpeed.toFixed(2)}`,
      `Weapon   ${ship.weaponCooldown.toFixed(2)}`,
      `Controls ${this.input.accelerate}, ${this.input.turn}, ${this.input.shoot}`,
      `Renderer ${this.displayList.length}`,
    ]

    lines.forEach((s, index) => {
      context.fillText(s, 12, 14 + index * 12)
    })


    // debug
    // this.displayList.forEach(item => {
    //   if (item.getBoundingBox)
    //   {
    //     const box = item.getBoundingBox()
    //     context.strokeStyle = 'purple'
    //     context.strokeRect(box.left, box.top, box.right - box.left, box.bottom - box.top)
    //   }
    // })
  }

  onShipCrash(ship: GameObject, rock: GameObject): boolean
  {
    ship = ship as Ship

    // console.log("Ship damaged!")

    return true
  }

  onBulletHitRock(bullet: GameObject, rock: GameObject): boolean
  {
    this.destroyGameObject(bullet)
    const bulletIndex = this.bullets.indexOf(bullet as Bullet)
    this.bullets.splice(bulletIndex, 1)

    const aRock: Rock = rock as Rock
    this.destroyGameObject(rock)
    const rockIndex = this.rocks.indexOf(aRock)
    this.rocks.splice(rockIndex, 1)

    if (aRock.size > 8)
    {
      // spawn two rocks, half the size
      const size = Math.max(aRock.size / 2, 8)
      const rocks: Rock[] = [
        new Rock(this, rock.position.x, rock.position.y, size),
        new Rock(this, rock.position.x, rock.position.y, size)
      ]

      rocks.forEach(rock => {
        this.addGameObject(rock)
        this.rocks.push(rock)
      });
    }

    const explosion = new Explosion(rock.position.x, rock.position.y, aRock.size / 2)
    this.explosions.push(explosion)

    return true
  }
}
