<style lang="stylus" scoped>
@require '../styles/constants.styl'

.form-fullwidth
  margin-top 0
  max-width unset

.qr-gen
  margin 10px 0

.flex-string
  display flex
  justify-content space-between
  input[type=button]
    flex 0.45
    padding 7px

.save-button
  margin-bottom 10px
</style>

<template>
  <div @input="onChange">
    <TopButtons bg clickable arrows :buttons="[
        {name: 'Назад', description: `К ветке: <b>${branchTitle}</b>` /* <br> Квеста: <b>${questTitle}</b>` */, to: {name: 'edit-branch', query: {id: branchId}}},
    ]"></TopButtons>

    <Form class="form-fullwidth" ref="form">
      <div class="info-container">
        <div class="text-big-xx">Изменить задание</div>
      </div>

      <div class="fields-container">
        <FloatingInput v-model="title" title="Название"></FloatingInput>
        <div>
          <label class="text-big">Описание</label>
          <div class="info text-small">Можно использовать Markdown-оформление, вставлять ссылки и загружать фото</div>
          <MarkdownRedactor :rows="10" ref="redactor" @change="changePreview" v-model="description"></MarkdownRedactor>
          <label class="text-big">Превью</label>
          <MarkdownRenderer ref="renderer"></MarkdownRenderer>
        </div>


        <FloatingInput title="Вопрос"
                       v-model="question"
        >Последнее задание в ветке выводится игроку c заголовком и описанием, но БЕЗ ВОПРОСА - это страница с поздравлением
        </FloatingInput>


        <FloatingInput type="checkbox"
                       title="QR-ответ"
                       v-model="isQrAnswer"
                       @change="changeIsQrAnswer"
        >Ответом можно сделать <b>ЛЮБОЙ</b> QR-код вместо текстового ответа. Даже уже существующий и не твой
        </FloatingInput>

        <div>
          <AddableList title="Правильные ответы"
                       description="РегИсТр ответов не играет роли. Все ответы игроков перед проверкой переводятся в нижний регистр <br>
                                    Чтобы любой ответ, введенный игроком, считался правильным, добавьте ответ '*'"
                       add-text="Добавить ответ"
                       v-model="answers"
                       can-delete
                       placeholder="ответ"
                       class="roll-active"
                       ref="answers"
                       @input="onChange"
          ></AddableList>

          <div class="roll-active closed" ref="qrFields">
            <label class="text-big">Правильный ответ <span id="qr-answer-error"></span></label>
            <div class="info text-small">
              Чтобы сделать ответом ЛЮБОЙ существующий QR, Просто отсканируй его ниже. <br>
              Либо, если такого QR ещё нет - можно сгенерировать новый QR ниже. <br>
              Игроку для прохождения этапа нужно будет отсканировать его через сканер внутри сайта на странице с вопросом
            </div>
            <QRScanner ref="qrScanner" class="roll-active closed" @scan="genQr"></QRScanner>
            <QRGenerator ref="qrGenerator" class="roll-active qr-gen"></QRGenerator>

            <div class="flex-string">
              <input type="button" value="Сканировать QR" @click="scanQr()">
              <input type="button" value="Создать QR" @click="genQr()">
            </div>
          </div>
        </div>
      </div>

      <div class="submit-container">
        <input type="submit" value="Сохранить" class="save-button" @click="saveTask">
        <input type="submit" value="Удалить задание" @click="deleteTask">
      </div>
    </Form>

    <FloatingButton v-if="edited" title="Сохранить" green @click="saveTask">
      <img src="../res/save.svg" alt="save">
    </FloatingButton>
  </div>
</template>

<script>
import TopButtons from "../components/TopButtons.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";
import Form from "../components/Form.vue";
import FloatingInput from "../components/FloatingInput.vue";
import AddableList from "../components/AddableList/AddableList.vue";
import MarkdownRedactor from "../components/MarkdownRedactor.vue";
import MarkdownRenderer from "../components/MarkdownRenderer.vue";
import QRScanner from "../components/QRScanner.vue";
import QRGenerator from "../components/QRGenerator.vue";
import FloatingButton from "../components/FloatingButton.vue";
import {closeRoll, isClosedRoll, openRoll} from "../utils/show-hide";
import {generateUid} from "../utils/utils";


