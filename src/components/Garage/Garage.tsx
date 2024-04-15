import React, { useState, useRef } from 'react'

import CarItem from '../CarItem/CarItem'
import { CarModel } from '../../models/Models'

import './Garage.scss'

interface GarageProps {
  carsList: CarModel[]
  currentPage: number
  addNewCar: (name: string, color: string) => Promise<void>
  deleteCar: (carId: number) => Promise<void>
  updateCar: (carId: number, name: string, color: string) => Promise<void>
  startEngine: (carId: number) => Promise<void>
  stopEngine: (carId: number) => Promise<void>
  startRace: () => Promise<void>
  resetRace: () => Promise<void>
  generateCars: () => Promise<void>
  clickPrev: () => void
  clickNext: () => void
}

const Garage: React.FC<GarageProps> = ({
  carsList,
  currentPage,
  addNewCar,
  deleteCar,
  updateCar,
  startEngine,
  stopEngine,
  startRace,
  resetRace,
  generateCars,
  clickPrev,
  clickNext,
}) => {
  const [carName, setCarName] = useState<string>('')
  const [carColor, setCarColor] = useState<string>('#f6b73c')
  const [carId, setCarId] = useState<number>(0)
  const [carNameUpdate, setCarNameUpdate] = useState<string>('')
  const [carColorUpdate, setCarColorUpdate] = useState<string>('#000000')

  const inputRefName = useRef<HTMLInputElement>(null)
  const inputRefColor = useRef<HTMLInputElement>(null)

  const handleChangeAddCarName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarName(e.target.value)
  }

  const handleChangeAddCarColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarColor(e.target.value)
  }

  const handleChangeEditCarName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarNameUpdate(e.target.value)
  }

  const handleChangeEditCarColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarColorUpdate(e.target.value)
  }

  const handleSubmitAddCar = async (e: React.FormEvent) => {
    e.preventDefault()
    addNewCar(carName, carColor)
    setCarName('')
    setCarColor('#000000')
  }

  const handleSubmitUpdateCar = async (e: React.FormEvent) => {
    e.preventDefault()
    updateCar(carId, carNameUpdate, carColorUpdate)

    setCarNameUpdate('')
    setCarColorUpdate('#000000')
    setCarId(0)
  }

  const handleClickEditCar = (id: number) => {
    const selectedCar = carsList.find(carItem => carItem.id === id)
    if (selectedCar) {
      setCarId(id)
      setCarNameUpdate(selectedCar.name)
      setCarColorUpdate(selectedCar.color)
    }
  }

  const handleClickDeleteCar = async (id: number) => {
    deleteCar(id)
  }

  const handleClickStartEngine = async (id: number) => {
    startEngine(id)
  }

  const handleClickStopEngine = async (id: number) => {
    stopEngine(id)
  }

  const handleClickGenerateCars = async () => {
    generateCars()
  }

  const handleClickPaginationPrev = () => {
    clickPrev()
  }

  const handleClickPaginationNext = () => {
    clickNext()
  }

  const handleClickRace = () => {
    startRace()
  }

  const handleClickReset = () => {
    resetRace()
  }

  let carsOnCurrentPage: CarModel[] = []

  if (carsList) {
    carsOnCurrentPage = carsList?.slice(currentPage * 7, currentPage * 7 + 7)
  }

  return (
    <div className="garage">
      <h3 className="section__title garage__title">Garage</h3>
      <div className="garage__menu">
        <div className="garage__race-controls">
          <button
            className="btn btn__green btn__race-controls btn__race-controls--race"
            onClick={handleClickRace}
          >
            Race
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.745 3.0639C5.66891 3.02113 5.58294 2.99903 5.49565 2.99978C5.40836 3.00054 5.32279 3.02414 5.24745 3.06823C5.17211 3.11232 5.10963 3.17537 5.06622 3.2511C5.02281 3.32683 4.99998 3.41261 5 3.4999V12.4999C4.99998 12.5872 5.02281 12.673 5.06622 12.7487C5.10963 12.8244 5.17211 12.8875 5.24745 12.9316C5.32279 12.9757 5.40836 12.9993 5.49565 13C5.58294 13.0008 5.66891 12.9787 5.745 12.9359L13.745 8.4359C13.8222 8.39237 13.8864 8.3291 13.9311 8.25257C13.9758 8.17605 13.9994 8.08902 13.9994 8.0004C13.9994 7.91179 13.9758 7.82476 13.9311 7.74823C13.8864 7.67171 13.8222 7.60844 13.745 7.5649L5.745 3.0639ZM4 3.4999C4.0001 3.23811 4.06872 2.98091 4.19903 2.75385C4.32934 2.52679 4.5168 2.33779 4.74279 2.20564C4.96878 2.07349 5.22542 2.00278 5.4872 2.00054C5.74898 1.99831 6.00679 2.06463 6.235 2.1929L14.235 6.6929C14.467 6.82337 14.6602 7.01324 14.7946 7.24302C14.929 7.47279 14.9999 7.7342 14.9999 8.0004C14.9999 8.26661 14.929 8.52802 14.7946 8.75779C14.6602 8.98757 14.467 9.17744 14.235 9.3079L6.235 13.8079C6.00672 13.9362 5.74882 14.0025 5.48695 14.0003C5.22508 13.998 4.96837 13.9272 4.74236 13.7949C4.51634 13.6626 4.32889 13.4735 4.19865 13.2463C4.06842 13.0191 3.99993 12.7618 4 12.4999V3.4999Z"
                fill="#16A085"
              />
            </svg>
          </button>
          <button
            className="btn btn__gray btn__race-controls btn__race-controls--reset"
            onClick={handleClickReset}
          >
            Reset
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.85392 2.64592C5.90048 2.69236 5.93742 2.74754 5.96263 2.80828C5.98784 2.86903 6.00081 2.93415 6.00081 2.99992C6.00081 3.06568 5.98784 3.13081 5.96263 3.19155C5.93742 3.2523 5.90048 3.30747 5.85392 3.35392L4.20692 4.99992H10.9999C12.1866 4.99992 13.3466 5.35181 14.3333 6.0111C15.32 6.67039 16.0891 7.60746 16.5432 8.70382C16.9973 9.80017 17.1161 11.0066 16.8846 12.1705C16.6531 13.3343 16.0817 14.4034 15.2426 15.2426C14.4034 16.0817 13.3343 16.6531 12.1705 16.8846C11.0066 17.1161 9.80017 16.9973 8.70382 16.5432C7.60746 16.0891 6.67039 15.32 6.0111 14.3333C5.35181 13.3466 4.99992 12.1866 4.99992 10.9999C4.99992 10.8673 5.0526 10.7401 5.14636 10.6464C5.24013 10.5526 5.36731 10.4999 5.49992 10.4999C5.63253 10.4999 5.7597 10.5526 5.85347 10.6464C5.94724 10.7401 5.99992 10.8673 5.99992 10.9999C5.99992 11.9888 6.29316 12.9555 6.84257 13.7778C7.39198 14.6 8.17287 15.2409 9.0865 15.6193C10.0001 15.9978 11.0055 16.0968 11.9754 15.9038C12.9453 15.7109 13.8362 15.2347 14.5355 14.5355C15.2347 13.8362 15.7109 12.9453 15.9038 11.9754C16.0968 11.0055 15.9978 10.0001 15.6193 9.0865C15.2409 8.17287 14.6 7.39198 13.7778 6.84257C12.9555 6.29316 11.9888 5.99992 10.9999 5.99992H4.20692L5.85392 7.64592C5.90041 7.6924 5.93728 7.74759 5.96244 7.80833C5.9876 7.86907 6.00055 7.93417 6.00055 7.99992C6.00055 8.06566 5.9876 8.13076 5.96244 8.1915C5.93728 8.25224 5.90041 8.30743 5.85392 8.35392C5.80743 8.4004 5.75224 8.43728 5.6915 8.46244C5.63076 8.4876 5.56566 8.50055 5.49992 8.50055C5.43417 8.50055 5.36907 8.4876 5.30833 8.46244C5.24759 8.43728 5.19241 8.4004 5.14592 8.35392L2.64592 5.85392C2.59935 5.80747 2.56241 5.7523 2.5372 5.69155C2.512 5.63081 2.49902 5.56568 2.49902 5.49992C2.49902 5.43415 2.512 5.36903 2.5372 5.30828C2.56241 5.24754 2.59935 5.19236 2.64592 5.14592L5.14592 2.64592C5.19236 2.59935 5.24754 2.56241 5.30828 2.5372C5.36903 2.512 5.43415 2.49902 5.49992 2.49902C5.56568 2.49902 5.63081 2.512 5.69155 2.5372C5.7523 2.56241 5.80747 2.59935 5.85392 2.64592Z"
                fill="#7F8C8D"
              />
            </svg>
          </button>
        </div>

        <form className="garage__menu-form garage__add-new-car" onSubmit={handleSubmitAddCar}>
          <input
            className="input garage__input garage__input-brand"
            type="text"
            placeholder="Car brand"
            onChange={handleChangeAddCarName}
            value={carName}
          />
          <input
            className="input garage__input garage__input-color"
            type="color"
            onChange={handleChangeAddCarColor}
            value={carColor}
          />

          <button className="btn btn__green btn__add-new-car">Add New Car</button>
        </form>

        <form className="garage__menu-form garage__edit-car" onSubmit={handleSubmitUpdateCar}>
          <input
            className="input garage__input garage__input-brand"
            type="text"
            placeholder="Car brand"
            value={carNameUpdate}
            ref={inputRefName}
            onChange={handleChangeEditCarName}
          />
          <input
            className="input garage__input garage__input-color"
            type="color"
            value={carColorUpdate}
            ref={inputRefColor}
            onChange={handleChangeEditCarColor}
          />

          <button className="btn btn__green btn__edit-car">Update Car</button>
        </form>

        <div className="garage__generate-cars">
          <button className="btn btn__green btn__generate-cars" onClick={handleClickGenerateCars}>
            Generate Cars
          </button>
        </div>
      </div>

      <div className="garage__middle">
        {carsOnCurrentPage.map(carItem => {
          return (
            <CarItem
              key={carItem.id}
              id={carItem.id}
              name={carItem.name}
              color={carItem.color}
              isRaceFinished={carItem.isRaceFinished}
              raceDuration={carItem.raceDuration}
              isAnimated={carItem.isAnimated}
              editCar={handleClickEditCar}
              deleteCar={handleClickDeleteCar}
              startEngine={handleClickStartEngine}
              stopEngine={handleClickStopEngine}
            />
          )
        })}
      </div>

      <div className="garage__bottom">
        <div className="garage__total-cars">
          <h3>
            Total Cars:
            <span> {carsList.length}</span>
          </h3>
        </div>
        <div className="garage__pagination">
          <button className="btn btn__pagination" onClick={handleClickPaginationPrev}>
            Prev
          </button>
          <span>{currentPage + 1}</span>
          <button className="btn btn__pagination" onClick={handleClickPaginationNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Garage
