import { combineReducers } from 'redux'
import { currencyReducer } from './currency'
import { rateReducer } from './rate'

export const rootReducer = combineReducers({
  currency: currencyReducer,
  rate: rateReducer,
})

export type AppState = ReturnType<typeof rootReducer>
