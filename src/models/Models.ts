export interface WinnerModel {
  id: number
  time: string
  wins: number
  modelName: string
  color: string
}

export interface CarModel {
  id: number
  name: string
  color: string
  isAnimated: boolean
  isRaceFinished: boolean
  raceDuration: number
}

export interface RaceDuration {
  velocity: number
  distance: number
}
