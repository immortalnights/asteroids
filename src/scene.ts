import { Pointer } from './types'
import Ship from './ship'
import M from './math'

export default class Scene
{
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D | null
  pointer: Pointer
  gameObjects: Array<any>
  animationFrameId: number
  lastFrameTime: number

  constructor(canvas: HTMLCanvasElement)
  {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.pointer = { x: 0, y: 0, in: false }
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
    this.canvas.addEventListener('mouseenter', event => {
      this.pointer.in = true
    })
    this.canvas.addEventListener('mouseleave', event => {
      this.pointer.in = false
    })
    this.canvas.addEventListener('mousemove', event => {
      const rect = this.canvas.getBoundingClientRect()
      const scaleX = this.canvas.width / rect.width
      const scaleY = this.canvas.height / rect.height

      this.pointer.x = (event.clientX - rect.left) * scaleX
      this.pointer.y = (event.clientY - rect.top) * scaleY
    })

    this.frame()
  }

  stop(): void
  {
    window.cancelAnimationFrame(this.animationFrameId)
  }

  frame(): void
  {
    this.animationFrameId = window.requestAnimationFrame((time: number) => {
      this.update(time)
      this.render(time)
    })
  }

  update(time: number)
  {
    // Turn ship towards the pointer location
    const ship = this.gameObjects.find(obj => obj instanceof Ship)

    if (this.pointer.in)
    {
      const TURN_SPEED: number = 1
      let angle = M.Angle.between(ship.position, this.pointer)
      // console.log(ship.angle, angle)

      // angle = (angle, 0, 360)

      if (ship.angle > angle)
      {
        ship.angle -= TURN_SPEED
      }
      else if (ship.angle < angle)
      {
        ship.angle += TURN_SPEED
      }
    }
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

    context.fillStyle = '#ffffff'
    context.fillText(`${this.pointer.x}, ${this.pointer.y}`, 10, 10)

    this.frame()
  }
}
