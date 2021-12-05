import Asteroids from './asteroids'

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement
  const asteroids = new Asteroids(canvas)
  asteroids.resize()
  asteroids.play()

  window.addEventListener('resize', () => {
    asteroids.resize()
  })
})