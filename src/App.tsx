import { useState, useEffect } from 'react'
import Garage from './components/Garage/Garage'

import { CarModel, WinnerModel } from './models/Models'
import { modifyWinnerData } from './utils/WinnerUtils'
import { generateRandomCarName, generateRandomHexColor } from './utils/RandomUtils'
import {
  getCars,
  getWinners,
  submitNewCar,
  deleteCar,
  updateCar,
  startCarEngine,
  stopCarEngine,
  setEngineToDriveMode,
} from './utils/APIUtils'
import { config } from './config/config'
import './App.scss'

const { numberOfGeneratedCars } = config

function App() {
  const [showGarage, setShowGarage] = useState<boolean>(true)
  const [carsList, setCarsList] = useState<CarModel[]>([])
  const [currentGaragePage, setCurrentGaragePage] = useState<number>(0)
  const [winnersList, setWinnersList] = useState<WinnerModel[]>([])

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsData = await getCars()
        if (carsData) {
          setCarsList(carsData)
        }
      } catch (err) {
        console.log(err)
      }
    }

    const fetchWinners = async () => {
      try {
        const carsData = await getCars()
        const winnersData = await getWinners()

        if (winnersData && carsData) {
          const modifiedWinnersData = modifyWinnerData(carsData, winnersData)
          setWinnersList(modifiedWinnersData)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchCars()
    fetchWinners()
  }, [])

  function handleClickGarage() {
    setShowGarage(true)
  }

  function handleClickWinners() {
    setShowGarage(false)
  }

  const handleClickAddNewCar = async (carName: string, carColor: string) => {
    try {
      const carData = await submitNewCar(carName, carColor)
      if (carData) {
        setCarsList(prevList => [
          ...prevList,
          { ...carData, isAnimated: false, isFinished: false, raceDuration: 0 },
        ])
      }
    } catch (err) {
      console.error("Couldn't add new car: ", err)
    }
  }

  const handleClickDeleteCar = async (carId: number) => {
    try {
      const response = await deleteCar(carId)
      if (response?.ok) {
        setCarsList(prevList => prevList.filter(item => item.id !== carId))
      }
    } catch (err) {
      console.error("Couldn't delete the car: ", err)
    }
  }

  const handleClickUpdateCar = async (carId: number, carName: string, carColor: string) => {
    try {
      const carData = await updateCar(carId, carName, carColor)
      if (carData) {
        setCarsList(prevList => prevList.map(car => (car.id === carId ? { ...carData } : car)))
      }
    } catch (err) {
      console.error("Couldn't update the car: ", err)
    }
  }

  const handleClickStartEngine = async (carId: number) => {
    setCarsList(prevList =>
      prevList.map(item => (item.id === carId ? { ...item, isAnimated: true } : item))
    )

    try {
      const carEngine = await startCarEngine(carId)

      if (carEngine) {
        const duration = carEngine.velocity ? carEngine.distance / carEngine.velocity : 0
        console.log('duration: ', duration)
        console.log('data: ', carEngine)

        setCarsList(prevList =>
          prevList.map(item =>
            item.id === carId ? { ...item, raceDuration: duration, isRaceFinished: true } : item
          )
        )
      }
    } catch (err) {
      console.error("Couldn't start the engine: ", err)
    }

    try {
      await setEngineToDriveMode(carId)
    } catch (err) {
      setCarsList(prevList =>
        prevList.map(item =>
          item.id === carId
            ? { ...item, raceDuration: 0, isRaceFinished: false, isAnimated: false }
            : item
        )
      )

      console.error('Error with the drive mode: ', err)
    }
  }

  const handleClickStopEngine = async (carId: number) => {
    try {
      const engineData = await stopCarEngine(carId)
      if (engineData) {
        setCarsList(prevList =>
          prevList.map(item =>
            item.id === carId
              ? { ...item, isAnimated: false, isRaceFinished: false, raceDuration: 0 }
              : item
          )
        )
      }
    } catch (err) {
      console.error("Couldn't stop the engine: ", err)
    }
  }

  const handleClickGenerateCars = async () => {
    for (let i = 0; i < numberOfGeneratedCars; i++) {
      try {
        const newCarData = await submitNewCar(generateRandomCarName(), generateRandomHexColor())
        setCarsList(prevList => [...prevList, newCarData])
      } catch (err) {
        console.error("Couldn't create a car: ", err)
      }
    }
  }

  const handleClickGaragePrev = () => {
    if (currentGaragePage > 0) {
      setCurrentGaragePage(prevVal => prevVal - 1)
    }
  }
  const handleClickGarageNext = () => {
    const result = carsList.length > 7 * (currentGaragePage + 1)
    if (result) {
      setCurrentGaragePage(prevVal => prevVal + 1)
    }
  }

  return (
    <>
      <div className="top">
        <div className="container">
          <div className="top__inner">
            <nav className="top__menu">
              <ul className="top__menu-list">
                <li
                  className={showGarage ? 'top__menu-item active' : 'top__menu-item'}
                  onClick={handleClickGarage}
                >
                  Garage
                </li>
                <li
                  className={!showGarage ? 'top__menu-item active' : 'top__menu-item'}
                  onClick={handleClickWinners}
                >
                  Winners
                </li>
              </ul>
            </nav>
            <h1 className="top__logo">Async Race</h1>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="container">
          {showGarage ? (
            <Garage
              carsList={carsList}
              currentPage={currentGaragePage}
              addNewCar={handleClickAddNewCar}
              deleteCar={handleClickDeleteCar}
              updateCar={handleClickUpdateCar}
              startEngine={handleClickStartEngine}
              stopEngine={handleClickStopEngine}
              generateCars={handleClickGenerateCars}
              clickPrev={handleClickGaragePrev}
              clickNext={handleClickGarageNext}
            />
          ) : (
            <h3>Winners</h3>
          )}
        </div>
      </div>
    </>
  )
}

export default App
