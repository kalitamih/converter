import { actionCurrency } from '../actions/enum'
import { Currency, CurrencyState } from './interfaces'

interface Action {
  type: actionCurrency
}

const initialState: CurrencyState = {
  mainCurrency: Currency.USD,
}

export const currencyReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionCurrency.USD:
      return { ...state, mainCurrency: Currency.USD }

    case actionCurrency.BYN:
      return { ...state, mainCurrency: Currency.BYN }

    default:
      return state
  }
}
