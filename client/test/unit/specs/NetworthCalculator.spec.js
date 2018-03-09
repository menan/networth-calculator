import Vue from 'vue'
import NetworthCalculator from '@/components/NetworthCalculator'
import { getExchangeRate, calculateNetworth } from '../../../src/services'

import data from '../../../config/data.json'

describe('NetworthCalculator.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(NetworthCalculator)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('h3').textContent)
      .toEqual('Assets ')
  })
})

it('check default currency at mount', () => {
  expect(typeof NetworthCalculator.data).toBe('function')
  const defaultData = NetworthCalculator.data()
  expect(defaultData.currentCurrency).toBe('CAD')
})

it('check default posting at mount', () => {
  expect(typeof NetworthCalculator.data).toBe('function')
  const defaultData = NetworthCalculator.data()
  expect(defaultData.posting).toBe(false)
})

it('check default fetching currency at mount', () => {
  expect(typeof NetworthCalculator.data).toBe('function')
  const defaultData = NetworthCalculator.data()
  expect(defaultData.fetchingCurrency).toBe(false)
})

// Inspect the component instance on mount
it('verify tilize funtion', () => {
  const vm = new Vue(NetworthCalculator).$mount()
  expect(vm.titlize('cashAndInvestments')).toBe('Cash And Investments')
})

// Mount an instance and inspect the render output
it('verify calculate total function', () => {
  const Constructor = Vue.extend(NetworthCalculator)
  const vm = new Constructor().$mount()
  expect(vm.calculateTotal(data.assets.cashAndInvestments)).toBe(181106)
  expect(vm.calculateTotal(data.assets.longTermAssets)).toBe(2019321)
  expect(vm.calculateTotal(data.liabilities.shortTermLiabilities)).toBe(4664)
  expect(vm.calculateTotal(data.liabilities.longTermDebt)).toBe(903633)
})
