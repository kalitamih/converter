import React, { FC, Fragment, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import arrow from './arrow.png'
import currency from './currency.jpg'

interface ImgProps {
  content: string
}

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

const App: FC = () => {
  const [sellInput, setSellInput] = useState('')
  const [buyInput, setBuyInput] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const regexp = /^\d+[.]?\d*$|^$/g
    const { value, name } = event.target
    if (!regexp.test(value)) {
      return
    }
    if (value.length > 20) {
      return
    }
    if (name === 'sell') {
      if (/^0\d$/.test(value)) {
        setSellInput(value[1])
        return
      }
      setSellInput(value)
      return
    }
    if (name === 'buy') {
      if (/^0\d$/.test(value)) {
        setBuyInput(value[1])
        return
      }
      setBuyInput(value)
      return
    }
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
        />
        <Button>USD</Button>
        <Arrow>
          <Img content={arrow} />
        </Arrow>
        <Input
          name="buy"
          value={buyInput}
          placeholder="Покупка у банка"
          onChange={handleChange}
        />
        <Button>BYN</Button>
      </WrapperDown>
    </Fragment>
  )
}

export default App
