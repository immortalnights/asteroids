

const MAX_ROCK_COUNT: number = 10

import Bullet from './bullet'
import Particle from './particle'
import Rock from './rock'
import Scene from './scene'
import Ship from './ship'
import StarBackground from './starbackground'
import RND from './rnd'


export default class Asteroids
{
  scene: Scene
  ship: Ship | undefined
  background: StarBackground | undefined
  rocks: Array<Rock>
  bullets: Array<Bullet>
  particals: Array<Particle>

  constructor(canvas: HTMLCanvasElement)
  {
    this.scene = new Scene(canvas)
    this.ship = undefined
    this.background = undefined
    this.rocks = []
    this.bullets = []
    this.particals = []
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
    this.ship = new Ship(this.scene, this.scene.width / 2, this.scene.height / 2, 10)
    this.background = new StarBackground(this.scene)

    this.scene.add(this.background)

    // Create rocks
    for (let count: number = 0; count < MAX_ROCK_COUNT; count++)
    {
      const rock: Rock = new Rock(this.scene, RND.between(0, this.scene.width), RND.between(0, this.scene.height))
      this.scene.add(rock)
    }

    this.scene.add(this.ship)

    this.ship.angle = -150
    this.ship.setVelocity(500)

    this.scene.play()
  }

  stop()
  {
    this.scene.stop()
  }
}