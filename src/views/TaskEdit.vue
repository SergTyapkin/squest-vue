<style lang="stylus" scoped>
@require '../styles/constants.styl'

.form-fullwidth
  margin-top 0
  max-width unset

.renderer
  display block

.flex-string
  display flex
  justify-content space-between
  input[type=button]
    flex 0.45
</style>

<template>
  <div @input="onChange">
    <TopButtons bg clickable arrows :buttons="[
        {name: 'Назад', description: `К ветке: <b>${branchTitle}</b>` /* <br> Квеста: <b>${questTitle}</b>` */, to: `/quest/branch/edit?id=${branchId}`},
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
          <MarkdownRedactor ref="redactor" @change="changePreview" v-model="description"></MarkdownRedactor>
          <label class="text-big">Превью</label>
          <MarkdownRenderer ref="renderer" class="renderer input-like"></MarkdownRenderer>
        </div>


        <FloatingInput title="Вопрос"
                       v-model="question"
        >Последнее задание в ветке выводится игроку c заголовком и описанием, но БЕЗ ВОПРОСА - это страница с поздравлением
        </FloatingInput>


        <FloatingInput type="checkbox"
                       title="QR-ответ"
                       v-model="isQrAnswer"
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
                       v-if="!isQrAnswer"
          ></AddableList>

          <div class="roll-active" ref="qrFields" v-else>
            <label class="text-big">Правильный ответ <span id="qr-answer-error"></span></label>
            <div class="info text-small">
              Чтобы сделать ответом ЛЮБОЙ существующий QR, Просто отсканируй его ниже. <br>
              Либо, если такого QR ещё нет - можно сгенерировать новый QR ниже. <br>
              Игроку для прохождения этапа нужно будет отсканировать его через сканер внутри сайта на странице с вопросом
            </div>
            <QRScanner ref="qrScanner" class="roll-active closed" @scan="genQr"></QRScanner>
            <QRGenerator ref="qrGenerator" class="roll-active"></QRGenerator>

            <div class="flex-string">
              <input type="button" value="Сканировать QR" @click="scanQr()">
              <input type="button" value="Создать QR" @click="genQr()">
            </div>
          </div>
        </div>
      </div>

      <div class="submit-container">
        <input type="submit" value="Сохранить" @click="saveTask">
      </div>

      <div class="submit-container">
        <input type="submit" value="Удалить задание" @click="deleteTask">
      </div>
    </Form>
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
import {closeRoll, openRoll} from "../utils/show-hide";


export function generateUid(len) {
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join('');

}

export default {
  components: {QRGenerator, QRScanner, MarkdownRenderer, MarkdownRedactor, AddableList, FloatingInput, Form, CircleLoading, TopButtons},

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
      this.$router.push('/quests/my');
      return;
    }

    await this.getTaskInfo();
    this.$refs.renderer.update(this.description);
    this.$refs.qrGenerator.regenerate(this.answers[0]?.title);
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
    },


    async saveTask() {
      await this.saveTaskInfo();
      window.onbeforeunload = null;
    },

    async saveTaskInfo() {
      console.log(this.isQrAnswer)
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
      this.$router.push('/quests/my');
    },

    onChange() {
      this.edited = true;
    },


    scanQr() {
      this.$refs.qrScanner.start();

      closeRoll(this.$refs.qrGenerator.$el);
      openRoll(this.$refs.qrScanner.$el);
    },
    genQr(link) {
      openRoll(this.$refs.qrGenerator.$el);
      closeRoll(this.$refs.qrScanner.$el);

      this.$refs.qrScanner.stop();

      if (!link)
        link = `${this.$url}/found_qr?data=${generateUid(10)}`;
      else
        this.$popups.success("QR отсканирован", link);
      this.answers = [{title: link}];

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
