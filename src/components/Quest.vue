<style lang="stylus" scoped>
@require '../styles/constants.styl'

quest-background = linear-gradient(100deg, rgba(116, 73, 33, 0.8) 0%, rgba(90, 56, 25, 0.5) 40%, transparent 80%) no-repeat
plate-height = 200px
plate-width = 100%
plate-max-width = 400px

.quest-preview
  display block
  transition all 0.2s ease
  box-shadow 0 0 20px colorShadow, 0 0 15px 0 rgba(34, 28, 4, 0.4) inset
  margin 20px
  margin-bottom 0
  width plate-width
  height plate-height
  max-width plate-max-width
  border-radius 7px
  position relative
  overflow hidden
  .preview-image
    position absolute
    inset 0
  .preview-image.default
    text-align right
    padding-right 20px
    line-height plate-height
    font-size 100px
    letter-spacing 10px
    opacity 0.8
    color textColor3
    background bgColor2
    z-index -1

  .container
    padding 10px 20px
    background quest-background
    background-size 150%
    background-position-x 100%
    transition all 0.2s ease
    width 100%
    height 100%
    position relative

    .edit
      width 40px
      position absolute
      right 10px
      top 10px
      transition all 0.2s ease
      opacity 0.8
    .edit:hover
      transform scale(1.1)
      opacity 1

    .title
      img
        width 30px

    .description
      overflow hidden
      text-overflow ellipsis

    .statistics
      display flex
      margin 10px 0
      .rating
      .time
        display flex
        align-items center
        font-size 20px
        margin-right 20px
        img
          width 45px
      .rating.good
        color colorYes
      .rating.bad
        color colorNo

    .branches
      position absolute
      bottom 0
      left 0
      right 0

.quest-preview:hover
  box-shadow 10px 10px 20px colorShadow
  .container
    background-position-x 0

.main-info
  transition all 0.2s ease
  z-index -1
.container.inactive
  .main-info
    filter blur(5px)
.container:before
  content ''
  position absolute
  inset 0
  transition all 0.2s ease
  z-index 1
.container.inactive:before
  background #00000099
.container
  *
    z-index 2
</style>

<template>
  <router-link class="quest-preview" :to="`/quest?id=${id}`" :style="`height: ${rootHeight}px`">
    <img class="preview-image" :src="previewUrl" alt="preview" v-if="previewUrl">

    <div class="preview-image default text-big-xx" v-else>SQ</div>

    <div class="container" :class="{inactive: branchesOpened}">
      <div class="main-info">
        <router-link :to="`/quest/edit?id=${id}`" v-if="$user.id === author" class="edit">
          <img src="../res/edit.svg" alt="edit">
        </router-link>

        <div class="text-big-x title">
          {{title}}
          <img v-if="islinkactive" src="../res/link.svg" alt="with link" class="quest-modifier">
          <img v-if="!ispublished" src="../res/invisible.svg" alt="unpublished" class="quest-modifier">
        </div>
        <div class="text-small description">{{description}}</div>
        <div class="statistics text-big-xx">
          <span class="rating" :class="{good: rating > 4.5, bad: rating < 3.5}">
            <img src="../res/star.svg" alt="star">{{rating}}
          </span>
          <span class="time">
            <img src="../res/time.svg" alt="time">{{time}}{{timeUnits}}
          </span>
        </div>
        <div class="text-small">{{authorName}}</div>
      </div>

      <CircleLoading v-if="loading"></CircleLoading>
      <ArrowListElement class="branches" ref="branches" title="Ветки" action-text="развернуть" closed :elements="branches"
        @open="openBranches"
        @close="closeBranches"
        @click-inside="$router.push(`/quest?id=${id}`)"
      ></ArrowListElement>
    </div>
  </router-link>
</template>

<script>
import ArrowListElement from "./ArrowListElement.vue";
import CircleLoading from "./loaders/CircleLoading.vue";

export default {
  components: {CircleLoading, ArrowListElement},

  props: {
    id: String,
    title: String,
    description: String,
    rating: Number,
    time: Number,
    previewUrl: String,
    author: String,
    authorName: String,
    islinkactive: Boolean,
    ispublished: Boolean,
  },

  data() {
    return {
      branchesOpened: false,
      branchesGotten: false,
      timeUnits: 'мин',

      loading: false,
      branches: [],

      rootHeight: null,
    }
  },

  methods: {
    async openBranches() {
      this.branchesOpened = true;
      if (this.branchesGotten)
        return;
      this.branchesGotten = true;

      this.loading = true;
      const branches = await this.$api.getQuestBranches(this.id);
      this.loading = false;

      if (!branches.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить ветки квесте");
        return;
      }
      this.branches = branches.branches;
    },

    closeBranches() {
      this.branchesOpened = false;
      this.rootHeight = null;
    }
  }
};
</script>
