import { actionTypeRate } from '../actions/enum'

interface ActionRate {
  type: actionTypeRate
  BYN_EUR: string
  BYN_RUB: string
  BYN_USD: string
  EUR_BYN: string
  EUR_RUB: string
  EUR_USD: string
  RUB_BYN: string
  RUB_EUR: string
  RUB_USD: string
  USD_BYN: string
  USD_EUR: string
  USD_RUB: string
  time: string
  error: string
}

const initialState = {
  BYN_EUR: '',
  BYN_RUB: '',
  BYN_USD: '',
  EUR_BYN: '',
  EUR_RUB: '',
  EUR_USD: '',
  RUB_BYN: '',
  RUB_EUR: '',
  RUB_USD: '',
  USD_BYN: '',
  USD_EUR: '',
  USD_RUB: '',
  error: '',
  loading: true,
  time: '',
}

export const rateReducer = (state = initialState, action: ActionRate) => {
  switch (action.type) {
    case actionTypeRate.LOADING:
      return {
        ...state,
        error: '',
        loading: true,
      }

    case actionTypeRate.SUCCESS:
      return {
        ...state,
        BYN_EUR: action.BYN_EUR,
        BYN_RUB: action.BYN_RUB,
        BYN_USD: action.BYN_USD,
        EUR_BYN: action.EUR_BYN,
        EUR_RUB: action.EUR_RUB,
        EUR_USD: action.EUR_USD,
        RUB_BYN: action.RUB_BYN,
        RUB_EUR: action.RUB_EUR,
        RUB_USD: action.RUB_USD,
        USD_BYN: action.USD_BYN,
        USD_EUR: action.USD_EUR,
        USD_RUB: action.USD_RUB,
        loading: false,
        time: action.time,
      }

    case actionTypeRate.ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      }

    default:
      return state
  }
}
