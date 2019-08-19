import { actionCurrency } from './enum'

export default function setUSD() {
  return {
    type: actionCurrency.USD,
  }
}
