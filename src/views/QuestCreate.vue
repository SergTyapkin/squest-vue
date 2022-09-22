<style lang="stylus" scoped>
@require '../styles/constants.styl'

.form-fullwidth
  margin-top 0
  max-width unset

.link-fields
  position relative
.link-button
  padding 4px 4px 0px 3px
  border-radius 5px
  position absolute
  right 10px
  top 0
  .link-image
    width 20px
    height 20px
.qr
  max-width 500px
  max-height 500px
.quest-link
  padding-right 30px
  margin-left 20px
  word-break break-all
</style>

<template>
  <div @input="onChange">
    <TopButtons bg clickable arrows :buttons="[
        {name: 'Назад', description: 'К списку квестов',
        to: $router.options.history.state.back ? $router.options.history.state.back : base_url_path + '/quests'},
    ]"></TopButtons>

    <Form class="form-fullwidth" ref="form">
      <div class="info-container">
        <div class="text-big-xx">Создать квест</div>
      </div>

      <div class="fields-container">
        <FloatingInput v-model="title" title="Название"></FloatingInput>
        <div>
          <label class="text-big">Описание <span></span></label>
          <textarea class="text scrollable" rows="5" v-model="description"></textarea>
        </div>

        <AddableList title="Ветки"
                     description="При просмотре квестов для игры вы будете видеть даже неопубликованные ветки, чтобы можно было поиграть и проверить ветку до её публикации"
                     add-text="Добавить ветку"
                     action-text="Перейти"
                     v-model="branches"
                     :can-delete="false"
                     placeholder="Название ветки"
        ></AddableList>
        <AddableList title="Соавторы"
                     description="Хотите делать квест вместе? Просто добавьте никнеймы соавторов ниже и они получат доступ к редактированию квеста"
                     add-text="Добавить соавтора"
                     v-model="helpers"
                     placeholder="Логин соавтора"
                     v-if="!helper"
        ></AddableList>

        <FloatingInput type="checkbox"
                       title="Опубликован"
                       v-model="ispublished"
                       disabled
        >
          Если не опубликован - это черновик. Никто кроме тебя и соавторов не сможет просматривать квест <br>
          Но доступ к нему можно будет получить по ссылке, если включена опция ниже
        </FloatingInput>
      </div>

      <div class="submit-container">
        <input type="submit" value="Сохранить" @click="saveQuest">
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

export default {
  components: {AddableList, FloatingInput, Form, CircleLoading, TopButtons},

  data() {
    return {
      id: null,

      branches: [],
      helpers: [],

      loading: false,

      title: '',
      description: '',
      previewUrl: '',
      author: '',
      authorName: '',
      ispublished: false,

      edited: false,

      base_url_path: this.$base_url_path,
    }
  },

  methods: {
    async saveQuest() {
      await this.saveQuestInfo()
      await this.saveBranches();
      await this.saveHelpers();
      window.onbeforeunload = null;
      this.edited = false;

      this.$router.push(`/quest/edit?id=${this.id}`);
    },

    async saveQuestInfo() {
      this.$refs.form.loading = true;
      const newQuestInfo = await this.$api.createQuest(this.title, this.description, this.ispublished);
      this.$refs.form.loading = false;

      if (newQuestInfo.ok_) {
        this.$popups.success('Сохранено', 'Квест создан');
        this.$refs.form.showSuccess();
        this.id = newQuestInfo.id;
        return;
      }
      this.$refs.form.showError();
      this.$popups.error('Ошибка', 'Не удалось сохранить информацию о квесте');
    },

    async saveBranches() {
      if (this.id === null)
        return;

      this.branchesLoading = true;

      const branchesToCreate = this.branches.map((branch) => {
        return {title: branch.title, description: ""};
      });
      const created = await this.$api.createBranchesMany(this.id, branchesToCreate);
      this.branchesLoading = false;

      if (!created.ok_) {
        this.$popups.error('Ошибка', 'Не удалось создать ветки(у)');
        this.$refs.form.showError();
        return;
      }
    },

    async saveHelpers() {
      if (this.id === null)
        return;

      this.helpersLoading = true;

      for (const helper of this.helpers) {
        const res = await this.$api.createHelper(this.id, helper.title);
        if (!res.ok_) {
          this.$popups.error('Ошибка', 'Не удалось создать соавтора');
        }
      }

      this.helpersLoading = false;
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
