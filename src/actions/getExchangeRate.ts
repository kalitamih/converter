import { ThunkDispatch } from 'redux-thunk'
import { actionTypeRate } from './enum'

const LINK_HEROKU_PROXY = 'https://cors-anywhere.herokuapp.com/'
const LINK_BANK = 'https://belarusbank.by/api/kursExchange'

const getExchangeRate = () => (dispatch: ThunkDispatch<{}, {}, any>) => {
  dispatch({ type: actionTypeRate.LOADING })
  fetch(`${LINK_HEROKU_PROXY}${LINK_BANK}`)
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
