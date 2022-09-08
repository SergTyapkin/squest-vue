<style lang="stylus" scoped>
@require '../styles/constants.styl'


.arrow
  width var(--size)
  height var(--size)
  border-top 5px solid empColor5
  border-right 5px solid empColor2
  border-radius 7px 0 7px 0
  transition all 0.2s ease
  display inline-block

.arrow.right
  right 0
  transform rotate(45deg)
  margin-left 20px

.arrow.left
  right 0
  transform rotate(-135deg)
  margin-right 20px

.arrow.top
  right 0
  transform rotate(-45deg)
  margin-left 20px

.arrow.bottom
  right 0
  transform rotate(135deg)
  margin-left 20px
</style>

<template>
  <span class="arrow" :class="{right, left, top, bottom}" :style="`--size: ${size}`"></span>
</template>

<script>
export default {
  name: 'ArrowListElement',

  emits: ['choose'],

  props: {
    size: {
      type: String,
      default: '15px'
    },

    right: Boolean,
    top: Boolean,
    left: Boolean,
    bottom: Boolean,
  },

  data() {
    return {
      right: this.$props.right,
      top: this.$props.top,
      left: this.$props.left,
      bottom: this.$props.bottom,
    }
  },

  methods: {
    setDirection(dirName) {
      this.right = false;
      this.top = false;
      this.left = false;
      this.bottom = false;

      this[dirName] = true;
    }
  }
}
</script>
