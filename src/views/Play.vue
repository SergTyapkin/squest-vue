<style lang="stylus" scoped>
@import "../styles/constants.styl"

input-box-shadow = 0 0 15px 0 rgb(24, 19, 3) inset, 0 0 10px 0 rgba(162, 116, 14, 0.7)
input-bg = linear-gradient(20deg, rgba(45, 36, 13, 0.4) 0%, rgba(62, 39, 17, 0.6) 50%, rgba(38, 30, 11, 0.4) 100%) 50% 50% no-repeat


.description
  padding 20px
  font-size 16px
  color textColor2
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
  input
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
  input:hover
    box-shadow inset 0 0 20px rgb(195, 162, 127), 0 0 15px rgb(255, 235, 164)

.congratulations
  text-align center
  .buttons
    text-align left
</style>

<template>
  <div class="flex-root">
    <TopButtons bg :buttons="[
        {name: taskTitle, description: `Квест: ${questTitle} <br> Ветка: ${branchTitle}`},
    ]"></TopButtons>

    <MarkdownRenderer ref="markdown" class="description text-middle app-flex-filler"></MarkdownRenderer>

    <CircleLoading v-if="loading"></CircleLoading>

    <div v-if="isEnd" class="text-big-xx congratulations">
      Вы прошли ветку!

      <TopButtons @click="restart" class="buttons" bg clickable arrows big :buttons="[
          { name: 'Начать заново', description: 'Прогресс сохранится' },
          { name: 'Завершить квест', to: '/quests'},
      ]"></TopButtons>
    </div>

    <Form v-else-if="!isQrAnswer" ref="form"
          :title="taskQuestion"
          :fields="[
            { title: 'ОТВЕТ', info: 'РеГиСтР не важен', jsonName: 'answer' },
          ]"
          submit-text="Ответить"
          @submit="checkAnswer"
    ></Form>

    <div v-else class="qr-form">
      <div class="text-middle" v-if="answerLink">Отсканировано: {{answerLink}}</div>
      <QRScanner closed ref="qrScanner" @scan="checkQrAnswer"></QRScanner>
      <div class="text-small-x">
        Как только ты отсканируешь правильный QR-код, ты пройдёшь это задание
      </div>
      <input type="button" :value="qrScanButtonText" @click="clickOnScanButton">
    </div>

    <Footer></Footer>
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


export default {
  components: {MarkdownRenderer, TopButtons, QRScanner, FloatingInput, Footer, CircleLoading, Form},

  data() {
    return {
      questTitle: '',
      branchTitle: '',
      taskTitle: '',
      taskDescription: '',
      taskQuestion: '',

      answer: '',
      answerLink: '',

      qrScanButtonText: 'Сканировать',

      isEnd: false,
      isQrAnswer: false,

      loading: false,
    }
  },

  mounted() {
    this.update();
  },

  methods: {
    async update() {
      this.loading = true;
      const res = await this.$api.getPlay();
      this.loading = false;

      if (res.ok_) {
        this.questTitle = res.questtitle;
        this.branchTitle = res.branchtitle;
        this.$user.progress = res.progress;

        this.taskTitle = res.title;
        this.taskDescription = res.description;
        this.$refs.markdown.update(res.description);
        this.taskQuestion = res.question;
        this.isQrAnswer = res.isqranswer;
        this.isEnd = res.question === undefined;
        return;
      }
      if (res.status_ === 400) {
        this.$router.push('/quests');
        return;
      }

      this.$popups.error(`Ошибка ${res.status}!`, res.info);
    },

    async checkQrAnswer(answer) {
      if (answer === this.answerLink)
        return;
      this.answerLink = answer;

      this.loading = true;
      const res = await this.checkAnswer({answer: this.answerLink});
      this.loading = false;
      if (res) {
        this.$popups.success('Правильно', 'QR отсканирован');
        return;
      }

      this.$popups.error('Неверно', 'QR не тот');
    },

    async checkAnswer(values) {
      this.answer = values.answer.trim();

      if (this.$refs.form)
        this.$refs.form.loading = true;
      const res = await this.$api.checkAnswer(this.answer);
      if (this.$refs.form)
        this.$refs.form.loading = false;

      if (res.ok_) {
        this.$popups.success('Правильно');
        values.answer = '';
        await this.update();
        return true;
      }
      if (res.status_ === 418 && this.$refs.form) {
        this.$refs.form.info = 'Ответ неверный';
        this.$refs.form.showError();
        return false;
      }

      this.$popups.error(`Ошибка ${res.status}!`, res.info);
      return false;
    },

    async restart(button) {
      if (button.idx !== 0)
        return;

      if (await this.$modal.confirm("Точно начинаем заново?", "Рейтинг останется")) {
        this.loading = true;
        const res = await this.$api.restartBranch(this.$user.chosenbranchid);
        this.loading = false;
        if (!res.ok_) {
          this.$popups.error("Ошибка", "Не удалось начать заново");
          return;
        }
        await this.update();
      }
    },

    clickOnScanButton() {
      if (!this.$refs.qrScanner.active) {
        this.$refs.qrScanner.start();
        this.$refs.qrScanner.show();
        this.qrScanButtonText = "Выключить сканер";
        return;
      }
      this.$refs.qrScanner.stop();
      this.$refs.qrScanner.hide();
      this.qrScanButtonText = "Сканировать дальше";
    }
  }
}
</script>
