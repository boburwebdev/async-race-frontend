import { config } from '../config/config'
import { modifyCarData } from './CarUtils'
const { baseUrl } = config

export async function getCars(): Promise<any> {
  try {
    const response = await fetch(baseUrl + '/garage')

    if (response.ok) {
      const carsData = await response.json()
      const modifiedCarsData = await modifyCarData(carsData)
      return modifiedCarsData
    }

    return null
  } catch (err) {
    // console.error("couldn't fetch cars: ", err);
    return err
  }
}

export async function getWinners(): Promise<any> {
  try {
    const response = await fetch(baseUrl + '/winners')

    if (response.ok) {
      const winnersData = await response.json()
      return winnersData
    }
  } catch (err) {
    // console.error("couldn't fetch winners: ", err);
    return err
  }
}

export async function submitNewCar(carName: string, carColor: string): Promise<any> {
  try {
    const response = await fetch(baseUrl + '/garage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: carName,
        color: carColor,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return data
    }

    // throw new Error(`API response error: ${response.status}`);
  } catch (error) {
    // console.error('Error submitting new car:', error);
    throw error
  }
}

export async function updateCar(carId: number, carName: string, carColor: string): Promise<any> {
  try {
    const response = await fetch(baseUrl + '/garage/' + carId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: carName,
        color: carColor,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return data
    }

    // throw new Error(`API response error: ${response.status}`);
  } catch (err) {
    // console.error("Something went wrong, couldn't  with the update :(. Error: " + err);
    throw err
  }
}

export async function deleteCar(id: number) {
  try {
    const response = await fetch(baseUrl + '/garage/' + id, {
      method: 'Delete',
    })

    if (response.ok) {
      return response
    }

    // throw new Error(`API response error: ${response.status}`);
  } catch (err) {
    // console.error("Something went wrong, couldn't delete the car. Error: ", err);
    throw err
  }
}

export async function startCarEngine(id: number) {
  try {
    const response = await fetch(baseUrl + '/engine' + `?id=${id}&status=${'started'}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'started',
      }),
    })

    if (response.ok) {
      const data = response.json()
      return data
    }

    // throw new Error(`API response error: ${response.status}`);
  } catch (err) {
    // console.error("Something went wrong, couldn't start the engine. Error: " + err);
    throw err
  }
}

export async function stopCarEngine(id: number) {
  try {
    const response = await fetch(baseUrl + '/engine' + `?id=${id}&status=${'stopped'}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'stopped',
      }),
    })

    if (response.ok) {
      const data = response.json()
      return data
    }

    // throw new Error(`API response error: ${response.status}`);
  } catch (err) {
    // console.error("Something went wrong, couldn't stop the engine. Error: " + err);
    throw err
  }
}

export async function setEngineToDriveMode(id: number) {
  try {
    const response = await fetch(baseUrl + '/engine' + `?id=${id}&status=${'drive'}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'drive',
      }),
    })

    if (response.ok) {
      const data = response.json()
      return data
    }

    // throw new Error(`API response error: ${response.status}`);
  } catch (err) {
    // console.error("Something went wrong, couldn't set the engine to drive mode. Error: " + err);
    throw err
  }
}
