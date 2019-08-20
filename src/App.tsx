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

interface ImgProps {
  content: string
}

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

const MS_IN_HOUR = 60 * 60 * 100

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
    width: 400px;
    height: 400px;
    padding: 20px;
  }
`
const Arrow = styled.button`
  background-color: transparent;
  border: solid 0px transparent;
  border-radius: 50%;
  padding: 1px;
  display: block;
  margin-top: 70px;
  width: 50px;
  height: 50px;
  cursor: default;
  outline: none;
  outline-offset: 0px;
  &:focus {
    box-shadow: 0 0 3pt 2px #4d90fe;
  }
  &:active {
    transform: scale(1.1, 1.1);
  }
`
const Button = styled.div`
  background-color: #4caf50;
  border: solid 2px #4caf50;
  border-radius: 10px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  margin-right: 20px;
  padding: 5px 16px;
  display: inline-block;
  cursor: default;
`
const Input = styled.input`
  margin: 10px;
  padding-right: 10px;
  width: 200px;
  height: 35px;
  font-size: 14px;
  border: 2px solid #cccccc;
  border-radius: 10px;
  background-color: #ffffff;
  text-align: right;
  &:hover,
  &:focus {
    border: 2px solid #808080;
  }
`
const Img = styled.img`  
  content: url(${(p: ImgProps) => p.content}); 
  width: 50px;
  height: 50px;   
  margin: 0;  
  padding: 0;
  pointer-events: none;
}
`
const Title = styled.h3`
  display: inline-block;  
  margin: 10px;
}
`
const WrapperUP = styled.div`
  display: flex;  
  align-items: center;
}
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
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let result
    const regexp = /^\d+[.]?\d*$|^$/g
    const { value, name } = event.target
    if (!value.length) {
      setSellInput('')
      setBuyInput('')
      return
    }
    if (!regexp.test(value)) {
      return
    }
    if (value.length > 20) {
      return
    }
    if (name === 'sell') {
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
    if (name === 'buy') {
      if (/^0\d$/.test(value)) {
        setBuyInput(value[1])
        result =
          mainCurrency === Currency.USD
            ? parseFloat(value[1]) / parseFloat(USD_in)
            : parseFloat(value[1]) * parseFloat(USD_out)
        setSellInput((Math.round(result * 10000) / 10000).toString())
        return
      }
      setBuyInput(value)
      result =
        mainCurrency === Currency.USD
          ? parseFloat(value) / parseFloat(USD_in)
          : parseFloat(value) * parseFloat(USD_out)
      setSellInput((Math.round(result * 10000) / 10000).toString())
      return
    }
  }

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    let result
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
        <Img content={currency} />
        <Title>Конвертер валют</Title>
      </WrapperUP>
      <WrapperDown>
        <Input
          name="sell"
          placeholder="Продажа банку"
          value={sellInput}
          onChange={handleChange}
          disabled={loading}
        />
        <Button>{mainCurrency}</Button>
        <Arrow onClick={handleClick}>
          <Img content={arrow} />
        </Arrow>
        <Input
          name="buy"
          value={buyInput}
          placeholder="Покупка у банка"
          onChange={handleChange}
          disabled={loading}
        />
        <Button>{mainCurrency === Currency.USD ? 'BYN' : 'USD'}</Button>
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
