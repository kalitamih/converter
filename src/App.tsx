import React, { FC, Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import styled, { createGlobalStyle } from 'styled-components'
import { actionCurrency } from './actions/enum'
import getExchangeRate from './actions/getExchangeRate'
import setBYN from './actions/setBYN'
import setUSD from './actions/setUSD'
import arrow from './arrow.png'
import currency from './currency.jpg'
import { AppState } from './reducers'
import { Currency } from './reducers/interfaces'

interface AppType {
  USD_in: string
  USD_out: string
  loading: boolean
  time: string
  error: string
  exchangeRate: () => (dispatch: ThunkDispatch<{}, {}, any>) => void
  mainCurrency: Currency
  setMainBYN: () => { type: actionCurrency }
  setMainUSD: () => { type: actionCurrency }
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
const Arrow = styled.button`
  background-color: transparent;
  border: solid 0px transparent;
  border-radius: 50%;
  padding: 1px;
  display: block;
  margin-top: 70px;
  width: 35px;
  height: 35px;
  cursor: default;
  outline: none;
  &::-moz-focus-inner {
    border: 0;
  }
  &:focus {
    box-shadow: 0 0 3pt 2px #808080;
  }
  &:active {
    transform: scale(1.1, 1.1);
  }
  @media (max-width: 240px) {
    position: absolute;
    left: 45%;
  }
`
const Button = styled.div`
  background-color: #4caf50;
  border: solid 2px #4caf50;
  border-radius: 10px;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  width: 22px;
  margin-right: 10px;
  padding: 5px 8px;
  display: block;
  cursor: default;
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

const App: FC<AppType> = ({
  USD_in,
  USD_out,
  loading,
  error,
  time,
  exchangeRate,
  mainCurrency,
  setMainBYN,
  setMainUSD,
}) => {
  const [sellInput, setSellInput] = useState('')
  const [buyInput, setBuyInput] = useState('')

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
    const { value, name } = event.target
    getNewExchangeRate()
    if (!value.length || !USD_in || !USD_out) {
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
      if (/^0\d$/.test(value)) {
        setSellInput(value[1])
        result =
          mainCurrency === Currency.USD
            ? parseFloat(USD_in) * parseFloat(value[1])
            : parseFloat(value[1]) / parseFloat(USD_out)
        setBuyInput((Math.round(result * 10000) / 10000).toString())
        return
      }
      setSellInput(value)
      result =
        mainCurrency === Currency.USD
          ? parseFloat(USD_in) * parseFloat(value)
          : parseFloat(value) / parseFloat(USD_out)
      setBuyInput((Math.round(result * 10000) / 10000).toString())
      return
    }
    if (name === Field.BUY) {
      if (/^0\d$/.test(value)) {
        setBuyInput(value[1])
        result =
          mainCurrency === Currency.BYN
            ? parseFloat(value[1]) * parseFloat(USD_out)
            : parseFloat(value[1]) / parseFloat(USD_in)
        setSellInput((Math.round(result * 10000) / 10000).toString())
        return
      }
      setBuyInput(value)
      result =
        mainCurrency === Currency.BYN
          ? parseFloat(value) * parseFloat(USD_out)
          : parseFloat(value) / parseFloat(USD_in)
      setSellInput((Math.round(result * 10000) / 10000).toString())
      return
    }
  }

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    let result
    getNewExchangeRate()
    if (mainCurrency === Currency.USD) {
      setMainBYN()
      if (!sellInput) {
        return
      }
      result = parseFloat(sellInput) / parseFloat(USD_out)
      setBuyInput((Math.round(result * 10000) / 10000).toString())
      return
    }
    setMainUSD()
    if (!sellInput) {
      return
    }
    result = parseFloat(USD_in) * parseFloat(sellInput)
    setBuyInput((Math.round(result * 10000) / 10000).toString())
    return
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
        <Button>{mainCurrency}</Button>
        <Arrow onClick={handleClick}>
          <Img src={arrow} />
        </Arrow>
        <Input
          name={Field.BUY}
          value={buyInput}
          placeholder={Placeholder.BUY}
          onChange={handleChange}
          disabled={loading || error.length !== 0}
        />
        <Button>
          {mainCurrency === Currency.USD ? Currency.BYN : Currency.USD}
        </Button>
      </WrapperDown>
      {error.length !== 0 && USD_out.length !== 0 && USD_in.length !== 0 && (
        <Warning>Данные устарели</Warning>
      )}
      {error.length !== 0 && (USD_out.length === 0 || USD_in.length === 0) && (
        <Warning>Конвертер временно не работает</Warning>
      )}
    </Fragment>
  )
}

const mapStateToProps = (state: AppState) => ({
  USD_in: state.rate.USD_in,
  USD_out: state.rate.USD_out,
  error: state.rate.error,
  loading: state.rate.loading,
  mainCurrency: state.currency.mainCurrency,
  time: state.rate.time,
})

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => ({
  exchangeRate: () => dispatch(getExchangeRate()),
  setMainBYN: () => dispatch(setBYN()),
  setMainUSD: () => dispatch(setUSD()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
