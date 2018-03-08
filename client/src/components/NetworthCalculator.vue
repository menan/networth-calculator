<template>
<div class="networth-calculator">
  <div class="fields currency-select">
    <label>Choose your currency</label>
    <select v-model="currentCurrency" @change="currencyChanged">
      <option v-for="currency in currencies" :key="currency">{{currency}}</option>
    </select>
  </div>
  <div class="fields networth">
    <label>Networth</label>
    <div class="value">{{formattedNetworth}}</div>
  </div>
  <div v-for="key in Object.keys(data)" :key="key">
    <h3>{{titlize(key)}}</h3>
    <div v-for="sectionKey in Object.keys(data[key])" :key="sectionKey">
      <div :class="{'fields': true,'section': true, 'negative': key === 'liabilities'}">
        <h4>{{titlize(sectionKey)}}</h4>
        <div class="value" v-if="total[sectionKey]">{{formatted(total[sectionKey])}}</div>
      </div>
      <div v-for="(field, index) in data[key][sectionKey]" :key="index" class="fields">
        <label>{{field.label}}</label>
        <input class="value" v-model="field.value" @blur="format(field)" @focus="unformat(field)" @change="inputChanged"/>
      </div>
        <button class="value" @click="data[key][sectionKey].push({label: '', value: ''})">Add Field</button>
    </div>
  </div>
</div>
</template>
<script>
import data from '../../config/data.json'
import numbro from 'numbro'
import axios from 'axios'

export default {
  data () {
    return {
      data,
      sections: ['cashAndInvestments', 'longTermAssets', 'shortTermLiabilities', 'longTermDebt'],
      total: {},
      currencies: ['CAD', 'USD', 'EUR', 'INR', 'BTC', 'ETH'],
      currentCurrency: 'CAD'
    }
  },
  computed: {
    formattedNetworth() {
      return numbro(this.totalNetworth).formatCurrency('0,0.00')
    },
    totalNetworth() {
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
    getTotal(field) {
      return this.total[field] ? this.total[field] : 0
    },
    format (field) {
      field.value = field.value && field.value !== null ? numbro(field.value).formatCurrency('0,0.00') : null
    },
    unformat (field) {
      field.value = this.unformatted(field.value)
    },
    inputChanged () {
      this.calculateNetworth()
    },
    unformatted (value) {
      return value ? numbro.unformat(value) : 0
    },
    formatted (value) {
      return value ? numbro(value).formatCurrency('0,0.00') : null
    },
    calculateTotal(section) {
      return section.filter(a => a.length !== null).reduce((a, b) => ({
          value: this.unformatted(a.value) + this.unformatted(b.value)
        })).value
    },
    currencyChanged () {
      console.log('currency changed', this.currentCurrency);
    },
    calculateNetworth () {
      // console.log('calculating from ', JSON.stringify(data))

      // const cash = data.assets.cashAndInvestments.reduce((a, b) => {
      //     console.log('reducing: ', a, b);
      //     sum: numbro.unformat(a.value) + numbro.unformat(b.value)
      //   });

      // this.total = this.sections.map(section => {
      //   section: {
      //     this.calculateTotal(data.assets[section])
      //   }
      // })
      this.total = {
        cashAndInvestments: this.calculateTotal(data.assets.cashAndInvestments),
        longTermAssets: this.calculateTotal(data.assets.longTermAssets),
        shortTermLiabilities: this.calculateTotal(data.liabilities.shortTermLiabilities),
        longTermDebt: this.calculateTotal(data.liabilities.longTermDebt)
      }


      // const total = data.assets.cashAndInvestments.filter(a => a.length !== null).reduce((a, b) => ({
      //     cashAndInvestments: this.unformatted(a.value) + this.unformatted(b.value)
      //   }));
      console.log('cash', this.total)

      axios.post('http://localhost:3000/calculateNetworth', data)
      .then(function (response) {
        console.log('response received from server' ,response);
      })
      .catch(function (error) {
        console.log('error posting to server', error);
      });
      
    }
  },
  mounted () {
    this.calculateNetworth()
  }
}
</script>
<style lang="stylus">
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
        flex-basis 60%
        text-align left
        margin-right 5px
      .value
        flex-basis 10%
        text-align right
        padding 4px
        outline 0px
        &:focus
          border-color #2b6aa9
</style>



