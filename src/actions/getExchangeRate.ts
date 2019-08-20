import { ThunkDispatch } from 'redux-thunk'
import { actionTypeRate } from './enum'

const getExchangeRate = () => (dispatch: ThunkDispatch<{}, {}, any>) => {
  dispatch({ type: actionTypeRate.LOADING })

  fetch(
    'https://cors-anywhere.herokuapp.com/https://belarusbank.by/api/kursExchange'
  )
    .then(data => data.json())
    .then(data => data[0])
    .then(data => {
      const { USD_in, USD_out } = data
      dispatch({
        USD_in,
        USD_out,
        time: new Date().getTime(),
        type: actionTypeRate.SUCCESS,
      })
    })
    .catch(error => {
      dispatch({
        error,
        type: actionTypeRate.ERROR,
      })
    })
}

export default getExchangeRate
