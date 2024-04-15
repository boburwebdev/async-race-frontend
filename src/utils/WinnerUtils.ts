import { CarModel, WinnerModel } from '../models/Models'

export function modifyWinnerData(carsList: CarModel[], winnersList: WinnerModel[]): WinnerModel[] {
  return winnersList.map((winnerItem: WinnerModel) => {
    const car = carsList.find((carItem: CarModel) => carItem.id === winnerItem.id)
    return car
      ? {
          ...winnerItem,
          color: car?.color,
          modelName: car?.name,
        }
      : winnerItem
  })
}
