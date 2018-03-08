<template>
  <div id="app">
    <img src="./assets/logo-intuit.png">
    <h2>Networth Calculator</h2>
    <NetworthCalculator/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import NetworthCalculator from './components/NetworthCalculator'

export default {
  name: 'App',
  components: {
    NetworthCalculator
  }
}
</script>
<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50
  h1, h2, h3, h4, h4
    color #2b6aa9
  h2
    text-align center
  img
    display flex
    height 110px
    margin auto
    text-align center
</style>