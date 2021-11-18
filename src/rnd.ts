export const between = (min: number, max: number): number => {
  return Math.floor(floatBetween(min, max))
}

export const floatBetween = (min: number, max: number): number => {
  return (Math.random() * max) + min
}

export const pick = (choices: Array<any>): any => {
  const index = between(0, choices.length)
  return choices[index]
}

export default {
  between,
  floatBetween,
  pick
}