<style lang="stylus" scoped>
@import '../styles/constants.styl'


cross-lines-width = 14%
.cross
  position relative
  transform rotate(45deg)
  display inline-block
  width var(--size)
  height var(--size)
  border-radius 50%
  transition all 0.3s ease

.cross:hover
  transform rotate(135deg) scale(1.1)
.cross:hover:before
.cross:hover:after
  background empColor2

.cross:before
.cross:after
  content ""
  position absolute
  z-index -1
  background empColor4

.cross:before
  top 0
  left 50%
  width cross-lines-width
  height 100%
  margin-left (- cross-lines-width / 2)

.cross:after
  top 50%
  left 0
  width 100%
  height cross-lines-width
  margin-top (- cross-lines-width / 2)

</style>

<template>
  <span class="cross" :style="`--size: ${size}`" />
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: '15px'
    },
  }
}
</script>
