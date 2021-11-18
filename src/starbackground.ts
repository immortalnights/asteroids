import Scene from './scene'
import RND from './rnd'

export default class StarBackground
{
  scene: Scene
  stars: Array<any>

  constructor(scene: Scene)
  {
    this.scene = scene
    this.stars = []
    for (let index = 0; index < 300; index++)
    {
      const size = RND.between(1, 2)
      const alpha = RND.floatBetween(0.1, 1)
      const x = RND.between(0, scene.width)
      const y = RND.between(0, scene.height)
      const color = RND.pick([ '255, 255, 255', '128, 0, 128', '34, 34, 153' ])
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
