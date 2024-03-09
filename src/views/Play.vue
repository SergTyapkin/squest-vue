<style lang="stylus" scoped>
@import "../styles/constants.styl"
@import "../styles/fonts.styl"

input-bg = linear-gradient(20deg, rgba(45, 36, 13, 0.4) 0%, rgba(62, 39, 17, 0.6) 50%, rgba(38, 30, 11, 0.4) 100%) 50% 50% no-repeat


.flex-root
  margin-top -70px
  padding-top 70px

.answer-form
  margin-top 20px
  padding 20px

.move-buttons
  margin-bottom 0
.top-buttons
  margin-top 0
  margin-bottom 0
.task-description
  font-medium-small()
  line-height 1.05
  color textColor2
  padding 20px
  border-bottom empColor6 1px solid
.restart-button
  > *
    text-align left

.qr-form
  background linear-gradient(20deg, rgba(84, 67, 24, 0) 0%, rgb(88, 58, 24) 50%, rgba(84, 67, 24, 0) 100%) 50% 50% no-repeat
  box-shadow 0 0 10px 0 rgba(162, 116, 14, 0.7), 0 0 15px 0 rgba(34, 28, 4, 0.4) inset
  padding 40px 30px
  margin-top 100px
  margin-left auto
  margin-right auto
  width 100%
  max-width 460px
  border-radius 7px
  transition all 0.3s ease
  .button-submit
    all unset
    color textColor1
    box-sizing border-box
    font-family Arial
    padding 10px
    font-size 1rem
    margin-top 20px
    border 1px solid colorShadow
    border-bottom 1px solid border-color
    transition all 0.2s ease
    border-radius 3px
    background input-bg
    box-shadow input-box-shadow
    background linear-gradient(20deg, rgba(45, 36, 13, 0.4) 0%, rgba(90, 56, 25, 0.7) 50%, rgba(55, 43, 16, 0.4) 100%) 50% 50% no-repeat
    width 100%
    text-align center
    border-color empColor3
    cursor pointer
    &:hover
      box-shadow inset 0 0 20px rgb(195, 162, 127), 0 0 15px rgb(255, 235, 164)

.congratulations
  text-align center
  width 100%
  .buttons
    text-align left

.stats
  .stats-container
    display flex
    align-items center
    justify-content center
    margin-bottom 20px
    > *
      margin 0 5px
    img
      width 30px
  .stars
    flex-direction row-reverse
    img
      cursor pointer
      transition all 0.3s ease
    img.checked
      transform scale(1.2)
    img:hover
      transform scale(1.3)

    img:hover ~ img
    img:hover
    img:focus ~ img
    img.checked
      color #d62a9d
      filter saturate(5)

    img.checked + img
      animation scaleup 0.5s

@keyframes scaleup {
  from {
    transform: scale(1.4);
    color: #600040;
  }
  to {
    transform: scale(1.3);
    color: #d62a9d;
  }
}

.task-title
  font-large()
  color textColor1
  width 100%
  text-align center
  margin-top 20px
  margin-bottom -10px
  display none

.background
  position absolute
  inset 0
  width 100%
  height 100%
  z-index -1
  object-fit cover
  background mix(black, transparent)
</style>

