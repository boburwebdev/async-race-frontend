import { RaceDuration, WinnerModel, CarModel } from '../models/Models';
import { createWinner, updateWinner } from './APIUtils';

export function calculateRaceDuration(data: RaceDuration) {
  return data.velocity ? data.distance / data.velocity : 0;
}

export function convertRaceTimeToSeconds(raceTime: number | undefined) {
  return raceTime ? Number(Number(raceTime / 1000).toFixed(2)) : 0;
}

export function getRaceWinner(results: (CarModel | null)[]): CarModel | undefined {
  let winner: CarModel | undefined;
  if (results) {
    for (let i = 0; i < results.length; i += 1) {
      const currentCar = results[i];
      if (currentCar) {
        winner = currentCar.raceDuration < (winner?.raceDuration ?? Infinity) ? currentCar : winner;
      }
    }
  }

  return winner || undefined;
}

export async function storeRaceWinnerResults(winnersList: WinnerModel[], winner: CarModel) {
  const prevWinnerResult: WinnerModel | undefined = winnersList.find(
    (item: WinnerModel): boolean => item?.id === winner.id,
  );

  if (prevWinnerResult) {
    try {
      const updatedWins: number = (prevWinnerResult?.wins ?? 0) + 1;
      const raceTime = convertRaceTimeToSeconds(winner.raceDuration);
      let winnerTime = Number(prevWinnerResult.time);
      if (Number(prevWinnerResult.time) > raceTime) {
        winnerTime = raceTime;
      }
      await updateWinner(winner.id, updatedWins, Number(winnerTime));
    } catch (error) {
      console.error('error occured on winner update: ', error);
    }
  } else {
    try {
      await createWinner(winner.id, convertRaceTimeToSeconds(winner.raceDuration));
    } catch (error) {
      console.error('error occured on create winner: ', error);
    }
  }
}
