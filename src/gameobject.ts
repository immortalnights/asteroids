import Scene from "./scene";
import Vector2D from "./vector2d";

export type Box = {
  x: number
  y: number
  top: number
  right: number
  bottom: number
  left: number
}

export type GameObject = {
  readonly scene: Scene
  readonly position: Vector2D
  active: boolean

  getBoundingBox(): Box
  update(delta: number): void
  render(context: CanvasRenderingContext2D): void
}
