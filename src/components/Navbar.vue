<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/fonts.styl'

side-item-gradient = "linear-gradient(%s, rgba(184, 134, 11, 0.3) 30%, rgba(218, 165, 32, 0) 100%) 0 100% no-repeat"
side-items-img-size = 30px

.navbar
  position relative
  z-index 10
  overflow hidden
  width 80%
  height 60px
  margin 0 auto 10px auto
  background linear-gradient(25deg, #070505 10%, #543616 50%, #070505 100%)
  border-bottom-right-radius 100px 60px
  border-bottom-left-radius 100px 60px
  animation open-navbar 3s ease forwards

  .side-item
    font-small-extra()

    color textColor3
    text-shadow none
    text-transform uppercase
    letter-spacing 2px
    transition all 0.3s ease

  .side-item:hover
    padding-right 15px
    padding-left 15px
    color textColor2
    text-shadow textLightingLow
    letter-spacing 5px

    @media ({mobile})
      text-shadow none

  .side-item
    position absolute
    top 0
    padding 5px 10px
    *
      pointer-events none
      padding 0 5px
    img
      width side-items-img-size
      height side-items-img-size
  .side-item.left
    left 0
    background side-item-gradient % 90deg
    background-size 100% 1px
  .side-item.right
    right 0
    background side-item-gradient % -90deg
    background-size 100% 1px

  .bottom
    left 0
    width 100%
    margin-top 5px
  // background linear-gradient(90deg,  rgba(218, 165, 32, 0) 0%, rgba(184, 134, 11, 0.3) 30%, rgba(184, 134, 11, 0.3) 70%, rgba(218, 165, 32, 0) 100%) 0 100% no-repeat
  // background-size 100% 1px

  .progress
    font-counter()

    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    display block
    margin-top -5px
    color textColor2
    background radial-gradient(#f54da199, transparent 70%)
    .progress-container
      display flex
      flex-direction column
      align-items center
      .info
        overflow-y hidden
        display block
        max-height 0
        text-align center
        transition all 0.3s ease
  .progress:hover
    .progress-container
      .info
        max-height 20px

  .progressbar // uses --progress
    position absolute
    bottom 10px
    width 100%
    height 5px
    background linear-gradient(90deg, rgba(218, 165, 32, 0.7) 50%, rgba(0, 0, 0, 0.5) 53%) 0 0 no-repeat
    background-position-x calc(100% - 100% * var(--progress))
    background-size 200%
    // box-shadow rgba(231, 190, 28, 0.7) 0 0 5px 0
    border mix(empColor5, transparent, 30%) 1px solid
    border-right none
    transition background-position-x ease 3s


.opacity-in
  opacity 0
  animation opacity-in 2s ease-in forwards

.opacity-in.delayedBig
  animation-delay 1s

.opacity-in.delayedSmall
  animation-delay 0.5s

@keyframes opacity-in
  from
    opacity 0
  to
    opacity 1


@keyframes open-navbar
  from
    width 0
    border-bottom-right-radius 200px 100px
    border-bottom-left-radius 200px 100px

  to
    width 80%
    border-bottom-right-radius 100px 60px
    border-bottom-left-radius 100px 60px
</style>

<template>
  <div class="navbar absolute-wrapper">
    <div class="progressbar" :style="`--progress: ${newProgress / 100}`" />

    <router-link v-if="$store.state.user.isLogined && ($store.state.user.chosenquestid !== null) && ($store.state.user.chosenbranchid !== null)" class="center progress" :to="{name: 'play'}">
      <div class="progress-container">
        <Vue3autocounter
          ref="counter"
          :start-amount="prevProgress"
          :end-amount="newProgress"
          :duration="2"
          prefix=""
          suffix="%"
          separator=""
          decimal-separator=","
          :decimals="1"
          autoinit
        />
        <span class="text-small info progress-info">Прогресс прохождения</span>
      </div>
    </router-link>
    <div class="center progress" v-else>
      <span>SQ</span>
    </div>

    <router-link v-if="$store.state.theme !== Themes.flat" :to="{name: 'quests'}" class="left side-item opacity-in delayedBig left-navbar-item">Квесты</router-link>
    <router-link v-if="$store.state.theme !== Themes.flat" :to="{name: 'profile'}" class="right side-item opacity-in delayedBig right-navbar-item">
      <span>
        <span v-if="!$store.state.user.isLogined">Войти</span>
        <span v-else>{{ $store.state.user.username }}</span>
      </span>
      <!--      <img class="avatar" src="../res/default_avatar.png" alt="">-->
    </router-link>
  </div>
</template>

<script>
import Vue3autocounter from 'vue3-autocounter';
import {Themes} from "~/constants";

export default {
  components: {Vue3autocounter},

  data() {
    return {
      prevProgress: 0,
      newProgress: 0,

      Themes: Themes,
    };
  },

  methods: {
    updateProgress() {
      this.prevProgress = this.newProgress || 0;
      if (this.$store.state.user.progressMax === 0) {
        this.newProgress = 0;
        return;
      }
      this.newProgress = this.$store.state.user.progress / this.$store.state.user.progressMax * 100;
    }
  },

  watch: {
    '$store.state.user.progress': {
      handler: async function (to, from) {
        this.updateProgress();
      },
      deep: true,
    },
    '$store.state.user.progressMax': {
      handler: async function (to, from) {
        this.updateProgress();
      },
      deep: true,
    }
  }
};
</script>
