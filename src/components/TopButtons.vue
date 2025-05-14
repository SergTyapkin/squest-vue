<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/fonts.styl'

_side-items-background = "rgba(188,116,39, 0.3) 0%, rgba(31,26,9,0.2) 100%) no-repeat"
side-items-background = title-background
side-items-background-left = unquote("linear-gradient(160deg, " + _side-items-background)
side-items-background-right = unquote("linear-gradient(320deg, " + _side-items-background)

title-background = linear-gradient(160deg, #3b2516, #1f1313) no-repeat


.title-container
  pointer-events none
  display flex
  align-content stretch
  justify-content center
  width 100%
  margin 50px 0 20px 0
  box-shadow 0 10px 10px 0 black
  transition all 0.3s ease
  > *
    width 100%
    padding 20px
    color textColor1
    text-shadow textLightingNormal2
    transition all 0.3s ease
    > .text-small
    > .text-big
    > .text-big-x
    > .text-middle
    > .text-small-x
      transition inherit
      transition-delay 20ms

    .text-big
      font-medium-large()

    @media ({mobile})
      min-height 60px
      padding 10px

.title-container.bg
  background title-background

.title-container.clickable.low-opacity
  > *
    opacity 0.5
.title-container.clickable
  > *
    pointer-events auto
    cursor pointer
    opacity 0.8
    background side-items-background
    border-bottom transparent 2px solid
  > *:hover
    width 150%
    color textColor1
    text-shadow 0 0 50px #f5f0f0, 0 0 10px #eaacbf, 0 0 15px #eaa093
    letter-spacing 2px
    opacity 1
    border-bottom empColor1 2px solid
    transition all 0.3s ease

  > *
    display flex
    align-content center
    align-items center
    justify-content center
  > *:last-child
    justify-content flex-end
    background side-items-background-right
    border-right none
  > *:first-child
    justify-content flex-start
    background side-items-background-left

  span
    display inline-block

.no-link
  cursor default
</style>

<template>
  <div class="title-container" :class="{bg: bg, clickable: clickable, 'low-opacity': lowOpacity}">
    <router-link
      :to="(button.to || '')"
      v-for="(button, idx) in buttons"
      :class="{'no-link': button.to === undefined}"
      @click="$emit('click', Object.assign(button, {idx}))"
    >
      <Arrow left v-if="arrows && idx === 0 && !noLeftArrow" size="20px" />
      <div>
        <div class="text-big-x" :class="{'text-big': clickable && !big}">{{ button.name }}</div>
        <div class="text-small" v-html="button.description" />
      </div>
      <Arrow right v-if="arrows && (noLeftArrow || idx !== 0) && idx === buttons.length-1" size="20px" />
    </router-link>
  </div>
</template>

<script>
import Arrow from "./Arrow.vue";

export default {
  components: {Arrow},

  emits: ['click'],

  props: {
    buttons: {
      type: Array,
      default: [],
    },

    bg: {
      type: Boolean,
      default: false,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    arrows: {
      type: Boolean,
      default: false,
    },
    lowOpacity: {
      type: Boolean,
      default: false,
    },
    big: {
      type: Boolean,
      default: false,
    },
    noLeftArrow: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
    }
  }
};
</script>
