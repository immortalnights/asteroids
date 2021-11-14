
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

const between = (min: number, max: number): number => {
  return Math.floor(floatBetween(min, max))
}

const floatBetween = (min: number, max: number): number => {
  return (Math.random() * max) + min
}

const pick = (choices: Array<any>): any => {
  const index = between(0, choices.length)
  return choices[index]
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

class StarBackground
{
  scene: Scene
  stars: Array<any>

  constructor(scene: Scene)
  {
    this.scene = scene
    this.stars = []
    for (let index = 0; index < 300; index++)
    {
      const size = between(1, 2)
      const alpha = floatBetween(0.1, 1)
      const x = between(0, scene.width)
      const y = between(0, scene.height)
      const color = pick([ '255, 255, 255', '128, 0, 128', '34, 34, 153' ])
      // const color = pick([ 0xffffff, 0x800080, 0x222299 ])

      this.stars.push({
        x,
        y,
        size,
        color,
        alpha
      })
    }
  }

  update(delta: number): void
  {
    // TODO change the starts a little
  }

  render(): void
  {
    const context = this.scene.context as CanvasRenderingContext2D

    context.save()

    this.stars.forEach(star => {
      context.fillStyle = `rgba(${star.color}, ${star.alpha})`
      context.fillRect(star.x, star.y, star.size, star.size)
    })

    context.restore()
  }
}

class Ship
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
    this._speed = clamp(speed, 0, 1000)
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

  setVelocity(speed: number)
  {
    this.speed = speed
    this.velocity.setToPolar(this.radians, this.speed)
  }

  update(delta: number): void
  {
    const movement: Vector2D = this.velocity.clone().multiply(delta, delta)
    this.position.add(movement)

    this.position.x = wrap(this.position.x, -(this.size * 2), this.scene.canvas.width + (this.size * 2))
    this.position.y = wrap(this.position.y, -(this.size * 2), this.scene.canvas.height + (this.size * 2))
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

class Rock
{
  scene: Scene
  size: number
  position: Vector2D
  angle: number
  rotationSpeed: number
  velocity: Vector2D
  points: Array<Vector2D>

  constructor(scene: Scene, x: number, y: number)
  {
    const pointsOnCircle = (count: number, x: number, y: number, radius: number): Array<Vector2D> => {
      const startAngle: number = 0;
      const endAngle: number = 6.28;

      const angleStep: number = (endAngle - startAngle) / count;
      let angle: number = startAngle;

      const points: Array<Vector2D> = []
      for (let i: number = 0; i < count; i++)
      {
        const point = new Vector2D(
          x + (radius * Math.cos(angle)),
          y + (radius * Math.sin(angle))
        )

        points.push(point)
        angle += angleStep;
      }
  
      return points;
    };

    const createPolygonPoints = (x: number, y: number, r: number = 20, totalPoints: number = 8): Array<Vector2D> => {
      const points: Array<Vector2D> = pointsOnCircle(totalPoints, x, y, r)

      points.forEach(point => {
          point.x += between(-(r * 0.25), r * 0.25) + r
          point.y += between(-(r * 0.25), r * 0.25) + r
      })

      return points
    }

    this.scene = scene
    this.position = new Vector2D(x, y)
    this.size = 28
    this.angle = 0
    this.rotationSpeed = floatBetween(0.1, 2)
    this.velocity = new Vector2D(between(-200, 200), between(-200, 200))
    this.points = createPolygonPoints(0, 0, this.size, 8)
    // console.log(this.points)
  }

  get radians(): number
  {
    return this.angle * Math.PI / 180
  }

  update(delta: number)
  {
    const movement: Vector2D = this.velocity.clone().multiply(delta, delta)
    this.position.add(movement)

    this.position.x = wrap(this.position.x, -(this.size * 2), this.scene.width + (this.size * 2))
    this.position.y = wrap(this.position.y, -(this.size * 2), this.scene.height + (this.size * 2))

    this.angle += this.rotationSpeed

    // console.log(`${this.position.x}, ${this.position.y} ${this.angle}`)
  }

  render(context: CanvasRenderingContext2D)
  {
    context.save()
    context.strokeStyle = '#aaaaaa'
    context.fillStyle = '#333333'

    context.translate(this.position.x - this.size / 2, this.position.y - this.size / 2)
    context.rotate(this.radians)

    context.beginPath()
    context.moveTo(this.points[0].x, this.points[0].y)

    for (let index: number = 1; index < this.points.length; index++)
    {
      const point = this.points[index]
      context.lineTo(point.x, point.y)
    }
    context.closePath()
    context.stroke()
    context.fill()

    context.setTransform(1, 0, 0, 1, 0, 0)

    context.restore()
  }
}

class Scene
{
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D | null
  gameObjects: Array<any>
  animationFrameId: number
  lastFrameTime: number

  constructor(canvas: HTMLCanvasElement)
  {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.gameObjects = []
    this.animationFrameId = 0
    this.lastFrameTime = 0
  }

  get width(): number
  {
    return this.canvas.width
  }

  get height(): number
  {
    return this.canvas.height
  }

  add(obj: object): void
  {
    this.gameObjects.push(obj)
  }

  play(): void
  {
    this.frame()
  }

  stop(): void
  {
    window.cancelAnimationFrame(this.animationFrameId)
  }

  frame(): void
  {
    this.animationFrameId = window.requestAnimationFrame(this.render.bind(this))
  }

  render(time: number): void
  {
    const context = this.context as CanvasRenderingContext2D
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const delta = time - this.lastFrameTime
    this.lastFrameTime = time

    this.gameObjects.forEach(item => {
      item.update(delta / 1000)
      item.render(this.context)
    })

    this.frame()
  }
}

class Bullet
{

}

class Partical
{

}

export default class Asteroids
{
  scene: Scene
  ship: Ship | undefined
  background: StarBackground | undefined
  rocks: Array<Rock>
  bullets: Array<Bullet>
  particals: Array<Partical>

  constructor(canvas: HTMLCanvasElement)
  {
    this.scene = new Scene(canvas)
    this.ship = undefined
    this.background = undefined
    this.rocks = []
    this.bullets = []
    this.particals = []
  }

  play()
  {
    this.ship = new Ship(this.scene, this.scene.width / 2, this.scene.height / 2, 10)
    this.background = new StarBackground(this.scene)

    this.scene.add(this.background)

    // Create rocks
    for (let count: number = 0; count < 100; count++)
    {
      const rock: Rock = new Rock(this.scene, between(0, this.scene.width), between(0, this.scene.height))
      this.scene.add(rock)
    }

    this.scene.add(this.ship)

    this.ship.angle = 40
    this.ship.setVelocity(500)

    this.scene.play()
  }

  stop()
  {
    this.scene.stop()
  }
}