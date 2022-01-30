import Asteroids from './asteroids'

declare global {
  interface Window { AsteroidsNS: any }
}

let game: Asteroids | undefined

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement
  game = new Asteroids(canvas)
  game.resize()
  game.start()

  window.addEventListener('resize', () => {
    (game as Asteroids).resize()
  })
})

window.AsteroidsNS = window.AsteroidsNS || {
  play: function() {
    game?.play()
  },

  end: function() {
    game?.end()
  },
}