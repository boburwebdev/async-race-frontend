import { CarModel, WinnerModel } from '../models/Models'

export function modifyWinnerData(carsList: CarModel[], winnersList: WinnerModel[]): WinnerModel[] {
  return winnersList.map((winnerItem: WinnerModel) => {
    const car = carsList.find((carItem: CarModel) => carItem.id === winnerItem.id)
    return car
      ? {
          ...winnerItem,
          time: (Number(winnerItem.time) / 1000).toFixed(2),
          color: car?.color,
          modelName: car?.name,
        }
      : winnerItem
  })
}