export default {
  components: {
    FloatingButton,
    QRGenerator, QRScanner, MarkdownRenderer, MarkdownRedactor, AddableList, FloatingInput, Form, CircleLoading, TopButtons},

  data() {
    return {
      id: this.$route.query.id,

      loading: false,
      answersLoading: false,

      title: '',
      description: '',
      question: '',
      answers: [],
      isQrAnswer: false,
      qrAnswer: '',

      // questTitle: '',
      branchTitle: '',
      // questId: '',
      branchId: '',

      edited: false,
    }
  },

  async mounted() {
    if (this.id === undefined) {
      this.$popups.error("Ошибка", "id задания не задано");
      this.$router.push({name: 'my-quests'});
      return;
    }

    await this.getTaskInfo();
    this.$refs.renderer.update(this.description);
    this.$refs.qrGenerator?.regenerate(this.qrAnswer);
    this.changeIsQrAnswer();
  },

  methods: {
    changePreview(text) {
      this.$refs.renderer.update(text);
    },

    async getTaskInfo() {
      this.loading = true;
      const taskInfo = await this.$api.getTaskInfo(this.id);
      this.loading = false;

      if (!taskInfo.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить информацио о задании");
        return;
      }
      this.title = taskInfo.title;
      this.description = taskInfo.description;
      this.ispublished = taskInfo.ispublished;
      this.branchId = taskInfo.branchid;
      this.branchTitle = taskInfo.btitle;
      this.question = taskInfo.question;
      this.isQrAnswer = taskInfo.isqranswer;

      this.answers = taskInfo.answers.map(answer => { return {title: answer}; });
      if (this.isQrAnswer)
        this.qrAnswer = taskInfo.answers[0];
    },


    async saveTask() {
      await this.saveTaskInfo();
      window.onbeforeunload = null;
      this.edited = false;
    },

    async saveTaskInfo() {
      if (this.isQrAnswer)
        this.answers = [{title: this.qrAnswer}];

      const answers = this.answers.map(answerObj => answerObj.title);

      this.$refs.form.loading = true;
      const newTaskInfo = await this.$api.updateTaskInfo(this.id, this.title, this.description, this.question, answers, this.isQrAnswer);
      this.$refs.form.loading = false;

      if (newTaskInfo.ok_) {
        this.$popups.success('Сохранено', 'Информация сохранена');
        this.$refs.form.showSuccess();
        return;
      }
      this.$refs.form.showError();
      this.$popups.error('Ошибка', 'Не удалось сохранить информацию о задании');
    },

    async deleteTask() {
      if (!await this.$modal.confirm("Точно удаляем задание?", "Ты уверен?"))
        return;

      this.$refs.form.loading = true;
      const res = await this.$api.deleteTask(this.id);
      this.$refs.form.loading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось удалить задание');
        return;
      }
      this.$popups.success('Удалено', 'Задание удалено');
      window.onbeforeunload = null;
      this.$router.push({name: 'edit-branch', query: {id: this.branchId}});
    },

    onChange() {
      this.edited = true;
    },

    changeIsQrAnswer() {
      if (this.isQrAnswer) {
        openRoll(this.$refs.qrFields);
        closeRoll(this.$refs.answers.$el);
        return;
      }
      closeRoll(this.$refs.qrFields);
      openRoll(this.$refs.answers.$el);
    },

    scanQr() {
      this.$refs.qrScanner.start();

      if (isClosedRoll(this.$refs.qrScanner.$el)) {
        openRoll(this.$refs.qrScanner.$el);
        closeRoll(this.$refs.qrGenerator.$el);
      }
    },
    genQr(link) {
      if (isClosedRoll(this.$refs.qrGenerator.$el)) {
        openRoll(this.$refs.qrGenerator.$el);
        closeRoll(this.$refs.qrScanner.$el);
      }

      this.$refs.qrScanner.stop();

      if (!link)
        link = `${location.origin}/qr/${generateUid(8)}`;
      else
        this.$popups.success("QR отсканирован", link);
      this.qrAnswer = link;

      this.$refs.qrGenerator.regenerate(link);
    }
  },

  watch: {
    edited: (to, from) => {
      if (to === true) {
        window.onbeforeunload = () => true;
        return;
      }
      window.onbeforeunload = null;
    }
  },
};
</script>
