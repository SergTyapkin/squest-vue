<style lang="stylus" scoped>
@require '../styles/constants.styl'

// quest-background = linear-gradient(100deg, #775939 0%, rgba(116, 73, 33, 0.9) 40%, rgba(90, 56, 25, 0.7) 65%, transparent 100%) no-repeat
quest-background = linear-gradient(100deg, #6c421e 0%, rgb(116, 73, 33) 40%, rgba(90, 56, 25, 0.9) 60%, transparent 100%) no-repeat
plate-height = 200px
plate-width = 100%
plate-max-width = 400px

.quest-preview
  display block
  transition all 0.2s ease
  box-shadow 0 0 20px colorShadowDark
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
    object-fit cover
    width 100%
    height 100%
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
    background-position-x 80%
    transition all 0.5s cubic-bezier(0.2, 0.65, 0.11, 0.99);
    width 100%
    height 100%
    position relative

    .text-container
      max-height 75px
      height 100%
      min-height 60px
      overflow hidden
      .title
        display flex
        align-items center
        justify-content space-between
        line-height 1
        margin-bottom 5px
        .badges-container
          white-space nowrap
          img
            width 25px
        .quest-modifier
          margin-left 5px

      .description
        overflow hidden
        text-overflow ellipsis

    .statistics
      display flex
      margin-top 5px
      margin-bottom 3px
      .rating
      .time
        display flex
        align-items center
        font-size 15px
        margin-right 20px
        img
          width 30px
          margin-right 5px
      .rating
        font-size 25px
      .rating.good
        color #a9ff5b
      .rating.bad
        color #ff7963

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

.author-fields
  display flex
  align-items center
  img
    height 17px
    margin-right 3px
  span
    transition all 0.3s ease
    color textColor3
.author-fields:hover
  span
    color textColor1


.quest-preview.placeholder
  > *
    opacity 0
  background linear-gradient(-60deg, #26123188 20%, #45274888 50%, #26123188 80%)
  animation placeholder-bg infinite 3s cubic-bezier(0.34, 0.66, 0.67, 0.4)
  @media ({mobile})
    animation none
  pointer-events none

@keyframes placeholder-bg
  from
    background-position-x 0px
  to
    background-position-x 400px

.quest-preview:not(.many-branches)
  .branches
    display none
  .text-container
    margin-bottom 20px
  .statistics
    margin-bottom 25px
</style>

<template>
  <router-link class="quest-preview" :to="{name: 'quest', query: {id: id}}" :class="{placeholder: isPlaceholder, 'many-branches': branches.length > 1}">
    <img class="preview-image" :src="previewurl" alt="preview" v-if="previewurl">

    <div class="preview-image default text-big-xx" v-else>SQ</div>

    <div class="container" :class="{inactive: branchesOpened}">
      <div class="main-info">
        <div class="text-container">
          <div class="title"
               :class="{
                  'text-big-x': title?.length < 20,
                  'text-big': title?.length >= 20 && title?.length < 40,
                  'text-middle': title?.length >= 40
                }"
          >
            <span>{{title}}</span>
            <span class="badges-container">
              <img v-if="islinkactive" src="../res/link.svg" alt="with link" class="quest-modifier">
              <img v-if="!ispublished" src="../res/invisible.svg" alt="unpublished" class="quest-modifier">
            </span>
          </div>
          <div class="text-small description" v-if="description">{{description.replace(/([#*_]\ ?|&lt;\w*&gt;)/g, '').slice(0, 80) + (description.length > 80 ? '...' : '')}}</div>
        </div>

        <div class="statistics text-big-xx">
          <span class="rating" :class="{good: rating >= 4.5, bad: rating < 3.5}">
            <img src="../res/star.svg" alt="star">{{rating}}
          </span>
          <span class="time">
            <img src="../res/time.svg" alt="time">{{time}}
          </span>
        </div>
        <router-link :to="{name: 'profile', query: {id: author}}" class="link text-small author-fields">
          <img src="../res/profile.svg" alt="">
          <span>{{authorname}}</span>
        </router-link>
      </div>

      <CircleLoading v-if="loading" size="40px"></CircleLoading>
      <ArrowListElement v-if="branches.length > 0"
                        ref="branches"
                        class="branches"
                        title="Ветки"
                        action-text="развернуть"
                        closed
                        :elements="branches"
                        preserve-click-open
                        @open="openBranches"
                        @close="closeBranches"
                        @click-inside="$router.push({name: 'quest', query: {id: id}})"
      ></ArrowListElement>
    </div>
  </router-link>
</template>

<script>
import ArrowListElement from "./ArrowListElement.vue";
import CircleLoading from "./loaders/CircleLoading.vue";
import {secondsToStrTime} from "../utils/utils";

export default {
  components: {CircleLoading, ArrowListElement},

  props: {
    id: Number,
    title: String,
    description: String,
    previewurl: String,
    author: Number,
    authorname: String,
    islinkactive: Boolean,
    ispublished: Boolean,
    canedit: Boolean,

    isPlaceholder: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      branchesOpened: false,
      branchesGotten: false,

      loading: false,
      branches: [],

      time: '-',
      rating: '-',
      played: 0,
    }
  },

  mounted() {
    if (!this.isPlaceholder) {
      this.init();
    }
  },

  methods: {
    async init() {
      await this.getQuestStats();
      await this.getBranches();
    },
    async getBranches() {
      this.loading = true;
      const branches = await this.$api.getQuestBranches(this.id);
      this.loading = false;

      if (!branches.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить ветки квесте");
        return;
      }
      this.branches = branches.branches;
      this.branchesGotten = true;
    },
    async openBranches() {
      this.branchesOpened = true;
      if (this.branchesGotten) {
        this.$refs.branches.open();
        return;
      }

      await this.getBranches();
    },

    closeBranches() {
      this.branchesOpened = false;
    },

    async getQuestStats() {
      this.loading = true;
      const questStatistics = await this.$api.getQuestStatistics(this.id);
      this.loading = false;

      if (questStatistics.ok_) {
        this.played = questStatistics.played;
        this.rating = questStatistics.rating?.toFixed(1) || '-';
        this.time = secondsToStrTime(questStatistics.time);
      }
    }
  },

  watch: {
    isPlaceholder: function (from, to) {
      if (from === false && to === true) {
        this.init();
      }
    }
  }
};
</script>
