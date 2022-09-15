<style lang="stylus" scoped>
@require '../styles/constants.styl'

quest-background = linear-gradient(100deg, rgba(116, 73, 33, 0.8) 0%, rgba(90, 56, 25, 0.5) 40%, transparent 80%) no-repeat

.quest-preview
  background linear-gradient(20deg, rgba(90, 56, 25, 0.9) 0%, rgba(55, 43, 16, 0.5) 100%) 50% 50% no-repeat
  box-shadow 0 0 10px 0 rgba(162, 116, 14, 0.8), 0 0 15px 0 rgba(34, 28, 4, 0.5) inset
  display block
  transition all 0.2s ease
  margin-bottom 0
  position relative
  overflow hidden
  .preview-image
    position absolute
    inset 0
  .preview-image.default
    text-align right
    padding-right 20px
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

    .title
      img
        width 30px

    .statistics
      display flex
      margin 10px 0
      .rating
      .time
        display flex
        align-items center
        font-size 17px
        margin-right 20px
        img
          width 45px
      .rating
        font-size 30px
      .rating.good
        color #a9ff5b
      .rating.bad
        color #ff7963

    .author
      margin-bottom 30px

    .description
      color textColor1
      font-size 16px

    .branches
      z-index 10
      margin-top 20px
      margin-left -20px
      margin-bottom -10px
      width calc(100% + 40px)


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
  pointer-events none
.container.inactive:before
  background #00000099
.container
  *
    z-index 2
</style>

<template>
  <div>
    <TopButtons clickable arrows low-opacity :buttons="[
        {name: 'Назад', description: 'К списку квестов',
        to: $router.options.history.state.back ? $router.options.history.state.back : '/quests'},
    ]"></TopButtons>

    <div class="quest-preview">
      <CircleLoading v-if="loading" class="preview-image"></CircleLoading>
      <img v-if="previewUrl" class="preview-image" :src="previewUrl" alt="preview">
      <div v-else class="preview-image default text-big-xx">SQ</div>

      <div class="container">
        <div class="main-info">
          <div class="text-big-x title">
            {{title}}
            <img v-if="islinkactive" src="../res/link.svg" alt="with link" class="quest-modifier">
            <img v-if="!ispublished" src="../res/invisible.svg" alt="unpublished" class="quest-modifier">
          </div>
          <div class="statistics text-big-xx">
            <span class="rating" :class="{good: rating > 4.5, bad: rating < 3.5}">
              <img src="../res/star.svg" alt="star">{{rating}}
            </span>
            <span class="time">
              <img src="../res/time.svg" alt="time">{{time}}
            </span>
          </div>
          <div class="text-small played">Прошли: {{played}}</div>
          <div class="text-small author">Автор: {{authorName}}</div>

          <div class="text-small">Описание: </div>
          <div class="text-small description">{{description}}</div>
        </div>
      </div>
    </div>

    <CircleLoading v-if="branchesLoading"></CircleLoading>
    <ArrowListElement class="branches" ref="branches" title="Ветки"
                      :elements="branches"
                      @click-inside="selectBranch"
    ></ArrowListElement>
  </div>
</template>

<script>
import ArrowListElement from "../components/ArrowListElement.vue";
import TopButtons from "../components/TopButtons.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";
import {secondsToStrTime} from "../utils/utils";

export default {
  components: {CircleLoading, TopButtons, ArrowListElement},

  data() {
    return {
      branches: [],
      id: this.$route.query.id,
      uid: this.$route.query.uid,

      loading: false,
      branchesLoading: false,

      title: '',
      description: '',
      previewUrl: '',
      author: '',
      authorName: '',
      islinkactive: false,
      ispublished: false,

      rating: '-',
      time: '-',
      played: 0,
    }
  },

  async mounted() {
    if (this.id === undefined && this.uid === undefined) {
      this.$popups.error("Квест не найден", "Не указаны id или uid квеста");
      this.$router.push('/quests')
      return;
    }

    if (this.id)
      this.getQuestInfo();
    else
      await this.getQuestInfo();

    this.getBranches();
  },

  methods: {
    async getQuestInfo() {
      this.loading = true;
      let questInfo;
      if (this.id !== undefined)
        questInfo = await this.$api.getQuestInfo(this.id);
      else if (this.uid !== undefined)
        questInfo = await this.$api.getQuestInfoByUid(this.uid);

      const questStatistics = await this.$api.getQuestStatistics(this.id);
      this.loading = false;

      if (!questInfo.ok_) {
        if (questInfo.status_ === 404) {
          this.$popups.error("Ошибка", "Квест не найден");
          this.$router.push('/quests')
          return;
        }

        if (questInfo.status_ === 403) {
          this.$popups.error("Ошибка", "Доступ к квесту запрещён");
          this.$router.push('/quests')
          return;
        }
        this.$popups.error("Ошибка", "Не удалось получить информацио о квесте");
        return;
      }

      this.id = questInfo.id;
      this.title = questInfo.title;
      this.description = questInfo.description;
      this.ispublished = questInfo.ispublished;
      this.islinkactive = questInfo.islinkactive;
      this.author = questInfo.author;
      this.authorName = questInfo.authorname;
      this.previewUrl = questInfo.previewUrl;
      this.time = questInfo.time;
      this.rating = questInfo.rating;

      if (questStatistics.ok_) {
        this.played = questStatistics.played;
        this.rating = questStatistics.rating;
        this.time = secondsToStrTime(questStatistics.time);
      }
    },

    async getBranches() {
      this.branchesLoading = true;
      const branches = await this.$api.getQuestBranches(this.id);
      this.branchesLoading = false;

      if (!branches.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить ветки квесте");
        return;
      }
      this.branches = branches.branches;

      this.branches.forEach(branch => {
        branch.actionText = 'играть';
        branch.arrow = true;
        branch.noClose = true;
      });
    },

    async selectBranch(branch) {
      if (!await this.$modal.confirm("Выбираем ветку?", branch.title))
          return;

      this.loading = true;
      const res = await this.$api.chooseBranch(this.id, branch.id);
      this.loading = false;
      if (res.ok_) {
        this.$store.dispatch('GET_USER');
        this.$router.push('/play');
        return;
      }
      if (res.status_ === 401) {
        this.$popups.alert("Не авторизован", "Чтобы поиграть, сперва надо потрудиться - войти в аккаунт");
        this.$router.push('/signin');
        return;
      }

      this.$popups.error("Ошибка", "Не удалось выбрать ветку");
    }
  }
};
</script>