<template>
  <div class="flex-root">
    <img class="background" v-if="backgroundImageUrl" :src="backgroundImageUrl" alt=" ">

    <TopButtons class="move-buttons" bg clickable arrows @click="changeProgress" :buttons="setProgressButtonsList"></TopButtons>
    <TopButtons class="top-buttons quest-info-panel" bg :buttons="[
        {name: taskTitle, description: `Квест: ${questTitle} <br> ${branchTitle ? `Ветка: ${branchTitle}` : 'В этом квесте задания можно проходить в любом порядке'}`}
    ]"></TopButtons>
    <TopButtons v-if="isTasksNotSorted && isTaskInUnsortedModeSelected && !isEnd" class="top-buttons" bg arrows clickable :buttons="[
        {name: 'К списку заданий'}
    ]" @click="() => {isTaskInUnsortedModeSelected = false; taskTitle = ''; taskId = undefined; taskDescription = ''}"></TopButtons>

    <CircleLoading v-if="loading"></CircleLoading>
    <div v-show="isTasksNotSorted && !isTaskInUnsortedModeSelected && !isEnd">
      <ArrowListElement class="branch-tasks" ref="branchTasks" title="Задания" closed open-on-set-elements
                        :elements="branchTasks"
                        no-close
                        @click-inside="onSelectTask"
      ></ArrowListElement>
    </div>
    <div v-show="!isTasksNotSorted || isTaskInUnsortedModeSelected || isEnd" class="task-title-description-container">
      <div class="task-title">{{ taskTitle }}</div>
      <MarkdownRenderer ref="markdown" class="task-description text-middle"></MarkdownRenderer>
    </div>

    <div class="app-flex-filler"></div>

    <div v-if="isEnd" class="text-big-xx congratulations">
      <div>Вы прошли квест!</div>

      <div class="stats">
        <div class="text-middle stats-container">
          <img src="../res/time.svg" alt="time">
          Пройдено за: <b>{{ timeSpent }}</b>
        </div>
        <div>
          <div>Оценка:</div>
          <CircleLoading v-if="statsLoading" class="preview-image"></CircleLoading>
          <div v-else class="stats-container stars" @click="sendVote">
            <img src="../res/star.svg" alt="5" :class="{checked: this.ratingVote >= 5}" @click="this.ratingVote = 5">
            <img src="../res/star.svg" alt="4" :class="{checked: this.ratingVote >= 4}" @click="this.ratingVote = 4">
            <img src="../res/star.svg" alt="3" :class="{checked: this.ratingVote >= 3}" @click="this.ratingVote = 3">
            <img src="../res/star.svg" alt="2" :class="{checked: this.ratingVote >= 2}" @click="this.ratingVote = 2">
            <img src="../res/star.svg" alt="1" :class="{checked: this.ratingVote >= 1}" @click="this.ratingVote = 1">
          </div>
        </div>
      </div>

      <TopButtons v-if="!$user.isTemporary" @click="restartOrFinish" class="buttons finish-buttons" bg clickable arrows big :buttons="[
          { name: 'Начать заново', description: 'Прогресс сохранится' },
          { name: 'Завершить квест'},
      ]"></TopButtons>
      <TopButtons v-else @click="finishTemporarySession" class="buttons finish-buttons" bg clickable arrows big no-left-arrow :buttons="[
          { name: 'Создать полноценный аккаунт'},
      ]"></TopButtons>
    </div>

    <Form v-else-if="!isQrAnswer && (!isTasksNotSorted || isTaskInUnsortedModeSelected)" ref="form" class="answer-form"
          :title="taskQuestion"
          :fields="[
            { title: 'ОТВЕТ', info: 'РеГиСтР не важен', jsonName: 'answer' },
          ]"
          submit-text="Ответить"
          @submit="checkAnswer"
          small-title
    ></Form>

    <div v-else-if="!isTasksNotSorted || isTaskInUnsortedModeSelected" class="qr-form">
<!--      <div class="text-middle" v-if="answerLink">Отсканировано: {{answerLink}}</div>-->
      <QRScanner closed ref="qrScanner" @scan="checkQrAnswer"></QRScanner>
      <div class="text-small-x info">
        Как только ты отсканируешь правильный QR-код, ты пройдёшь это задание
      </div>
      <button class="button-submit" @click="clickOnScanButton">
        <transition name="opacity" mode="out-in">
          <span v-if="!$refs?.qrScanner?.active">Сканировать</span>
          <span v-else>Выключить сканнер</span>
        </transition>
      </button>
    </div>

    <Footer :links="bottomLink ? [bottomLink] : undefined"></Footer>
  </div>
