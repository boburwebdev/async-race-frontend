import React from 'react'
import { WinnerModel } from '../../models/Models'
import WinnersItem from '../WinnersItem/WinnersItem'
import './Winners.scss'

interface WinnersProps {
  winnersList: WinnerModel[]
}

const Winners: React.FC<WinnersProps> = ({ winnersList }) => {
  return (
    <div className="winners">
      <h3 className="section__title winners__title">Winners</h3>

      <div className="winners__headings">
        <div className="winners__headings-column winners__headings-number">Number</div>
        <div className="winners__headings-column winners__headings-image">Car</div>
        <div className="winners__headings-column winners__headings-name">Model Name</div>
        <div className="winners__headings-column winners__headings-wins">Wins</div>
        <div className="winners__headings-column winners__headings-time">Best time (seconds)</div>
      </div>

      <div className="winners__content">
        {winnersList.map(winnerItem => {
          return (
            <WinnersItem
              key={winnerItem.id}
              id={String(winnerItem.id)}
              carColor={winnerItem.color}
              modelName={winnerItem.modelName}
              wins={String(winnerItem.wins)}
              bestTime={String(winnerItem.time)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Winners
