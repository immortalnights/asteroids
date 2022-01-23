
export interface Pointer {
  x: number,
  y: number,
  in: boolean
}

export default class Input
{
  canvas: HTMLCanvasElement
  pointer: Pointer
  turnToMouse: boolean
  turn: number
  accelerate: number
  shoot: boolean
  changed: boolean

  constructor(canvas: HTMLCanvasElement)
  {
    this.canvas = canvas
    this.pointer = { x: 0, y: 0, in: false }
    this.turnToMouse = false
    this.turn = 0
    this.accelerate = 0
    this.shoot = false
    this.changed = false

    // canvas must have a tab index to have keyboard events
    canvas.tabIndex = 0
    canvas.focus()

    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)

    window.addEventListener('mousedown', this.onMouseDown)
    this.canvas.addEventListener('mouseenter', this.onMouseEnter)
    this.canvas.addEventListener('mouseleave', this.onMouseLeave)
    this.canvas.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  onMouseDown(event: MouseEvent): void
  {
    event.preventDefault()
    this.turnToMouse = true
    this.shoot = true
    this.changed = true
  }

  onMouseEnter(event: MouseEvent): void
  {
    event.preventDefault()
    this.pointer.in = true
  }

  onMouseLeave(event: MouseEvent): void
  {
    event.preventDefault()
    this.pointer.in = false
  }

  onMouseMove(event: MouseEvent): void
  {
    event.preventDefault()
    const rect = this.canvas.getBoundingClientRect()
    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height

    this.pointer.x = (event.clientX - rect.left) * scaleX
    this.pointer.y = (event.clientY - rect.top) * scaleY
  }

  onKeyDown(event: KeyboardEvent): void
  {
    event.preventDefault()
    if (event.key === 'w' || event.key === 'ArrowUp')
    {
      this.accelerate = 1
    }
    else if (event.key === 's' || event.key === 'ArrowDown')
    {
      this.accelerate = -1
    }
    else if (event.key === 'a' || event.key === 'ArrowLeft')
    {
      this.turn = -1
      this.turnToMouse = false
    }
    else if (event.key === 'd' || event.key === 'ArrowRight')
    {
      this.turn = 1
      this.turnToMouse = false
    }
    else if (event.key === ' ')
    {
      this.shoot = true
    }

    this.changed = true
  }

  onKeyUp(event: KeyboardEvent)
  {
    if (event.key === 'w' || event.key === 'ArrowUp')
    {
      this.accelerate = 0
    }
    else if (event.key === 's' || event.key === 'ArrowDown')
    {
      this.accelerate = 0
    }
    else if (event.key === 'a' || event.key === 'ArrowLeft')
    {
      this.turn = 0
    }
    else if (event.key === 'd' || event.key === 'ArrowRight')
    {
      this.turn = 0
    }
    else if (event.key === ' ')
    {
      this.shoot = false
    }

    this.changed = true
  }

  destroy()
  {
    window.removeEventListener('mousedown', this.onMouseDown)
    this.canvas.removeEventListener('mouseenter', this.onMouseEnter)
    this.canvas.removeEventListener('mouseleave', this.onMouseLeave)
    this.canvas.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }
}