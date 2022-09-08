<style lang="stylus" scoped>
@require '../styles/constants.styl'

footer
  flex 0 0 auto

  bottom 0
  width 100%

  margin 0
  margin-top 80px
  padding 0
  padding-bottom 15px

  background linear-gradient(20deg, rgba(84, 67, 24, 0) 0%, rgba(84, 67, 24, 0.6) 50%, rgba(84, 67, 24, 0) 100%) no-repeat
  border-top solid 2px
  border-color empColor2
  box-shadow 0 3px 10px 0 rgba(17, 12, 1, 1) inset, rgba(231, 190, 28, 0.4) 0 0 8px 0
  list-style none

  li
    display inline-block
    padding 10px 15px

    .title
      text-shadow textLightingHigh2
      font-size 18px
      font-family Arial, monospace
      color textColor1
    .description
      text-shadow textLightingNormal2
      font-size 12px
      font-family Arial, monospace
      color textColor4

  a
    color inherit
</style>

<template>
  <div>
    <footer>
      <li>
        <div class="title">За подсказками:</div>
        <div class="description"><a href="https://vk.com/squest_studio" target="_blank">vk.com/squest_studio</a></div>
      </li>
      <li>
        <div class="title">E-mail:</div>
        <div class="description">Tyapkin2002@mail.ru</div>
      </li>
      <li>
        <div class="title">VK: <small>(лучше сюда)</small> </div>
        <div class="description"><a href="https://vk.com/0pointer" target="_blank">vk.com/0pointer</a></div>
      </li>
      <li>
        <div class="title">Telegram:</div>
        <div class="description"><a href="https://t.me/tyapkin_s" target="_blank">t.me/tyapkin_s</a></div>
      </li>
    </footer>
  </div>
</template>

<script>
export default {
}
</script>
