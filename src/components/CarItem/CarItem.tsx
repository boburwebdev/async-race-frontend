import React from 'react';
import CarImage from '../CarImage/CarImage';
import './CarItem.scss';

interface CarItemProps {
  id: number;
  color: string;
  name: string;
  raceDuration: number;
  isAnimated: boolean;
  isRaceFinished: boolean;
  editCar: (id: number) => void;
  deleteCar: (id: number) => void;
  startEngine: (id: number) => void;
  stopEngine: (id: number) => void;
}

const CarItem: React.FC<CarItemProps> = ({
  id,
  color,
  name,
  raceDuration,
  isAnimated,
  isRaceFinished,
  editCar,
  deleteCar,
  startEngine,
  stopEngine,
}) => {
  const handleClickStartEngine = () => {
    startEngine(id);
  };

  const handleClickStopEngine = () => {
    stopEngine(id);
  };

  const handleClickEditCar = () => {
    editCar(id);
  };

  const handleClickRemoveCar = () => {
    deleteCar(id);
  };

  const duration = `${(raceDuration / 1000).toString()}s`;
  let carImageClass = 'car__image';
  if (isAnimated) {
    carImageClass += ' animate-left-to-right';
  }

  if (isRaceFinished) {
    carImageClass += ' finished-race';
  }

  return (
    <div className="car">
      <div className="car__controls">
        <button className="btn btn__small btn__green" type="button" onClick={handleClickEditCar}>
          Select
        </button>
        <button className="btn btn__small btn__red" type="button" onClick={handleClickRemoveCar}>
          Remove
        </button>
      </div>

      <div className="car__engine">
        <button
          className="btn btn__small btn__green"
          type="button"
          onClick={handleClickStartEngine}
          disabled={isAnimated}
        >
          Start
        </button>
        <button
          className="btn btn__small btn__red"
          type="button"
          onClick={handleClickStopEngine}
          disabled={!isRaceFinished}
        >
          Stop
        </button>
      </div>

      <div className="car__image-box">
        <div className={carImageClass} style={{ animationDuration: duration }}>
          <CarImage color={color} />
        </div>
      </div>

      <div className="car__name">{name}</div>
    </div>
  );
};

export default CarItem;
