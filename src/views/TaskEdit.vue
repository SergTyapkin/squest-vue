<style lang="stylus" scoped>
@require '../styles/constants.styl'

.form-fullwidth
  margin-top 0
  max-width unset

</style>

<template>
  <div @input="onChange">
    <TopButtons bg clickable arrows :buttons="[
        {name: 'Назад', description: `К ветке: <b>${branchTitle}</b> <br> Квеста: <b>${questTitle}</b>`, to: `/quest/edit?id=${questId}`},
    ]"></TopButtons>



    <div id="back-button" class="title-container clickable low-opacity">
      <div>
        <arrow class="arrow left"></arrow>
        <span>
            <div class="text-big-x lighting-text">К ветке</div>
            <div id="branch-name" class="text"></div>
        </span>
      </div>
    </div>

    <div id="data-edit-form" class="form">
      <div class="info-container">
        <div class="text-max">Изменить задание</div>
      </div>

      <div class="fields-container">
        <div id="title-fields">
          <label class="text-big">Название <span id="title-error"></span></label>
          <input id="title-input" type="text">
        </div>
        <div id="description-fields">
          <label class="text-big">Описание <span id="description-error"></span></label>
          <div class="info text-small">Можно использовать Markdown-оформление, вставлять ссылки и загружать фото</div>
          <div class="absolute-wrapper">
            <textarea id="description-input" class="text markdowned scrollable" rows="5"></textarea>
            <div id="markdown-panel">
              <div class="_bold">B</div>
              <div class="_italic">I</div>
              <div class="_strikethrough">S</div>
              <div class="_code">`c`</div>
              <div class="_header-1">H1</div>
              <div class="_header-2">H2</div>
              <div class="_header-3">H3</div>
              <div class="_blockquote">>|</div>
              <div class="_list"><svg xmlns="http://www.w3.org/2000/svg" width="18px" height="12px"><g transform="scale(0.25) translate(8, 2)"><path d="M57.124,51.893H16.92c-1.657,0-3-1.343-3-3s1.343-3,3-3h40.203c1.657,0,3,1.343,3,3S58.781,51.893,57.124,51.893z"/><path d="M57.124,33.062H16.92c-1.657,0-3-1.343-3-3s1.343-3,3-3h40.203c1.657,0,3,1.343,3,3   C60.124,31.719,58.781,33.062,57.124,33.062z"/><path d="M57.124,14.231H16.92c-1.657,0-3-1.343-3-3s1.343-3,3-3h40.203c1.657,0,3,1.343,3,3S58.781,14.231,57.124,14.231z"/><circle cx="4.029" cy="11.463" r="4.029"/><circle cx="4.029" cy="30.062" r="4.029"/><circle cx="4.029" cy="48.661" r="4.029"/></g></svg></div>
              <div class="_link"><svg xmlns="http://www.w3.org/2000/svg" width="18px" height="15px"><g transform="scale(0.028) translate(70, 40)"><path d="M211.26,389.24l-60.331,60.331c-25.012,25.012-65.517,25.012-90.508,0.005c-24.996-24.996-24.996-65.505-0.005-90.496     l120.683-120.683c24.991-24.992,65.5-24.992,90.491,0c8.331,8.331,21.839,8.331,30.17,0c8.331-8.331,8.331-21.839,0-30.17     c-41.654-41.654-109.177-41.654-150.831,0L30.247,328.909c-41.654,41.654-41.654,109.177,0,150.831     c41.649,41.676,109.177,41.676,150.853,0l60.331-60.331c8.331-8.331,8.331-21.839,0-30.17S219.591,380.909,211.26,389.24z"/><path d="M479.751,30.24c-41.654-41.654-109.199-41.654-150.853,0l-72.384,72.384c-8.331,8.331-8.331,21.839,0,30.17     c8.331,8.331,21.839,8.331,30.17,0l72.384-72.384c24.991-24.992,65.521-24.992,90.513,0c24.991,24.991,24.991,65.5,0,90.491     L316.845,283.638c-24.992,24.992-65.5,24.992-90.491,0c-8.331-8.331-21.839-8.331-30.17,0s-8.331,21.839,0,30.17     c41.654,41.654,109.177,41.654,150.831,0l132.736-132.736C521.405,139.418,521.405,71.894,479.751,30.24z"/></g></svg></div>
              <div class="_photo"><svg class="_photo" xmlns="http://www.w3.org/2000/svg" width="19px" height="15px"><g transform="scale(0.8) translate(0, -2)"><path d="m14.134 3.65c.853 0 1.46.278 1.988.899.017.019.494.61.66.815.228.281.674.536.945.536h.41c2.419 0 3.863 1.563 3.863 4.05v5.85c0 2.241-2 4.2-4.273 4.2h-11.454c-2.267 0-4.223-1.953-4.223-4.2v-5.85c0-2.496 1.4-4.05 3.814-4.05h.409c.271 0 .717-.255.945-.536.166-.204.643-.796.66-.815.528-.621 1.135-.899 1.988-.899z"/><circle cx="12" cy="12" r="3.85"/></g></svg></div>
            </div>
          </div>
          <label class="text-big">Превью <span id="description-preview-error"></span></label>
          <div id="description-preview" class="text input-area"></div>
        </div>
        <div id="question-fields">
          <label class="text-big">Вопрос <span id="question-error"></span></label>
          <div class="info text-small">Последнее задание в ветке выводится игроку без вопроса - это страница с поздравлением </div>
          <textarea id="question-input" class="text"></textarea>
        </div>
        <div id="answers-fields">
          <div id="qr-switch-fields">
            <label class="text-big">QR-ответ <span id="qr-switch-error"></span></label>
            <input id="qr-switch-input" type="checkbox" class="switch">
            <div class="info text-small">
              Ответом можно сделать <b>ЛЮБОЙ</b> QR-код вместо текстового ответа. Даже уже существующий и не твой
            </div>
          </div>
          <div id="text-answers-fields" class="roll-active">
            <label class="text-big">Правильные ответы <span id="text-answers-error"></span></label>
            <div class="info text-small">
              РегИсТр ответов не играет роли. Все ответы игроков перед проверкой переводятся в нижний регистр <br>
              Чтобы любой ответ, введенный игроком, считался правильным, добавьте ответ "*"
            </div>
            <ul id="answers-list" class="addable-list roll-active closed">
              <!-- answers will be there -->
            </ul>
            <input id="answers-button-new" type="button" value="Добавить ответ">
          </div>
          <div id="qr-answer-fields" class="roll-active">
            <label class="text-big">Правильный ответ <span id="qr-answer-error"></span></label>
            <div class="info text-small">
              Чтобы сделать ответом ЛЮБОЙ существующий QR, Просто отсканируй его ниже. <br>
              Либо, если такого QR ещё нет - можно сгенерировать новый QR ниже. <br>
              Игроку для прохождения этапа нужно будет отсканировать его через сканер внутри сайта на странице с вопросом
            </div>
            <video id="qr-code-scanner" class="roll-active closed"></video>
            <div id="qr-code-fields">
              <div class="text-middle">Результат: <span id="qr-code-text"></span></div>
              <div id="qr-code-image"></div>
              <div class="info text-small">
                Сгенерированный выше QR может отличаться от того, что ты только что отсканировал камерой (если ты сканировал QR камерой). <br>
                Всё в порядке. Для прохождения этапа можно отсканировать и оригинальный QR, и этот
              </div>
            </div>
            <div class="flex-string">
              <input id="qr-scan-button" type="button" value="Сканировать QR">
              <input id="qr-gen-button" type="button" value="Создать QR">
            </div>
          </div>
        </div>
      </div>

      <div class="submit-container">
        <input id="save-button" type="submit" value="Сохранить">
      </div>
    </div>



    <Form class="form-fullwidth" ref="form">
      <div class="info-container">
        <div class="text-big-xx">Изменить ветку</div>
      </div>

      <div class="fields-container">
        <FloatingInput v-model="title" title="Название"></FloatingInput>
        <div>
          <label class="text-big">Описание <span></span></label>
          <textarea class="text scrollable" rows="5" v-model="description"></textarea>
        </div>

        <AddableList title="Задания"
                     description=""
                     add-text="Добавить задание"
                     action-text="Перейти"
                     v-model="tasks"
                     :can-delete="false"
                     placeholder="Название задания"
                     :action-to="(taskId) => `quest/branch/task/edit?id=${taskId}`"
                     @input="onChange"
        ></AddableList>

        <FloatingInput type="checkbox"
                       title="Опубликована"
                       v-model="ispublished"
        >
          Если ветка не опубликована - это черновик. Никто кроме тебя и соавторов не сможет просматривать её <br>
          При просмотре квестов для игры вы, как автор, будете видеть даже неопубликованные ветки, чтобы можно было поиграть и проверить ветку до её публикации
        </FloatingInput>
      </div>

      <div class="submit-container">
        <input type="submit" value="Сохранить" @click="saveBranch">
      </div>

      <div class="submit-container">
        <input type="submit" value="Удалить ветку" @click="deleteBranch">
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
import {deepClone} from "../utils/utils";

