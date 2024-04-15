import { CarModel } from '../models/Models'

export function modifyCarData(carsData: CarModel[]): CarModel[] {
  let modifiedCars: CarModel[] = []

  if (carsData) {
    modifiedCars = carsData.map((item: CarModel) => ({
      ...item,
      isAnimated: false,
      isFinished: false,
      raceDuration: 0,
    }))
  }

  return modifiedCars
}
