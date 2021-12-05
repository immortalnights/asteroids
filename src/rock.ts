import Scene from './scene'
import Vector2D from './vector2d'
import M from './math'
import RND from './rnd'

export default class Rock
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
          point.x += RND.between(-(r * 0.25), r * 0.25)
          point.y += RND.between(-(r * 0.25), r * 0.25)
      })

      return points
    }

    this.scene = scene
    this.position = new Vector2D(x, y)
    this.size = 28
    this.angle = 0
    this.rotationSpeed = RND.floatBetween(0.1, 2)
    this.velocity = new Vector2D(RND.between(-200, 200), RND.between(-200, 200))
    this.points = createPolygonPoints(0, 0, this.size, 12)
    // console.log(this.position, this.velocity)
  }

  get radians(): number
  {
    return this.angle * Math.PI / 180
  }

  update(delta: number)
  {
    const movement: Vector2D = this.velocity.clone().multiply(delta, delta)
    this.position.add(movement)

    this.position.x = M.wrap(this.position.x, -(this.size * 2), this.scene.width + (this.size * 2))
    this.position.y = M.wrap(this.position.y, -(this.size * 2), this.scene.height + (this.size * 2))

    this.angle += this.rotationSpeed

    // console.log(`${this.position.x}, ${this.position.y} ${this.angle}`)
  }

  render(context: CanvasRenderingContext2D)
  {
    context.save()
    context.strokeStyle = '#aaaaaa'
    context.fillStyle = '#333333'

    context.translate(this.position.x + this.size / 2, this.position.y + this.size / 2)
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

    // center point
    // context.fillStyle = '#ffffff'
    // context.fillRect(-1, -1, 2, 2)

    context.setTransform(1, 0, 0, 1, 0, 0)

    context.restore()
  }
}