<style lang="stylus" scoped>
@import '../styles/buttons.styl'
@import '../styles/constants.styl'
@import '../styles/fonts.styl'

quest-background = linear-gradient(100deg, rgba(116, 73, 33, 0.9) 0%, rgba(90, 56, 25, 0.8) 40%, transparent 90%) no-repeat

.quest-preview
  position relative
  overflow hidden
  display block
  margin-bottom 0
  background linear-gradient(20deg, rgba(90, 56, 25, 0.9) 0%, rgba(55, 43, 16, 0.5) 100%) 50% 50% no-repeat
  border-bottom empColor3 1px solid
  transition all 0.2s ease
  .preview-image
    position absolute
    z-index -1
    inset 0
    width 100%
    height 100%
    object-fit cover
    filter brightness(0.5)
  .preview-image.default
    z-index -1
    padding-right 20px
    font-size 100px
    color textColor3
    text-align right
    letter-spacing 10px
    opacity 0.8
    background bgColor2

  .container
    position relative
    width 100%
    height 100%
    padding 10px 20px 50px 20px
    background quest-background
    background-position-x 100%
    background-size 150%
    transition all 0.2s ease

    .title
      font-large()

      display flex
      align-items center
      justify-content space-between
      .images-container
        white-space nowrap
        img
          width 30px

    .statistics
      display flex
      margin 10px 0
      .rating
      .time
        display flex
        align-items center
        font-medium()

        margin-right 20px
        img
          width 45px
      .rating
        font-medium()
      .rating.good
        color #a9ff5b
      .rating.bad
        color #ff7963

    .author
      margin-bottom 30px

    .description
      font-medium-small()

      padding 0
      background none

.main-info
  z-index -1
  transition all 0.2s ease
  .edit
    max-width 300px
    margin 20px auto
    color textColor1
    border-radius 10px
    img
      width 30px
      margin-left 5px
  .play
    width 100%
    max-width 300px
    margin 30px auto 0 auto
    border-radius 10px

.branches
  background #00000011

.container.inactive
  .main-info
    filter blur(5px)
.container:before
  pointer-events none
  content ''
  position absolute
  z-index 1
  inset 0
  transition all 0.2s ease
.container.inactive:before
  background #00000099
.container
  *
    z-index 2
</style>

<template>
  <div>
    <TopButtons
      clickable
      arrows
      low-opacity
      :buttons="[
        {name: 'Назад', description: 'К списку квестов',
         to: $router.options.history.state.back ? $router.options.history.state.back : {name: 'quests'}},
      ]"
    />

    <div class="quest-preview">
      <CircleLoading v-if="loading" class="preview-image" />
      <img v-if="previewUrl" class="preview-image" :src="previewUrl" alt="preview">
      <div v-else class="preview-image default text-big-xx">SQ</div>

      <div class="container">
        <div class="main-info">
          <div class="text-big-x title">
            {{ title }}
            <div class="images-container">
              <img v-if="islinkactive" src="../res/link.svg" alt="with link" class="quest-modifier">
              <img v-if="!ispublished" src="../res/invisible.svg" alt="unpublished" class="quest-modifier">
            </div>
          </div>
          <router-link :to="{name: 'edit-quest', query: {id: id}}" v-if="author === $user.id || isHelper" class="button edit">
            Изменить <img src="../res/edit.svg" alt="edit">
          </router-link>
          <div class="statistics text-big-xx">
            <span class="rating" :class="{good: rating >= 4.5, bad: rating < 3.5}">
              <img src="../res/star.svg" alt="star">{{ rating }}
            </span>
            <span class="time">
              <img src="../res/time.svg" alt="time">{{ time }}
            </span>
          </div>
          <div class="text-small played">Прошли: {{ played }}</div>
          <div class="text-small author">Автор: {{ authorName }}</div>

          <div class="text-small" v-if="description">Описание: </div>
          <MarkdownRenderer class="description" ref="renderer" />

          <button v-if="branches.length === 1" class="button play text-big-x" @click="selectBranch(branches[0])">Играть!</button>
        </div>
      </div>
      <ArrowListElement
        v-if="branches.length > 1"
        class="branches"
        ref="branches"
        title="Ветки"
        no-close
        :elements="branches"
        @click-inside="selectBranch"
      />
    </div>

    <CircleLoading v-if="branchesLoading" />
    <ArrowListElement
      ref="usersFinished"
      title="Прошли"
      closed
      :elements="usersFinished"
      @click-inside="(user) => $router.push({name: 'profile', query: {id: user.id}})"
    />
    <ArrowListElement
      ref="usersProgresses"
      title="Проходят"
      closed
      :elements="usersProgresses"
      @click-inside="(user) => $router.push({name: 'profile', query: {id: user.id}})"
    />
  </div>
