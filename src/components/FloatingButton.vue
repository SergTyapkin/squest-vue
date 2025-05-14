<style lang="stylus" scoped>
@import '../styles/constants.styl'

padding = 5px 10px

float-button-height = 50px
image-width = 30px
.float-button
  cursor pointer
  position fixed
  z-index 10
  right 30px
  bottom 30px
  overflow hidden
  min-width float-button-height
  height float-button-height
  padding padding
  padding-right ((float-button-height - image-width) / 2)
  background empColor1
  border-radius (float-button-height / 2)
  box-shadow 3px 3px 5px colorShadow

  .fields
    display flex
    flex-direction row
    align-items center
    justify-content flex-end
    height 100%
    text-align center
    transition all 0.2s ease
    .image
      width image-width
      height image-width
      opacity 0.8
      transition all 0.2s ease
    .hover-text
      pointer-events none
      overflow hidden
      width 0
      padding-right 0
      color textColor1
      white-space nowrap
      opacity 0
      transition all 0.2s ease
.float-button:hover
  box-shadow 5px 5px 8px colorShadow
  .hover-text
    width 120px
    padding-right 10px
    opacity 1
  .image
    transform scale(1.1)
    opacity 1

.float-button.green
  background mix(colorYes, black, 70%)


@media ({mobile})
  .float-button
    transition opacity 0.3s ease, right 0.3s ease !important
</style>

<template>
  <div class="float-button text-middle" :class="{green}">
    <router-link class="fields" :to="to" v-if="to">
      <span class="hover-text">{{ title }}</span>
      <span class="image">
        <slot />
      </span>
    </router-link>

    <div class="fields" v-else>
      <span class="hover-text">{{ title }}</span>
      <span class="image">
        <slot />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    to: String,
    green: Boolean,
  }
};
</script>
