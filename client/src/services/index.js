import axios from 'axios'

function calculateNetworth (data) {
  return axios.post('http://localhost:3000/calculateNetworth', { data: data })
}

function getExchangeRate (fromCurrency, toCurrency) {
  return axios.post('https://api.cryptonator.com/api/ticker/' + fromCurrency + '-' + toCurrency)
}

export { calculateNetworth, getExchangeRate }
