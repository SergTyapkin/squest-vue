<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'

footer
  display flex
  justify-content space-evenly
  flex 0 0 auto

  bottom 0
  width 100%

  margin 0
  margin-top 80px
  padding 0
  padding-top 15px
  padding-bottom 15px

  background linear-gradient(20deg, rgba(84, 67, 24, 0) 0%, rgba(84, 67, 24, 0.6) 50%, rgba(84, 67, 24, 0) 100%) no-repeat
  border-top solid 2px
  border-color empColor2
  box-shadow rgba(231, 190, 28, 0.5) 0 0 8px 0
  list-style none

  @media ({mobile})
    flex-wrap wrap

  a
    display inline-flex
    align-items center
    padding 5px 15px
    @media ({mobile})
      padding-left 5px
      padding-right 5px

    .title
      font-small()
      line-height 0.8
      color textColor1
    img
      width 30px
      display compact
      margin-right 5px
      transition transform 0.2s ease
    .description
      font-small-extra()
      color textColor4
      transition color 0.2s ease
  a:hover
    img
      transform scale(1.1)
    .description
      color textColor2

.flat
  @import "../styles/constantsFlatTheme.styl"

  footer
    backdrop-filter blur(10px) brightness(.7) saturate(.5)

    background linear-gradient(7deg, transparent 10%, mix(empColor1, transparent, 20%) 50%, mix(black, transparent, 20%) 100%)
    border-top solid 2px empColor1
    box-shadow empColor1 0 0 8px 0

    a
      .title
        color textColor2
      img
        filter hue-rotate(170deg) brightness(1.2)
      .description
        font-small-extra()
        color textColor4
        transition color 0.2s ease
    a:hover
      img
        transform scale(1.1)
      .description
        color textColor2
</style>

<template>
  <footer>
    <a v-if="$store.state.theme !== Themes.flat" href="https://vk.com/squest_studio" target="_blank">
      <img src="../res/vk-logo.svg" alt="vk">
      <div>
        <div class="title">За подсказками: </div>
        <div class="description">vk.com/squest_studio</div>
      </div>
    </a>
    <a v-if="$store.state.theme !== Themes.flat" href="mailto:tyapkin2002@mail.ru" target="_blank">
      <img src="../res/email-logo.svg" alt="mail">
      <div class="description">Tyapkin2002@mail.ru</div>
    </a>
    <a href="https://t.me/tyapkin_s" target="_blank">
      <img src="../res/telegram-logo.svg" alt="tg">
      <div>
        <div class="description">t.me/tyapkin_s</div>
      </div>
    </a>
    <a href="https://vk.com/tyapkin_s" target="_blank">
      <img src="../res/vk-logo.svg" alt="tg">
      <div>
        <div class="description">vk.com/tyapkin_s</div>
      </div>
    </a>
  </footer>
</template>

<script>
import {Themes} from "~/constants";

export default {
  data() {
    return {
      Themes: Themes,
    }
  }
}
</script>
