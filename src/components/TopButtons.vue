<style lang="stylus" scoped>
@require '../styles/constants.styl'

title-background = linear-gradient(160deg,rgba(188,116,39,.3),rgba(31,26,9,.2)) no-repeat

_side-items-background = "rgba(188,116,39, 0.3) 0%, rgba(31,26,9,0.2) 100%) no-repeat"
side-items-background-left = unquote("linear-gradient(160deg, " + _side-items-background)
side-items-background-right = unquote("linear-gradient(320deg, " + _side-items-background)


.title-container
  margin 50px 0 20px 0
  width 100%
  display flex
  align-content stretch
  justify-content center
  transition all 0.3s ease
  > *
    width 100%
    padding 20px
    box-shadow 0 0 10px 0 rgba(162, 116, 14, 0.8), 0 0 15px 0 rgba(34, 28, 4, 0.5) inset
    transition all 0.3s ease
    text-shadow textLightingNormal2
    color textColor1
    > .text-small,
    > .text-big,
    > .text-big-x,
    > .text-middle,
    > .text-small-x
      transition inherit
      transition-delay 20ms

.title-container.bg
  background title-background

.title-container.clickable.low-opacity
  > *
    opacity 0.5
.title-container.clickable
  > *
    cursor pointer
    opacity 0.8
  > *:hover
    width 150%
    box-shadow 0 0 20px 0 rgba(198, 165, 91, 0.8), 0 0 10px 0 rgba(59, 50, 17, 0.3) inset
    color textColor1
    letter-spacing 2px
    transition all 0.3s ease
    text-shadow 0 0 50px #f5f0f0, 0 0 10px #eaacbf, 0 0 15px #eaa093
    opacity 1

  > *
    display flex
    align-content center
    align-items center
    justify-content center
  > *:last-child
    justify-content flex-end
    background side-items-background-right
  > *:first-child
    justify-content flex-start
    background side-items-background-left

  span
    display inline-block

.no-link
  cursor default
</style>

<template>
  <div class="title-container text-big" :class="{bg: bg, clickable: clickable, 'low-opacity': lowOpacity}">
    <router-link :to="(button.to || '')" v-for="(button, idx) in buttons" :class="{'no-link': button.to === undefined}"
                  @click="$emit('click', Object.assign(button, {idx}))">
      <Arrow left v-if="arrows && idx === 0" size="20px"></Arrow>
      <div>
        <div class="text-big-x lighting-text" :class="{'text-big': clickable && !big}">{{ button.name }}</div>
        <div class="text-small" v-html="button.description"></div>
      </div>
      <Arrow right v-if="arrows && idx !== 0 && idx === buttons.length-1" size="20px"></Arrow>
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
    }
  }
};
</script>
