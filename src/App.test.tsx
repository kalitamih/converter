import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './store'

const MyAppWithStore = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<MyAppWithStore />, div)
  ReactDOM.unmountComponentAtNode(div)
})