</template>


<script>
import CircleLoading from "../components/loaders/CircleLoading.vue";
import Footer from "../components/Footer.vue";
import FloatingInput from "../components/FloatingInput.vue";
import QRScanner from "../components/QRScanner.vue";
import TopButtons from "../components/TopButtons.vue";
import MarkdownRenderer from "../components/MarkdownRenderer.vue";
import Form from "../components/FormExtended.vue";
import {secondsToStrTime} from "../utils/utils";
import {Themes, QuestModes} from "../constants";
import ArrowListElement from "~/components/ArrowListElement.vue";


const UPDATING_INTERVAL_MS = 8000;

export default {
  components: {ArrowListElement, MarkdownRenderer, TopButtons, QRScanner, FloatingInput, Footer, CircleLoading, Form},

  props: {
    testMode: Boolean,
    questId: Number,
    customCSS: String,
  },

  data() {
    return {
      questTitle: '',
      branchTitle: '',
      taskId: undefined,
      taskTitle: '',
      taskDescription: '',
      taskQuestion: '',
      isTasksNotSorted: false,
      backgroundImageUrl: undefined,
      customCSS: undefined,
      bottomLink: undefined,

      answer: '',
      answerLink: '',

      branchTasks: [],

      isTaskInUnsortedModeSelected: false,

      isEnd: false,
      isQrAnswer: false,
      isCanEdit: false,

      loading: false,
      answerLoading: false,
      statsLoading: false,

      isAnswerError: false,

      timeSpent: 0,
      ratingVote: 0,

      updatingInterval: undefined,

      customCSSStyleElement: undefined,

      setProgressButtonsList: [],

      Themes: Themes,
    }
  },

  mounted() {
    this.update();

    if (!this.testMode) {
      this.updatingInterval = setInterval(this.updatingProgressCheck, UPDATING_INTERVAL_MS);
    }
  },
  unmounted() {
    this.removeCSSFromDocument();

    clearInterval(this.updatingInterval);
  },

  methods: {
    async update(withLoading=true) {
      if (withLoading) this.loading = true;
      let res;
      if (this.testMode) {
        // if (this.questId === undefined) {
        //   throw new Error('questId не указан!');
        // }
        res = await this.$api.getExampleTask(this.questId);
      } else {
        res = await this.$api.getPlay();
      }
      if (withLoading) this.loading = false;

      if (!res.ok_) {
        if (!this.testMode) {
          if (res.status_ === 400) {
            this.$router.push({name: 'quests'});
            return;
          }

          this.$popups.error(`Ошибка ${res.status_}!`, res.info);
          return;
        } else {
          this.questTitle = "Название задания";
          this.branchTitle = "Название ветки квеста";
          this.backgroundImageUrl = null;
          this.customCSS = this.$props.customCSS;
          this.$user.progress = 1;
          this.isTasksNotSorted = false;
          this.isEnd = false;
          this.isCanEdit = false;
          this.taskId = null;
          this.taskTitle = "Название задания";
          this.taskDescription = "Какое-то достаточно длинное описание задания в квесте, которое *можно* **по-разному** `оформлять`, например ~~так~~, " +
            "- вот так" +
            "- и ещё вот так" +
            "И даже | делать | таблицы" +
            "-------| -------| -------" +
            "    1  |    2   |   3    ";
          this.$refs.markdown.update(res.description || '');
          this.taskQuestion = "Вопрос к заданию";
          this.isQrAnswer = false;
          return;
        }
      }

      this.questTitle = res.questtitle;
      this.branchTitle = res.branchtitle;
      this.backgroundImageUrl = res.backgroundimageurl;
      if (res.customcss !== this.customCSS) {
        this.removeCSSFromDocument();
        this.addCSSToDocument(res.customcss);
      }
      if (this.testMode) {
        this.customCSS = this.$props.customCSS;
      } else {
        this.customCSS = res.customcss;
      }
      this.bottomLink = res.bottomlink;
      this.$user.progress = res.progress;
      this.isTasksNotSorted = res.istasksnotsorted;
      this.isEnd = res.question === undefined;
      this.isCanEdit = res.canedit;
      if (this.isTasksNotSorted && !this.isEnd) {
        if (withLoading) this.loading = true;
        const res = await this.$api.getBranchTasks(this.$user.chosenbranchid, true);
        if (withLoading) this.loading = false;
        if (!res.ok_) {
          this.$popups.error('Ошибка', 'Не удалось получить список заданий в ветке');
          return;
        }
        this.branchTasks = res.tasks;
      } else {
        this.taskId = res.id;
        this.taskTitle = res.title;
        this.taskDescription = res.description;
        this.$refs.markdown.update(res.description || '');
        this.taskQuestion = res.question;
        this.isQrAnswer = res.isqranswer;
      }

      this.setProgressButtonsList = [];
      if (this.isCanEdit && !this.testMode) {
        if (this.isTasksNotSorted) {
          if (!this.isEnd) {
            this.setProgressButtonsList.push({name: '///', description: 'Эти кнопки есть только у автора квеста'});
            this.setProgressButtonsList.push({description: 'Пройти квест'});
          }
        } else {
          if (this.$user.progress < 1) {
            this.setProgressButtonsList.push({name: '///', description: 'Эти кнопки есть только у автора квеста'});
          } else {
            this.setProgressButtonsList.push({description: 'Предыдущее'});
          }
          if (this.$user.progress < this.$user.progressMax) {
            this.setProgressButtonsList.push({description: 'Следующее'});
          }
        }
      }

      if (!this.isEnd)
        return;

      if (withLoading) this.statsLoading = true;
      const stats = await this.$api.getMyBranchVotes(this.$user.chosenbranchid);
      if (withLoading) this.statsLoading = false;

      if (!stats.ok_) {
        this.$popups.error('Ошибка', 'Не удалось получить статистику прохождения');
        return;
      }
      this.timeSpent = secondsToStrTime(stats.time);
      this.ratingVote = stats.rating;
    },

    async updatingProgressCheck() {
      this.update(false);
    },

    async checkQrAnswer(answer) {
      if (answer === this.answerLink)
        return;
      this.answerLink = answer;

      const res = await this.checkAnswer({answer: this.answerLink});
      if (res) {
        this.$popups.success('Правильно', 'QR отсканирован');
        this.$refs.qrScanner.stop();
        return;
      }

      this.$popups.error('Неверно', 'Отсканирован неправильный QR');
    },

    async checkAnswer(values) {
      const showError = () => {
        if (this.$refs.form) {
          this.$refs.form.info = 'Ответ неверный';
          this.$refs.form.showError();
        }
        this.isAnswerError = true;
        setTimeout(() => {this.isAnswerError = false}, 1200);
      }
      if (this.testMode) {
        showError();
        return false;
      }

      this.answer = values.answer.trim();

      if (this.$refs.form)
        this.$refs.form.loading = true;
      this.answerLoading = true;
      const res = await this.$api.checkAnswer(this.answer);
      this.answerLoading = false;
      if (this.$refs.form)
        this.$refs.form.loading = false;

      if (res.ok_) {
        this.$popups.success('Правильно');
        values.answer = '';
        this.answer = '';
        this.isTaskInUnsortedModeSelected = false;
        this.taskId = '';
        this.taskTitle = '';
        this.taskDescription = '';
        await this.update();
        return true;
      }
      if (res.status_ === 418) {
        showError();
        return false;
      }

      this.$popups.error(`Ошибка ${res.status}!`, res.info);
      return false;
    },

    async restartOrFinish(button) {
      if (button.idx === 1) { // finish
        this.$router.push({name: 'quests'});
        await this.$api.chooseBranch(this.$user.chosenquestid, this.$user.chosenbranchid, QuestModes.normal);
        this.$store.dispatch('SET_THEME', Themes.default);
        return;
      }
      // restart
      if (!await this.$modal.confirm("Точно начинаем заново?", "Рейтинг останется")) {
        return;
      }
      this.loading = true;
      const res = await this.$api.restartBranch(this.$user.chosenbranchid);
      this.loading = false;
      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось начать заново");
        return;
      }
      await this.$api.chooseBranch(this.$user.chosenquestid, this.$user.chosenbranchid, QuestModes.normal);
      this.$store.dispatch('SET_THEME', Themes.default);
      await this.update();
    },
    async finishTemporarySession() {
      await this.$api.signOut();
      this.$store.dispatch('DELETE_USER');
      this.$router.push({name: "default"});
    },

    clickOnScanButton() {
      if (!this.$refs.qrScanner.active) {
        this.$refs.qrScanner.start();
        this.$refs.qrScanner.show();
        return;
      }
      this.$refs.qrScanner.stop();
      this.$refs.qrScanner.hide();
    },

    async sendVote() {
      if (!this.$user.isConfirmed) {
        this.$modal.alert("E-mail не подтвержден", "Из-за этого ты не можешь голосовать за рейтинг квеста. Подтвердить e-mail можно в профиле");
        return;
      }

      this.statsLoading = true;
      const res = await this.$api.voteBranchRating(this.$user.chosenbranchid, this.ratingVote);
      this.statsLoading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не получилось сохранить голос');
        return;
      }
      this.$popups.success('Спасибо!', 'Вас голос очень важен для нас');
    },

    async changeProgress(buttonIdx) {
      if (this.isTasksNotSorted) {
        if (buttonIdx.idx === 0) {
          return;
        }
        this.statsLoading = true;
        const res = await this.$api.setBranchFinished(this.$user.chosenbranchid);
        this.statsLoading = false;
        if (!res.ok_) {
          this.$popups.error('Ошибка', 'Не получилось перейти на финиш');
          return;
        }

        this.update();
        return;
      }

      let addition = -1;
      if (buttonIdx.idx === 1)
        addition = +1;
      const targetProgress = this.$user.progress + addition;
      if (targetProgress < 0 || targetProgress > this.$user.progressMax)
        return;

      this.statsLoading = true;
      const res = await this.$api.setBranchProgress(this.$user.chosenbranchid, targetProgress);
      this.statsLoading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не получилось перейти на другое задание');
        return;
      }
      this.update();
    },

    onSelectTask(task) {
      this.taskId = task.id;
      this.taskTitle = task.title;
      this.taskDescription = task.description;
      this.taskQuestion = task.question;
      this.isQrAnswer = task.isqranswer;
      this.isTaskInUnsortedModeSelected = true;
      this.$refs.markdown.update(this.taskDescription || '');
    },

    addCSSToDocument(stylesheetContent) {
      const headElement = document.head || document.getElementsByTagName("head")[0];
      const styleElement = document.createElement("style");
      styleElement.type = "text/css";
      if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = stylesheetContent;
      } else {
        styleElement.appendChild(document.createTextNode(stylesheetContent));
      }
      headElement.appendChild(styleElement);
      this.customCSSStyleElement = styleElement;
    },
    editCSSOnDocument(stylesheetContent) {
      if (!this.customCSSStyleElement) {
        return;
      }

      if (this.customCSSStyleElement.styleSheet) {
        this.customCSSStyleElement.styleSheet.cssText = stylesheetContent;
      } else {
        this.customCSSStyleElement.innerText = stylesheetContent;
      }
    },
    removeCSSFromDocument() {
      if (this.customCSSStyleElement) {
        this.customCSSStyleElement.remove();
      }
    }
  },

  watch: {
    '$props.customCSS'(to) {
      this.customCSS = to;
      this.editCSSOnDocument(to);
    }
  }
}
</script>
