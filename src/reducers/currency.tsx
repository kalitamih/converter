import { actionCurrency } from '../actions/enum'

export enum Currency {
  BYN = 'BYN',
  USD = 'USD',
}

interface Action {
  type: actionCurrency
}

const initialState = {
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
