<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/fonts.styl'

footer
  bottom 0
  display flex
  flex 0 0 auto
  justify-content space-evenly
  width 100%
  margin 0
  margin-top 80px
  padding 0
  padding-top 15px
  padding-bottom 15px
  list-style none
  background linear-gradient(20deg, rgb(47, 20, 23), rgb(74, 51, 23), rgb(66, 35, 16)) no-repeat
  border-color empColor2
  border-top solid 2px
  box-shadow rgba(231, 190, 28, 0.5) 0 0 8px 0

  a
    display inline-flex
    align-items center
    padding 5px 15px

    .title
      font-small()

      line-height 0.8
      color textColor1
    img
      width 30px
      height 30px
      margin-right 5px
      transition transform 0.2s ease
    .description
      font-small-extra()

      color textColor4
      transition color 0.2s ease

    @media ({mobile})
      padding-right 5px
      padding-left 5px
  a:hover
    img
      transform scale(1.1)
    .description
      color textColor2

  @media ({mobile})
    flex-wrap wrap
</style>

<template>
  <footer class="root-footer">
    <a v-if="links" v-for="link in links" class="footer-link-block" :href="link" target="_blank">
      <img src="../res/link.svg" alt="vk">
      <div>
        <div class="title">Связь с автором: </div>
        <div class="description">Перейти по ссылке</div>
      </div>
    </a>

    <div v-else style="display: contents">
      <a v-if="$store.state.theme !== Themes.flat" class="footer-link-block" href="https://vk.com/squest_studio" target="_blank">
        <img src="../res/vk-logo.svg" alt="vk">
        <div>
          <div class="title">За подсказками: </div>
          <div class="description">vk.com/squest_studio</div>
        </div>
      </a>
      <a v-if="$store.state.theme !== Themes.flat" class="footer-link-block" href="mailto:tyapkin2002@mail.ru" target="_blank">
        <img src="../res/email-logo.svg" alt="mail">
        <div class="description">Tyapkin2002@mail.ru</div>
      </a>
      <a class="footer-link-block" href="https://t.me/tyapkin_s" target="_blank">
        <img src="../res/telegram-logo.svg" alt="tg">
        <div>
          <div class="description">t.me/tyapkin_s</div>
        </div>
      </a>
      <a class="footer-link-block" href="https://vk.com/tyapkin_s" target="_blank">
        <img src="../res/vk-logo.svg" alt="tg">
        <div>
          <div class="description">vk.com/tyapkin_s</div>
        </div>
      </a>
    </div>
  </footer>
</template>

<script>
import {Themes} from "~/constants";

export default {
  props: {
    links: Array,
  },

  data() {
    return {
      Themes: Themes,
    }
  }
}
</script>
