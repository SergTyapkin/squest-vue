<style lang="stylus" scoped>
@import '../../styles/constants.styl'

.circle-loading
  margin-right auto
  // width 60px //in props
  // height 60px //in props
  margin-left auto

.lds-default
  position relative
  display inline-block
  width 100%
  height 100%

.lds-default div
  position absolute
  width 7%
  height 7%
  background #fff
  border-radius 50%
  animation lds-default 1.2s linear infinite

.lds-default div:nth-child(1)
  top 46.25%
  left 82.5%
  animation-delay 0s

.lds-default div:nth-child(2)
  top 27.5%
  left 77.5%
  animation-delay -0.1s

.lds-default div:nth-child(3)
  top 13.75%
  left 65%
  animation-delay -0.2s

.lds-default div:nth-child(4)
  top 8.75%
  left 46.25%
  animation-delay -0.3s

.lds-default div:nth-child(5)
  top 13.75%
  left 27.5%
  animation-delay -0.4s

.lds-default div:nth-child(6)
  top 27.5%
  left 13.75%
  animation-delay -0.5s

.lds-default div:nth-child(7)
  top 46.25%
  left 8.75%
  animation-delay -0.6s

.lds-default div:nth-child(8)
  top 65%
  left 13.75%
  animation-delay -0.7s

.lds-default div:nth-child(9)
  top 77.5%
  left 27.5%
  animation-delay -0.8s

.lds-default div:nth-child(10)
  top 82.5%
  left 46.25%
  animation-delay -0.9s

.lds-default div:nth-child(11)
  top 77.5%
  left 65%
  animation-delay -1s

.lds-default div:nth-child(12)
  top 65%
  left 77.5%
  animation-delay -1.1s


@keyframes lds-default
  0%
  20%
  80%
  100%
    transform scale(1)
    opacity 0.05

  50%
    transform scale(1.5)
    opacity 1



</style>

<template>
  <div class="circle-loading" :style="`height: ${size}; width: ${size};`">
    <div class="lds-default"><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /></div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      default: '60px'
    }
  }
};
</script>
