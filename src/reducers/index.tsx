import { combineReducers, Reducer } from 'redux'
import { currencyReducer } from './currency'

const rootReducer = combineReducers({
  currency: currencyReducer,
})

export default rootReducer
