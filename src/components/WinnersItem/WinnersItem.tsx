import React from 'react'
import CarImage from '../CarImage/CarImage'
import './WinnersItem.scss'

interface WinnersItemProps {
  id: string
  carColor: string
  modelName: string
  wins: string
  bestTime: string
}

const WinnersItem: React.FC<WinnersItemProps> = ({ id, carColor, modelName, wins, bestTime }) => {
  return (
    <div className="winners__item">
      <div className="winners__item-column winners__item-number">{id}</div>
      <div className="winners__item-column winners__item-image">
        <CarImage color={carColor} />
      </div>
      <div className="winners__item-column winners__item-name">{modelName}</div>
      <div className="winners__item-column winners__item-wins">{wins}</div>
      <div className="winners__item-column winners__item-time">{bestTime}</div>
    </div>
  )
}

export default WinnersItem
