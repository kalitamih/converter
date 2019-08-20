import { actionTypeRate } from '../actions/enum'

const initialState = {
  USD_in: '',
  USD_out: '',
  error: '',
  loading: true,
  time: '',
}

interface ActionRate {
  type: actionTypeRate
  USD_in: string
  USD_out: string
  time: string
  error: string
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
        USD_in: action.USD_in,
        USD_out: action.USD_out,
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
