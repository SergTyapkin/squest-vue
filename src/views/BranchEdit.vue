<style lang="stylus" scoped>
@require '../styles/constants.styl'

.form-fullwidth
  margin-top 0
  max-width unset

</style>

<template>
  <div @input="onChange">
    <TopButtons bg clickable arrows :buttons="[
        {name: 'Назад', description: `К квесту: <b>${questTitle}</b>`,to: `/quest/edit?id=${questId}`},
    ]"></TopButtons>

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
      questId: '',

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
