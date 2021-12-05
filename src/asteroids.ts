import Scene from './scene'

export default class Asteroids
{
  scene: Scene
  animationFrameId: number
  lastFrameTime: number

  constructor(canvas: HTMLCanvasElement)
  {
    this.scene = new Scene(canvas)
    this.animationFrameId = 0
    this.lastFrameTime = 0
    this.onFrame = this.onFrame.bind(this)
  }

  resize()
  {
    // this.scene.canvas.width = window.innerWidth
    // this.scene.canvas.height = window.innerHeight

    const size = this.scene.canvas.getBoundingClientRect()
      // const ratio = window.devicePixelRatio || 1

    this.scene.canvas.width = size.width
    this.scene.canvas.height = size.height
  }

  play()
  {
    // this.active = true
    this.scene.create()
    this.onFrame(0)
  }

  onFrame(time: number)
  {
    const delta = (time - this.lastFrameTime) / 1000
    this.lastFrameTime = time

    this.scene.update(delta)
    this.scene.render(delta)

    this.animationFrameId = window.requestAnimationFrame(this.onFrame)
  }

  stop()
  {
    window.cancelAnimationFrame(this.animationFrameId)
  }
}