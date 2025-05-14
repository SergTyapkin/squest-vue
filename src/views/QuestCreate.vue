<style lang="stylus" scoped>
@import '../styles/constants.styl'

.form-fullwidth
  max-width unset
  margin-top 0

.link-fields
  position relative
.link-button
  position absolute
  top 0
  right 10px
  padding 4px 4px 0px 3px
  border-radius 5px
  .link-image
    width 20px
    height 20px
.qr
  max-width 500px
  max-height 500px
.quest-link
  margin-left 20px
  padding-right 30px
  word-break break-all
</style>

<template>
  <div @input="onChange">
    <TopButtons
      bg
      clickable
      arrows
      :buttons="[
        {name: 'Назад', description: 'К списку квестов',
         to: $router.options.history.state.back ? $router.options.history.state.back : {name: 'quests'}},
      ]"
    />

    <Form class="form-fullwidth" ref="form">
      <div class="info-container">
        <div class="text-big-xx">Создать квест</div>
      </div>

      <div class="fields-container">
        <FloatingInput v-model="title" title="Название" />
        <div>
          <label class="text-big">Описание <span /></label>
          <textarea class="text scrollable" rows="5" v-model="description" />
        </div>

        <!--        <AddableList title="Ветки"-->
        <!--                     description="При просмотре квестов для игры вы будете видеть даже неопубликованные ветки, чтобы можно было поиграть и проверить ветку до её публикации"-->
        <!--                     add-text="Добавить ветку"-->
        <!--                     action-text="Перейти"-->
        <!--                     v-model="branches"-->
        <!--                     :can-delete="false"-->
        <!--                     placeholder="Название ветки"-->
        <!--        ></AddableList>-->
        <AddableList
          title="Соавторы"
          description="Хотите делать квест вместе? Просто добавьте никнеймы соавторов ниже и они получат доступ к редактированию квеста"
          add-text="Добавить соавтора"
          v-model="helpers"
          placeholder="Логин соавтора"
          v-if="!helper"
        />

        <FloatingInput
          type="checkbox"
          title="Опубликован"
          v-model="ispublished"
          disabled
        >
          Если не опубликован - никто кроме тебя и соавторов не сможет просматривать квест в общем списке. <br>
          Но доступ к нему для игры можно будет получить по ссылке, если такая опция включена
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
    }
  },

  methods: {
    async saveQuest() {
      await this.saveQuestInfo()
      // await this.saveBranches();
      await this.saveHelpers();
      window.onbeforeunload = null;
      this.edited = false;

      this.$router.push({name: 'edit-quest', query: {id: this.id}});
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

    // async saveBranches() {
    //   if (this.id === null)
    //     return;
    //
    //   this.branchesLoading = true;
    //
    //   const branchesToCreate = this.branches.map((branch) => {
    //     return {title: branch.title, description: ""};
    //   });
    //   const created = await this.$api.createBranchesMany(this.id, branchesToCreate);
    //   this.branchesLoading = false;
    //
    //   if (!created.ok_) {
    //     this.$popups.error('Ошибка', 'Не удалось создать ветки(у)');
    //     this.$refs.form.showError();
    //     return;
    //   }
    // },

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