</template>

<script>
import ArrowListElement from "../components/ArrowListElement.vue";
import TopButtons from "../components/TopButtons.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";
import {secondsToStrTime} from "../utils/utils";
import MarkdownRenderer from "../components/MarkdownRenderer.vue";

export default {
  components: {MarkdownRenderer, CircleLoading, TopButtons, ArrowListElement},

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
      isHelper: false,
      islinkactive: false,
      ispublished: false,

      rating: '-',
      time: '-',
      played: 0,

      usersFinished: [],
      usersProgresses: [],
    }
  },

  async mounted() {
    if (this.id === undefined && this.uid === undefined) {
      this.$popups.error("Квест не найден", "Не указаны id или uid квеста");
      this.$router.push({name: 'quests'});
      return;
    }

    await this.getQuestInfo();
    this.$refs.renderer.update(this.description);
    this.getBranches();
    this.getUsersList(this.$api.getQuestUsersFinished, (list) => {
      this.usersFinished = list.map(user => {
        return {
          id: user.id,
          title: user.username,
          description: secondsToStrTime(user.time) + (user.branches ? ' | ' : '') + user.branches,
          actionText: 'в профиль',
          arrow: true,
          noClose: true,
        }
      });
    });
    this.getUsersList(this.$api.getQuestUsersProgresses, (list) => {
      this.usersProgresses = list.map(user => {
        return {
          id: user.id,
          title: user.username,
          description: '★' + user.progress + ' | ⏱' + secondsToStrTime(user.time) + (user.branchtitle ? ' | ' : '') + user.branchtitle,
          actionText: 'в профиль',
          arrow: true,
          noClose: true,
        }
      });
    });
  },

  methods: {
    async getQuestInfo() {
      this.loading = true;
      let questInfo;
      if (this.id !== undefined)
        questInfo = await this.$api.getQuestInfo(this.id);
      else if (this.uid !== undefined)
        questInfo = await this.$api.getQuestInfoByUid(this.uid);
      this.loading = false;

      if (!questInfo.ok_) {
        if (questInfo.status_ === 404) {
          this.$popups.error("Ошибка", "Квест не найден");
          this.$router.push({name: 'quests'});
          return;
        }

        if (questInfo.status_ === 403) {
          this.$popups.error("Ошибка", "Доступ к квесту запрещён");
          this.$router.push({name: 'quests'});
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
      this.previewUrl = questInfo.previewurl;
      this.time = questInfo.time;
      this.rating = questInfo.rating;
      this.isHelper = questInfo.helper;


      this.loading = true;
      const questStatistics = await this.$api.getQuestStatistics(this.id);
      this.loading = false;

      if (questStatistics.ok_) {
        this.played = questStatistics.played;
        this.rating = questStatistics.rating?.toFixed(1) || '-';
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
      if (this.id !== this.$user.chosenquestid && branch.id !== this.$user.chosenbranchid) {
        if (this.branches.length > 1) {
          if (!await this.$modal.confirm(`Выбираем ветку "${branch.title}"?`, "В данный момент вы играете в другой квест. Прогресс в нем будет сохранен"))
            return;
        } else {
          if (!await this.$modal.confirm(`Выбираем квест "${this.title}"?`, "В данный момент вы играете в другой квест. Прогресс в нем будет сохранен"))
            return;
        }
      }

      this.loading = true;
      const res = await this.$api.chooseBranch(this.id, branch.id);
      this.loading = false;
      if (res.ok_) {
        await this.$store.dispatch('GET_USER');
        this.$router.push({name: 'play'});
        return;
      }
      if (res.status_ === 401) {
        this.$popups.alert("Не авторизован", "Чтобы поиграть, сперва надо потрудиться - войти в аккаунт");
        this.$router.push({name: 'signin'});
        return;
      }

      this.$popups.error("Ошибка", "Не удалось выбрать ветку");
    },

    async getUsersList(apiFunction, callback) {
      this.loading = true;
      const users = await apiFunction(this.id);
      this.loading = false;

      if (!users.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить список пользователей");
        return;
      }

      callback(users.players);
    }
  }
};
</script>
