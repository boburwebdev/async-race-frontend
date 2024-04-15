import { useState } from 'react'
import './App.scss'

function App() {
  const [showGarage, setShowGarage] = useState<boolean>(true)

  function handleClickGarage() {
    setShowGarage(true)
  }

  function handleClickWinners() {
    setShowGarage(false)
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
        <div className="container">{showGarage ? <h3>Garage</h3> : <h3>Winners</h3>}</div>
      </div>
    </>
  )
}

export default App
