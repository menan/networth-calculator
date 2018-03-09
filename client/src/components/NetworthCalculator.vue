<template>
<div v-if="posting" class="loading-content">
  Crunching numbers...
</div>
<div v-else-if="fetchingCurrency" class="loading-content">
  Fetching exchange rate for {{currentCurrency}}...
</div>
<div class="networth-calculator" v-else>
  <div class="fields currency-select">
    <label>Choose your currency</label>
    <select v-model="currentCurrency">
      <option v-for="value in currencies" :key="value">{{value}}</option>
    </select>
  </div>
  <div class="fields networth">
    <label>Networth</label>
    <div class="value">{{formattedNetworth}}</div>
  </div>
  <div v-for="key in Object.keys(data)" :key="key">
    <h3>{{titlize(key)}} {{currentCurrencyDisplay}}</h3>
    <div v-for="sectionKey in Object.keys(data[key])" :key="sectionKey">
      <div :class="{'fields': true,'section': true, 'negative': key === 'liabilities'}">
        <h4>{{titlize(sectionKey)}} {{currentCurrencyDisplay}}</h4>
        <div class="value" v-if="total[sectionKey]">{{formatted(total[sectionKey])}}</div>
      </div>
      <div v-for="(field, index) in data[key][sectionKey]" :key="index" class="fields">
        <label>{{field.label}} {{currentCurrencyDisplay}}</label>
        <input :class="{'value': true, 'error': field.error || false}" v-model="field.value" @blur="format(field)" :disabled="posting" @focus="unformat(field)" @change="inputChanged"/>
      </div>
        <button class="value" @click="data[key][sectionKey].push({label: '', value: ''})">Add {{titlize(sectionKey)}}</button>
    </div>
  </div>
</div>
</template>
<script>
import data from '../../config/data.json'
import numbro from 'numbro'
import axios from 'axios'
import {calculateNetworth, getExchangeRate} from '../services'

export default {
  data () {
    return {
      data,
      total: {},
      currencies: ['CAD', 'USD', 'EUR', 'AUD', 'BTC', 'ETH', 'LTC'],
      currentCurrency: 'CAD',
      posting: false,
      fetchingCurrency: false,
    }
  },
  watch: {
    currentCurrency: function (newCurrency, oldCurrency) {
      this.getExchangeRate(newCurrency, oldCurrency)
    }
  },
  computed: {
    currentCurrencyDisplay () {
      return this.currentCurrency !== 'CAD' ? '(' + this.currentCurrency + ')' : ''
    },
    formattedNetworth () {
      return numbro(this.totalNetworth).formatCurrency('0,0.00')
    },
    totalNetworth () {
      return this.getTotal('cashAndInvestments') + this.getTotal('longTermAssets') - this.getTotal('longTermDebt') - this.getTotal('shortTermLiabilities') 
    }
  },
  methods: {
    titlize (value) {
      return value
      // inject space before the upper case letters
      .replace(/([A-Z])/g, function(match) {
        return " " + match
      })
      // replace first char with upper case
      .replace(/^./, function(match) {
        return match.toUpperCase()
      })
    },
    getTotal (field) {
      return this.total[field] ? this.total[field] : 0
    },
    format (field) {
      try {
        field.error = field.value < 0
        field.value = this.formatted(field.value)
      }
      catch (e) {
        field.error = true
        console.log('error formatting', e);
      }
      
    },
    unformat (field) {
      field.value = this.unformatted(field.value)
    },
    inputChanged () {
      this.callCalculateNetworth()
    },
    unformatted (value) {
      return value ? numbro.unformat(value) : ''
    },
    formatted (value) {
      return value && value !== null ? numbro(value).formatCurrency('0,0.00') : null
    },
    calculateTotal (section) {
      return section.filter(a => a.length !== null).reduce((a, b) => ({
          value: parseInt(this.unformatted(a.value) + this.unformatted(b.value))
        })).value
    },
    callCalculateNetworth () {
      this.posting = true
      calculateNetworth(data)
      .then((response) => {
        this.total = response.data
        this.posting = false
      })
      .catch((error) => {
        console.error('error posting to server', error)
        this.posting = false
      })
    },
    getExchangeRate (newCurrency, oldCurrency) {
      this.fetchingCurrency = true
      getExchangeRate(oldCurrency, newCurrency)
      .then((response) => {
        this.calculateExhangeAmount(response.data.ticker.price)
        this.fetchingCurrency = false
      })
      .catch((error) => {
        console.error('error posting to server', error)
        this.fetchingCurrency = false
      })
    },
    calculateExhangeAmount (rate) {
      Object.keys(this.data).forEach((section) => {
        Object.keys(this.data[section]).forEach((subSection) => {
          this.data[section][subSection] = this.data[section][subSection].filter(value => value.length !== null).map(object => {
            return {
              label: object.label,
              value: this.formatted(this.unformatted(object.value) * rate),
            }
          })
        })
      })

      Object.keys(this.total).forEach((section) => {
        this.total[section] = this.total[section] * rate
      })
    }
  },
  mounted () {
    this.callCalculateNetworth()
  }
}
</script>
<style lang="stylus">
.loading-content
  display flex
  justify-content center
  margin-top 250px

.networth-calculator
  width 450px
  margin auto
  padding 50px 0

  .fields
    display flex
    margin-bottom 2px
    justify-content space-between
    align-items center
    &.networth
      font-weight bold
      .label
        font-size 20px
      .value
        font-size 25px

    &.currency-select
      margin-bottom 20px

    h4, h3
      margin-bottom 10px
    &.section
      .value
        font-weight bold
        color green

      &.negative
        .value
          color red
    label 
      flex-basis 70%
      text-align left
      margin-right 5px
    .value
      flex-basis 10%
      text-align right
      padding 4px
      outline 0px
      &.error
        border-color red
      &:focus
        border-color #2b6aa9
      &:disabled
        background-color #d3d3d3
</style>



