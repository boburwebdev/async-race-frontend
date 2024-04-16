import { useState, useEffect } from 'react';
import Garage from './components/Garage/Garage';

import { CarModel, WinnerModel } from './models/Models';
import modifyWinnerData from './utils/WinnerUtils';
import { generateRandomCarName, generateRandomHexColor } from './utils/RandomUtils';
import {
  calculateRaceDuration,
  getRaceWinner,
  storeRaceWinnerResults,
  convertRaceTimeToSeconds,
} from './utils/RaceUtils';
import {
  getCars,
  getWinners,
  submitNewCar,
  deleteCar,
  updateCar,
  startCarEngine,
  stopCarEngine,
  setEngineToDriveMode,
  deleteWinner,
} from './utils/APIUtils';
import config from './config/config';
import './App.scss';
import { getCarsOnCurrentPage } from './utils/CarUtils';
import Winners from './components/Winners/Winners';
import Modal from './components/Modal/Modal';

const { numberOfGeneratedCars, carsPerPageInGarage, carsPerPageInWinners } = config;

const App = () => {
  const [showGarage, setShowGarage] = useState<boolean>(true);
  const [carsList, setCarsList] = useState<CarModel[]>([]);
  const [carName, setCarName] = useState<string>('');
  const [carNameUpdate, setCarNameUpdate] = useState<string>('');
  const [carColor, setCarColor] = useState<string>('#000000');
  const [carColorUpdate, setCarColorUpdate] = useState<string>('#000000');
  const [selectedCarId, setSelectedCarId] = useState<number>(0);
  const [currentGaragePage, setCurrentGaragePage] = useState<number>(0);
  const [currentWinnersPage, setCurrentWinnersPage] = useState<number>(0);
  const [winnersList, setWinnersList] = useState<WinnerModel[]>([]);
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
  const [winner, setWinner] = useState<CarModel | undefined>();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsData = await getCars();
        if (carsData) {
          setCarsList(carsData);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchWinners = async () => {
      try {
        const carsData = await getCars();
        const winnersData = await getWinners();

        if (winnersData && carsData) {
          const modifiedWinnersData = modifyWinnerData(carsData, winnersData);
          setWinnersList(modifiedWinnersData);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCars();
    fetchWinners();
  }, []);

  function handleClickGarage() {
    setShowGarage(true);
  }

  function handleClickWinners() {
    setShowGarage(false);
  }

  const filterCarsThatMadeIt = async (carsThatMadeIt: CarModel[]) => {
    const carsOnCurrentPage = getCarsOnCurrentPage(
      carsList,
      currentGaragePage,
      carsPerPageInGarage,
    );
    return Promise.all(
      carsOnCurrentPage.map(async (car) => {
        let duration: number;
        setCarsList((prevList) => prevList.map((item) => {
          if (item.id === car.id) {
            return { ...item, isAnimated: true };
          }
          return item;
        }));
        try {
          const engineStartData = await startCarEngine(car.id);
          if (engineStartData) {
            duration = calculateRaceDuration(engineStartData);
            setCarsList((prevList) => prevList.map((item) => (item.id === car.id
              ? { ...item, raceDuration: duration, isRaceFinished: true }
              : item)));
            try {
              const driveModeData = await setEngineToDriveMode(car.id);
              if (driveModeData.success) {
                carsThatMadeIt.push({ ...car, raceDuration: duration });
                setCarsList((prevList) => prevList.map((item) => (item.id === car.id
                  ? { ...item, isRaceFinished: true, isAnimated: false }
                  : item)));
                return { ...car, raceDuration: duration };
              }
            } catch (err) {
              setCarsList((prevList) => prevList.map((item) => (item.id === car.id
                ? {
                  ...item,
                  raceDuration: 0,
                  isRaceFinished: false,
                  isAnimated: false,
                }
                : item)));
            }
          }
          return null;
        } catch (err) {
          return null;
        }
      }),
    );
  };

  const handleChangeCarName = (newCarName: string) => {
    setCarName(newCarName);
  };
  const handleChangeCarNameUpdate = (newCarName: string) => {
    setCarNameUpdate(newCarName);
  };
  const handleChangeCarColor = (newCarColor: string) => {
    setCarColor(newCarColor);
  };
  const handleChangeCarColorUpdate = (newCarColor: string) => {
    setCarColorUpdate(newCarColor);
  };

  const handleClickAddNewCar = async (newCarName: string, newCarColor: string) => {
    try {
      const carData = await submitNewCar(newCarName, newCarColor);
      if (carData) {
        setCarsList((prevList) => [
          ...prevList,
          {
            ...carData,
            isAnimated: false,
            isFinished: false,
            raceDuration: 0,
          },
        ]);

        setCarName('');
        setCarColor('#000000');
      }
    } catch (err) {
      console.error("Couldn't add new car: ", err);
    }
  };

  const handleClickDeleteCar = async (carId: number) => {
    try {
      const responseOne = await deleteCar(carId);
      const responseTwo = await deleteWinner(carId);
      if (responseOne?.ok) {
        setCarsList((prevList) => prevList.filter((item) => item.id !== carId));
      }

      if (responseTwo?.ok) {
        setWinnersList((prevList) => prevList.filter((item) => item.id !== carId));
      }
    } catch (err) {
      console.error("Couldn't delete the car: ", err);
    }
  };

  const handleClickUpdateCar = async (
    carId: number,
    updatedCarName: string,
    updatedCarColor: string,
  ) => {
    try {
      const carData = await updateCar(carId, updatedCarName, updatedCarColor);
      if (carData) {
        setCarsList((prevList) => prevList.map((car) => (car.id === carId ? { ...carData } : car)));
        setCarNameUpdate('');
        setCarColorUpdate('#000000');
        setSelectedCarId(0);
      }
    } catch (err) {
      console.error("Couldn't update the car: ", err);
    }
  };

  const handleClickEditCar = (id: number) => {
    setSelectedCarId(id);
  };

  const handleClickStartEngine = async (carId: number) => {
    setCarsList((prevList) => prevList.map((item) => {
      if (item.id === carId) {
        return { ...item, isAnimated: true };
      }
      return item;
    }));

    try {
      const carEngine = await startCarEngine(carId);

      if (carEngine) {
        const duration = carEngine.velocity ? carEngine.distance / carEngine.velocity : 0;
        setCarsList((prevList) => prevList.map((item) => {
          if (item.id === carId) {
            return { ...item, raceDuration: duration, isRaceFinished: true };
          }
          return item;
        }));
      }
    } catch (err) {
      console.error("Couldn't start the engine: ", err);
    }

    try {
      await setEngineToDriveMode(carId);
    } catch (err) {
      setCarsList((prevList) => prevList.map((item) => (item.id === carId
        ? {
          ...item,
          raceDuration: 0,
          isRaceFinished: false,
          isAnimated: false,
        }
        : item)));

      console.error('Error with the drive mode: ', err);
    }
  };

  const handleClickRace = async () => {
    const carsThatMadeIt: CarModel[] = [];

    try {
      const filteredCars: (CarModel | null)[] = await filterCarsThatMadeIt(carsThatMadeIt);
      const results: (CarModel | null)[] = filteredCars?.filter((item) => Boolean(item));
      const winnerCar: CarModel | undefined = getRaceWinner(results);

      if (winnerCar) {
        setWinner(winnerCar);
        setShowWinnerModal(true);
        await storeRaceWinnerResults(winnersList, winnerCar);
        const winnersData = await getWinners();
        if (winnersData) {
          const modifiedWinnersData = modifyWinnerData(carsList, winnersData);
          setWinnersList(modifiedWinnersData);
        }
      }
    } catch (err) {
      console.error('error with filteredCars: ', err);
    }
  };

  const handleClickReset = async () => {
    if (carsList) {
      const carsOnCurrentPage = getCarsOnCurrentPage(
        carsList,
        currentGaragePage,
        carsPerPageInGarage,
      );

      carsOnCurrentPage.forEach(async (car) => {
        try {
          const carEngineData = await stopCarEngine(car.id);
          if (carEngineData) {
            setCarsList((prevList) => prevList.map((item) => (item.id === car.id
              ? {
                ...item,
                isAnimated: false,
                isRaceFinished: false,
                raceDuration: 0,
              }
              : item)));
          }
        } catch (err) {
          console.error("Couldn't stop the engine: ", err);
        }
      });
    }
  };

  const handleClickStopEngine = async (carId: number) => {
    try {
      const engineData = await stopCarEngine(carId);
      if (engineData) {
        setCarsList((prevList) => prevList.map((item) => (item.id === carId
          ? {
            ...item,
            isAnimated: false,
            isRaceFinished: false,
            raceDuration: 0,
          }
          : item)));
      }
    } catch (err) {
      console.error("Couldn't stop the engine: ", err);
    }
  };

  const handleClickGenerateCars = async () => {
    const carPromises = [];
    for (let i = 0; i < numberOfGeneratedCars; i += 1) {
      const randomCarName = generateRandomCarName();
      const randomCarColor = generateRandomHexColor();
      carPromises.push(submitNewCar(randomCarName, randomCarColor));
    }

    try {
      const newCarData = await Promise.all(carPromises);
      setCarsList((prevList) => {
        const newList = [...prevList];
        for (let i = 0; i < newCarData.length; i += 1) {
          if (newCarData[i] !== null) {
            newList.push(newCarData[i]);
          }
        }
        return newList;
      });
    } catch (err) {
      console.error('Error creating cars:', err);
    }
  };

  const handleClickGaragePrev = () => {
    if (currentGaragePage > 0) {
      setCurrentGaragePage((prevVal) => prevVal - 1);
    }
  };

  const handleClickGarageNext = () => {
    const result = carsList.length > carsPerPageInGarage * (currentGaragePage + 1);
    if (result) {
      setCurrentGaragePage((prevVal) => prevVal + 1);
    }
  };

  const handleClickSortWinners = (sortOption: string) => {
    if (sortOption === 'winsAsc') {
      const sortedWinners = [...winnersList].sort(
        (a: WinnerModel, b: WinnerModel) => a.wins - b.wins,
      );
      setWinnersList(sortedWinners);
    } else if (sortOption === 'winsDesc') {
      const sortedWinners = [...winnersList].sort(
        (a: WinnerModel, b: WinnerModel) => b.wins - a.wins,
      );
      setWinnersList(sortedWinners);
    } else if (sortOption === 'timeAsc') {
      const sortedWinners = [...winnersList].sort(
        (a: WinnerModel, b: WinnerModel) => Number(a.time) - Number(b.time),
      );
      setWinnersList(sortedWinners);
    } else if (sortOption === 'timeDesc') {
      const sortedWinners = [...winnersList].sort(
        (a: WinnerModel, b: WinnerModel) => Number(b.time) - Number(a.time),
      );
      setWinnersList(sortedWinners);
    }
  };

  const handleClickWinnersPrev = () => {
    if (currentWinnersPage > 0) {
      setCurrentWinnersPage((prevVal) => prevVal - 1);
    }
  };

  const handleClickWinnersNext = () => {
    const result = winnersList.length > carsPerPageInWinners * (currentWinnersPage + 1);
    if (result) {
      setCurrentWinnersPage((prevVal) => prevVal + 1);
    }
  };

  const handleClickCloseModal = () => {
    setShowWinnerModal(false);
  };

  return (
    <div className="async-race">
      <Modal isOpen={showWinnerModal} closeModal={handleClickCloseModal}>
        <h3 className="modal__title">Winner</h3>
        <div className="modal__winner-name">
          Model:
          {' '}
          <span>{winner?.name}</span>
        </div>
        <div className="modal__winner-time">
          Time:
          <span>
            {convertRaceTimeToSeconds(winner?.raceDuration)}
            sec
          </span>
        </div>
      </Modal>
      <div className="top">
        <div className="container">
          <div className="top__inner">
            <nav className="top__menu">
              <ul className="top__menu-list">
                <li
                  className={showGarage ? 'top__menu-item active' : 'top__menu-item'}
                  role="presentation"
                  onClick={handleClickGarage}
                >
                  Garage
                </li>
                <li
                  className={!showGarage ? 'top__menu-item active' : 'top__menu-item'}
                  role="presentation"
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
              sortWinners={handleClickSortWinners}
              clickPrev={handleClickWinnersPrev}
              clickNext={handleClickWinnersNext}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
