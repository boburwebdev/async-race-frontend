import { useState, useEffect } from 'react'
import Garage from './components/Garage/Garage'

import { CarModel, WinnerModel } from './models/Models'
import { modifyWinnerData } from './utils/WinnerUtils'
import { generateRandomCarName, generateRandomHexColor } from './utils/RandomUtils'
import {
  calculateRaceDuration,
  getRaceWinner,
  storeRaceWinnerResults,
  convertRaceTimeToSeconds,
} from './utils/RaceUtils'
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
import { getCarsOnCurrentPage } from './utils/CarUtils'
import Winners from './components/Winners/Winners'
import Modal from './components/Modal/Modal'

const { numberOfGeneratedCars, carsPerPageInGarage, carsPerPageInWinners } = config

function App() {
  const [showGarage, setShowGarage] = useState<boolean>(true)
  const [carsList, setCarsList] = useState<CarModel[]>([])
  const [carName, setCarName] = useState<string>('')
  const [carNameUpdate, setCarNameUpdate] = useState<string>('')
  const [carColor, setCarColor] = useState<string>('#000000')
  const [carColorUpdate, setCarColorUpdate] = useState<string>('#000000')
  const [selectedCarId, setSelectedCarId] = useState<number>(0)
  const [currentGaragePage, setCurrentGaragePage] = useState<number>(0)
  const [currentWinnersPage, setCurrentWinnersPage] = useState<number>(0)
  const [winnersList, setWinnersList] = useState<WinnerModel[]>([])
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false)
  const [winner, setWinner] = useState<CarModel | undefined>()

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsData = await getCars()
        if (carsData) {
          setCarsList(carsData)
        }
      } catch (err) {
        console.error(err)
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

  const handleChangeCarName = (carName: string) => {
    setCarName(carName)
  }
  const handleChangeCarNameUpdate = (carName: string) => {
    setCarNameUpdate(carName)
  }
  const handleChangeCarColor = (carName: string) => {
    setCarColor(carName)
  }
  const handleChangeCarColorUpdate = (carName: string) => {
    setCarColorUpdate(carName)
  }

  const handleClickAddNewCar = async (carName: string, carColor: string) => {
    try {
      const carData = await submitNewCar(carName, carColor)
      if (carData) {
        setCarsList(prevList => [
          ...prevList,
          { ...carData, isAnimated: false, isFinished: false, raceDuration: 0 },
        ])

        setCarName('')
        setCarColor('#000000')
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
        setCarNameUpdate('')
        setCarColorUpdate('#000000')
        setSelectedCarId(0)
      }
    } catch (err) {
      console.error("Couldn't update the car: ", err)
    }
  }

  const handleClickEditCar = (id: number) => {
    setSelectedCarId(id)
  }

  const handleClickStartEngine = async (carId: number) => {
    setCarsList(prevList =>
      prevList.map(item => (item.id === carId ? { ...item, isAnimated: true } : item))
    )

    try {
      const carEngine = await startCarEngine(carId)

      if (carEngine) {
        const duration = carEngine.velocity ? carEngine.distance / carEngine.velocity : 0
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

  const handleClickRace = async () => {
    const carsThatMadeIt: CarModel[] = []

    try {
      const filteredCars: (CarModel | null)[] = await filterCarsThatMadeIt(carsThatMadeIt)
      const results: (CarModel | null)[] = filteredCars?.filter((item: CarModel | null): boolean =>
        Boolean(item)
      )
      let winner: CarModel | undefined = getRaceWinner(results)

      if (winner) {
        setWinner(winner)
        setShowWinnerModal(true)
        await storeRaceWinnerResults(winnersList, winner)
        const winnersData = await getWinners()
        const modifiedWinnersData = modifyWinnerData(carsList, winnersData)
        setWinnersList(modifiedWinnersData)
      }
    } catch (err) {
      console.error('error with filteredCars: ', err)
    }
  }

  const handleClickReset = async () => {
    if (carsList) {
      const carsOnCurrentPage = getCarsOnCurrentPage(
        carsList,
        currentGaragePage,
        carsPerPageInGarage
      )

      carsOnCurrentPage.forEach(async car => {
        try {
          const carEngineData = await stopCarEngine(car.id)
          if (carEngineData) {
            setCarsList(prevList =>
              prevList.map(item =>
                item.id === car.id
                  ? { ...item, isAnimated: false, isRaceFinished: false, raceDuration: 0 }
                  : item
              )
            )
          }
        } catch (err) {
          console.error("Couldn't stop the engine: ", err)
        }
      })
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
    const result = carsList.length > carsPerPageInGarage * (currentGaragePage + 1)
    if (result) {
      setCurrentGaragePage(prevVal => prevVal + 1)
    }
  }

  const handleClickWinnersPrev = () => {
    if (currentWinnersPage > 0) {
      setCurrentWinnersPage(prevVal => prevVal - 1)
    }
  }

  const handleClickWinnersNext = () => {
    const result = winnersList.length > carsPerPageInWinners * (currentWinnersPage + 1)
    if (result) {
      setCurrentWinnersPage(prevVal => prevVal + 1)
    }
  }

  const filterCarsThatMadeIt = async (carsThatMadeIt: CarModel[]) => {
    const carsOnCurrentPage = getCarsOnCurrentPage(carsList, currentGaragePage, carsPerPageInGarage)
    return await Promise.all(
      carsOnCurrentPage.map(async car => {
        let duration: number
        setCarsList(prevList =>
          prevList.map(item => (item.id === car.id ? { ...item, isAnimated: true } : item))
        )
        try {
          const engineStartData = await startCarEngine(car.id)
          if (engineStartData) {
            duration = calculateRaceDuration(engineStartData)
            setCarsList(prevList =>
              prevList.map(item =>
                item.id === car.id
                  ? { ...item, raceDuration: duration, isRaceFinished: true }
                  : item
              )
            )
            try {
              const driveModeData = await setEngineToDriveMode(car.id)
              if (driveModeData.success) {
                carsThatMadeIt.push({ ...car, raceDuration: duration })
                setCarsList(prevList =>
                  prevList.map(item =>
                    item.id === car.id ? { ...item, isRaceFinished: true, isAnimated: false } : item
                  )
                )
                return { ...car, raceDuration: duration }
              }
            } catch (err) {
              setCarsList(prevList =>
                prevList.map(item =>
                  item.id === car.id
                    ? { ...item, raceDuration: 0, isRaceFinished: false, isAnimated: false }
                    : item
                )
              )
            }
          }
          return null
        } catch (err) {
          return null
        }
      })
    )
  }

  const handleClickCloseModal = () => {
    setShowWinnerModal(false)
  }

  return (
    <>
      <Modal isOpen={showWinnerModal} closeModal={handleClickCloseModal}>
        <h3 className="modal__title">Winner</h3>
        <div className="modal__winner-name">
          Model: <span>{winner?.name}</span>
        </div>
        <div className="modal__winner-time">
          Time: <span>{convertRaceTimeToSeconds(winner?.raceDuration)}sec</span>
        </div>
      </Modal>
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
              startRace={handleClickRace}
              resetRace={handleClickReset}
              generateCars={handleClickGenerateCars}
              clickPrev={handleClickGaragePrev}
              clickNext={handleClickGarageNext}
              carName={carName}
              carNameUpdate={carNameUpdate}
              carColor={carColor}
              carColorUpdate={carColorUpdate}
              selectedCarId={selectedCarId}
              setCarName={handleChangeCarName}
              setCarNameUpdate={handleChangeCarNameUpdate}
              setCarColor={handleChangeCarColor}
              setCarColorUpdate={handleChangeCarColorUpdate}
              setSelectedCarId={handleClickEditCar}
            />
          ) : (
            <Winners
              winnersList={winnersList}
              currentPage={currentWinnersPage}
              clickPrev={handleClickWinnersPrev}
              clickNext={handleClickWinnersNext}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default App