export default {
  components: {AddableList, FloatingInput, Form, CircleLoading, TopButtons},

  data() {
    return {
      prevTasks: [],
      tasks: [],
      id: this.$route.query.id,

      loading: false,
      tasksLoading: false,

      title: '',
      description: '',
      ispublished: false,

      questTitle: '',
      branchTitle: '',
      questId: '',
      branchId: '',

      edited: false,
    }
  },

  mounted() {
    if (this.id === undefined) {
      this.$popups.error("Ошибка", "id ветки не задано");
      this.$router.push('/quests/my');
      return;
    }

    this.getBranchInfo();
    this.getTasks();
  },

  methods: {
    async getBranchInfo() {
      this.loading = true;
      const branchInfo = await this.$api.getBranchInfo(this.id);
      this.loading = false;

      if (!branchInfo.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить информацио о квесте");
        return;
      }
      this.title = branchInfo.title;
      this.description = branchInfo.description;
      this.ispublished = branchInfo.ispublished;
      this.questId = branchInfo.questid;
      this.questTitle = branchInfo.qtitle;
    },

    async getTasks() {
      this.tasksLoading = true;
      const tasks = await this.$api.getBranchTasks(this.id);
      this.tasksLoading = false;

      if (!tasks.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить задания ветки");
        return;
      }
      this.tasks = tasks.tasks;

      this.tasks.forEach(tasks => {
        tasks.confirmed = true;
      });

      this.prevTasks = deepClone(this.tasks);
    },



    async saveBranch() {
      await this.saveBranchInfo();
      await this.saveTasks();
    },

    async saveBranchInfo() {
      this.$refs.form.loading = true;
      const newBranchInfo = await this.$api.updateBranchInfo(this.id, this.title, this.description, this.ispublished);
      this.$refs.form.loading = false;

      if (newBranchInfo.ok_) {
        this.$popups.success('Сохранено', 'Информация сохранена');
        this.$refs.form.showSuccess();
        return;
      }
      this.$refs.form.showError();
      this.$popups.error('Ошибка', 'Не удалось сохранить информацию о квесте');
    },

    async saveTasks() {
      this.tasksLoading = true;

      const tasksToCreate = [];
      const tasksCreated = [];
      for (const task of this.tasks) {
        const idx = this.tasks.indexOf(task);
        const prevTask = this.prevTasks[idx];

        if (!task.confirmed) {
          tasksToCreate.push({title: task.title, description: "", question: "", answers: []});
          tasksCreated.push(task);
        } else if (task.title !== prevTask?.title ||
            task.id !== prevTask?.id ||
            task.orderid !== prevTask?.orderid) {
          const res = await this.$api.updateTaskOrderId(task.id, task.title, task.orderid);
          if (!res.ok_) {
            this.$popups.error('Ошибка', 'Не удалось изменить название задания (или поменять местами)');
            this.$refs.form.showError();
            return;
          }
        }
      }
      const created = await this.$api.createTasksMany(this.id, tasksToCreate);
      this.tasksLoading = false;

      if (!created.ok_) {
        this.$popups.error('Ошибка', 'Не удалось создать задания(е)');
        this.$refs.form.showError();
        return;
      }

      tasksCreated.forEach((task, idx) => {
        const createdTask = created.tasks[idx];
        task.confirmed = true;
        task.id = createdTask.id;
        task.orderid = createdTask.orderid;
        task.description = createdTask.description;
      });

      this.prevTasks = deepClone(this.tasks);
      window.onbeforeunload = null;
    },

    async deleteBranch() {
      if (!await this.$modal.confirm("Точно удаляем ветку?", "Все задания в ней будут удалены. Может стоит просто снять флажок \"опубликована\"?"))
        return;

      this.$refs.form.loading = true;
      const res = await this.$api.deleteBranch(this.id);
      this.$refs.form.loading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось удалить ветку');
        return;
      }
      this.$popups.success('Сохранено', 'Информация сохранена');
      window.onbeforeunload = null;
      this.$router.push('/quests/my');
    },

    onChange() {
      this.edited = true;
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
