import React, { FC, Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { ThunkDispatch } from 'redux-thunk'
import styled, { createGlobalStyle } from 'styled-components'
import getExchangeRate from './actions/getExchangeRate'
import currency from './currency.jpg'
import { AppState } from './reducers'
import { Currency } from './reducers/interfaces'

interface AppType {
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
  loading: boolean
  time: string
  error: string
  exchangeRate: () => (dispatch: ThunkDispatch<{}, {}, any>) => void
  mainCurrency: Currency
}

enum Placeholder {
  BUY = 'Покупка у банка',
  SELL = 'Продажа банку',
}

enum Field {
  BUY = 'buy',
  SELL = 'sell',
}

const MS_IN_3_HOURS = 3 * 60 * 60 * 100

const options = [
  { value: 'USD', label: 'USD' },
  { value: 'BYN', label: 'BYN' },
  { value: 'RUB', label: 'RUB' },
  { value: 'EUR', label: 'EUR' },
]

const GlobalStyle = createGlobalStyle`
  html {
    height:100%;
  }
  body {    
    display: flex; 
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  #root {
    border: 2px solid black;
    width: 270px;
    height: 270px;
    padding: 15px;
  }
`
const Input = styled.input`
  margin: 10px;
  padding-right: 10px;
  width: 140px;
  height: 30px;
  font-size: 12px;
  border: 2px solid #cccccc;
  border-radius: 10px;
  background-color: #ffffff;
  text-align: right;
  outline: none;
  &::-moz-focus-inner {
    border: 0;
  }
  &:hover,
  &:focus {
    border: 2px solid #808080;
  }
  @media (max-width: 240px) {
    width: 100px;
    height: 25px;
    font-size: 10px;
  }
`
const Img = styled.img`
  display: block;
  width: 34px;
  height: 34px;
  pointer-events: none;
`
const Title = styled.h4`
  display: inline-block;
  margin: 10px;
`
const WrapperUP = styled.div`
  display: flex;
  align-items: center;
`
const WrapperDown = styled.div`
  display: flex;
  margin-top: 20px;
  flex-wrap: wrap;
  align-items: center;
  &:nth-child(3) {
    flex-basis: 100%;
  }
`
const Warning = styled.h3`
  color: #ff0000;
  text-align: center;
`

const Sel = styled(Select)`
  height: 30px;
  width: 70px;
  margin-bottom: 10px;
  text-align: center;
  & > div {
    & > div {
      &:last-child {
        & > div {
          padding: 2px;
          svg {
            color: #808080;
            width: 15px;
          }
        }
      }
    }
  }
`

interface SelectedOption {
  value: string
  label: string
}

const App: FC<AppType> = state => {
  const { exchangeRate, error, loading, time } = state
  const [sellInput, setSellInput] = useState('')
  const [buyInput, setBuyInput] = useState('')
  const [selectedOptionSell, setSelectedOptionSell] = useState(options[0])
  const [selectedOptionBuy, setSelectedOptionBuy] = useState(options[1])

  useEffect(() => {
    exchangeRate()
  }, [exchangeRate])

  const getNewExchangeRate = () => {
    if (new Date().getTime() - parseFloat(time) > MS_IN_3_HOURS) {
      exchangeRate()
    }
    return
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let result
    const key = `${selectedOptionSell.value}_${selectedOptionBuy.value}` as keyof AppType
    const { value, name } = event.target
    getNewExchangeRate()
    if (!value.length || error) {
      setSellInput('')
      setBuyInput('')
      return
    }
    if (!/^\d+[.]?\d{0,4}$|^$/g.test(value)) {
      return
    }
    if (value.length > 16) {
      return
    }
    if (name === Field.SELL) {
      if (selectedOptionSell.label === selectedOptionBuy.label) {
        setBuyInput(sellInput)
        return
      }
      if (/^0\d$/.test(value)) {
        setSellInput(value[1])
        result = parseFloat(state[key] as any) * parseFloat(value[1])
        setBuyInput((Math.round(result * 10000) / 10000).toString())
        return
      }
      setSellInput(value)
      result = parseFloat(state[key] as any) * parseFloat(value)
      setBuyInput((Math.round(result * 10000) / 10000).toString())
      return
    }
    if (name === Field.BUY) {
      if (selectedOptionSell.label === selectedOptionBuy.label) {
        setSellInput(buyInput)
        return
      }
      if (/^0\d$/.test(value)) {
        setBuyInput(value[1])
        result = parseFloat(state[key] as any) * parseFloat(value)
        setSellInput((Math.round(result * 10000) / 10000).toString())
        return
      }
      setBuyInput(value)
      result = parseFloat(state[key] as any) * parseFloat(value)
      setSellInput((Math.round(result * 10000) / 10000).toString())
      return
    }
  }

  const handleSelectedOptionSell = (value: SelectedOption) => {
    setSelectedOptionSell(value)
  }

  const handleSelectedOptionBuy = (value: SelectedOption) => {
    setSelectedOptionBuy(value)
  }

  return (
    <Fragment>
      <GlobalStyle />
      <WrapperUP>
        <Img src={currency} />
        <Title>Конвертер валют</Title>
      </WrapperUP>
      <WrapperDown>
        <Input
          name={Field.SELL}
          placeholder={Placeholder.SELL}
          value={sellInput}
          onChange={handleChange}
          disabled={loading || error.length !== 0}
        />
        <Sel
          options={options}
          value={selectedOptionSell}
          onChange={handleSelectedOptionSell as any}
        />
        <Input
          name={Field.BUY}
          value={buyInput}
          placeholder={Placeholder.BUY}
          onChange={handleChange}
          disabled={loading || error.length !== 0}
        />
        <Sel
          options={options}
          value={selectedOptionBuy}
          onChange={handleSelectedOptionBuy as any}
        />
      </WrapperDown>
      {error.length !== 0 && <Warning>Данные устарели</Warning>}
      {error.length !== 0 && <Warning>Конвертер временно не работает</Warning>}
    </Fragment>
  )
}

const mapStateToProps = (state: AppState) => ({
  BYN_EUR: state.rate.BYN_EUR,
  BYN_RUB: state.rate.BYN_RUB,
  BYN_USD: state.rate.BYN_USD,
  EUR_BYN: state.rate.EUR_BYN,
  EUR_RUB: state.rate.EUR_RUB,
  EUR_USD: state.rate.EUR_USD,
  RUB_BYN: state.rate.RUB_BYN,
  RUB_EUR: state.rate.RUB_EUR,
  RUB_USD: state.rate.RUB_USD,
  USD_BYN: state.rate.USD_BYN,
  USD_EUR: state.rate.USD_EUR,
  USD_RUB: state.rate.USD_RUB,
  error: state.rate.error,
  loading: state.rate.loading,
  mainCurrency: state.currency.mainCurrency,
  time: state.rate.time,
})

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => ({
  exchangeRate: () => dispatch(getExchangeRate()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
