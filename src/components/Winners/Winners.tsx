import React from 'react'
import WinnersItem from '../WinnersItem/WinnersItem'
import { WinnerModel } from '../../models/Models'
import { config } from '../../config/config'
import './Winners.scss'

const { carsPerPageInWinners } = config

interface WinnersProps {
  winnersList: WinnerModel[]
  currentPage: number
  clickPrev: () => void
  clickNext: () => void
}

const Winners: React.FC<WinnersProps> = ({ winnersList, currentPage, clickPrev, clickNext }) => {
  const handleClickPaginationPrev = () => {
    clickPrev()
  }

  const handleClickPaginationNext = () => {
    clickNext()
  }

  let winnersOnCurrentPage: WinnerModel[] = []

  if (winnersList) {
    winnersOnCurrentPage = winnersList?.slice(
      currentPage * carsPerPageInWinners,
      currentPage * carsPerPageInWinners + carsPerPageInWinners
    )
  }

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
        {winnersOnCurrentPage.map(winnerItem => {
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

      <div className="winners__bottom">
        <div className="winners__total-cars">
          <h3>
            Total Cars:
            <span> {winnersList.length}</span>
          </h3>
        </div>
        <div className="winners__pagination">
          <button
            className="btn btn__pagination"
            onClick={handleClickPaginationPrev}
            disabled={currentPage === 0}
          >
            Prev
          </button>
          <span>{currentPage + 1}</span>
          <button
            className="btn btn__pagination"
            onClick={handleClickPaginationNext}
            disabled={winnersList.length <= carsPerPageInWinners * (currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Winners
