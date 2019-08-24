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
      const {
        USD_in,
        USD_out,
        EUR_in,
        EUR_out,
        RUB_EUR_in,
        RUB_EUR_out,
        RUB_in,
        RUB_out,
        USD_EUR_in,
        USD_EUR_out,
        USD_RUB_in,
        USD_RUB_out,
      } = data
      dispatch({
        BYN_EUR: EUR_out,
        BYN_RUB: RUB_out,
        BYN_USD: USD_out,
        EUR_BYN: EUR_in,
        EUR_RUB: RUB_EUR_out,
        EUR_USD: USD_EUR_out,
        RUB_BYN: RUB_in,
        RUB_EUR: RUB_EUR_in,
        RUB_USD: USD_RUB_out,
        USD_BYN: USD_in,
        USD_EUR: USD_EUR_in,
        USD_RUB: USD_RUB_in,
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
