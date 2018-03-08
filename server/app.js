const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const numbro = require('numbro')
const _ = require('lodash');

const testData = require('./data.json')
const appName = 'Networth Calculator'

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

app.get('/', (req, res) => res.send('<h3>' + appName + 'API!</h3><h4>Post</h4> To: <pre>/calculateNetworth</pre><br /> With JSON body: <br /><pre>' + JSON.stringify(testData) + '</pre>'))
app.post('/calculateNetworth', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const networthData = calculateNetworth(req.body.data);
  res.send(JSON.stringify(networthData));
})

function calculateNetworth (data) {
  const cashAndInvestments = calculateTotal(_.get(data, 'assets.cashAndInvestments', []))
  const longTermAssets = calculateTotal(_.get(data, 'assets.longTermAssets', []))
  const shortTermLiabilities = calculateTotal(_.get(data, 'liabilities.shortTermLiabilities', []))
  const longTermDebt = calculateTotal(_.get(data, 'liabilities.longTermDebt', []))
  const networth = cashAndInvestments + longTermAssets - shortTermLiabilities - longTermDebt

  return {
    cashAndInvestments: cashAndInvestments,
    longTermAssets: longTermAssets,
    shortTermLiabilities: shortTermLiabilities,
    longTermDebt: longTermDebt,
    networth: networth,
  }
}
//calculates the total for each section
function calculateTotal(section) {
  return section.length && section.filter(a => a && a.length !== null).reduce((a, b) => ({
    value: unformatted(a.value) + unformatted(b.value)
  })).value
}

//unformats the request body values
function unformatted(value) {
  return value ? numbro.unformat(value) : 0
}

app.listen(3000, () => console.log(appName + ' app listening on port 3000!'))