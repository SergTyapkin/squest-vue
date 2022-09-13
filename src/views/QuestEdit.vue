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
        {name: 'Назад', description: 'К твоим квестам', to: '/quests/my'},
    ]"></TopButtons>

    <Form class="form-fullwidth" ref="form">
      <div class="info-container">
        <div class="text-big-xx">Изменить квест</div>
        <div class="text-middle" v-if="helper">
          Автор: <b>{{ authorName }}</b> <br>
          Вы - соавтор квеста, некоторые возможности вам недоступны
        </div>
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
                     :action-to="(branchId) => `/quest/branch/edit?id=${branchId}`"
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
        >
          Если не опубликован - это черновик. Никто кроме тебя и соавторов не сможет просматривать квест <br>
          Но доступ к нему можно будет получить по ссылке, если включена опция ниже
        </FloatingInput>

        <div>
          <FloatingInput type="checkbox"
                         title="Доступ по ссылке (или QR-коду)"
                         v-model="islinkactive"
                         @change="onChangeLink"
          >
            Получить доступ к квесту можно будет по ссылке или QR. <br>
            Удобно, если нужно дать квест человеку, ещё не имеющему аккаунт на сайте.
          </FloatingInput>

          <div class="text-big roll-active closed link-fields" ref="linkFields">
            <span>Ссылка на квест:</span>
            <a target="_blank" :href="questLink" class="quest-link text-middle link">{{ questLink }}</a>
            <span class="button rounded link-button" @click="copyLink">
                <img src="../res/link_copy.svg" alt="copy" class="link-image">
            </span>

            <br>

            <span>Ссылка в виде QR:</span>
            <QRGenerator class="qr" :text="questLink" ref="qrGenerator" no-text></QRGenerator>
          </div>
        </div>
      </div>

      <div class="submit-container">
        <input type="submit" value="Сохранить" @click="saveQuest">
      </div>

      <div class="submit-container" v-if="!helper">
        <input type="submit" value="Удалить квест" @click="deleteQuest">
      </div>
    </Form>

    <FloatingButton v-if="edited" title="Сохранить" green @click="saveQuest">
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
import QRGenerator from "../components/QRGenerator.vue";
import FloatingButton from "../components/FloatingButton.vue";
import {closeRoll, openRoll} from "../utils/show-hide";
import {deepClone} from "../utils/utils";

export default {
  components: {FloatingButton, QRGenerator, AddableList, FloatingInput, Form, CircleLoading, TopButtons},

  data() {
    return {
      prevBranches: [],
      prevHelpers: [],
      branches: [],
      helpers: [],
      id: this.$route.query.id,

      loading: false,
      branchesLoading: false,
      helpersLoading: false,
      questLink: '',

      title: '',
      description: '',
      previewUrl: '',
      author: '',
      authorName: '',
      islinkactive: false,
      ispublished: false,
      uid: '',
      helper: false,

      edited: false,
    }
  },

  async mounted() {
    if (this.id === undefined) {
      this.$popups.error("Ошибка", "id квеста не задано");
      this.$router.push('/quests/my')
      return;
    }

    await this.getQuestInfo();
    this.getBranches();
    if (!this.helper)
      this.getHelpers();
  },

  methods: {
    async getQuestInfo() {
      this.loading = true;
      const questInfo = await this.$api.getQuestInfo(this.id);
      this.loading = false;

      if (!questInfo.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить информацио о квесте");
        return;
      }
      this.title = questInfo.title;
      this.description = questInfo.description;
      this.ispublished = questInfo.ispublished;
      this.islinkactive = questInfo.islinkactive;
      this.author = questInfo.author;
      this.authorName = questInfo.authorname;
      this.previewUrl = questInfo.previewUrl;
      this.uid = questInfo.uid;
      this.helper = Boolean(questInfo.helper);

      this.questLink = this.$url + `/quest?uid=${this.uid}`;
      this.$refs.qrGenerator.regenerate(this.questLink);
      this.onChangeLink();
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
        branch.confirmed = true;
      });

      this.prevBranches = deepClone(this.branches);
    },

    async getHelpers() {
      this.helpersLoading = true;
      const helpers = await this.$api.getQuestHelpers(this.id);
      this.helpersLoading = false;

      if (!helpers.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить соавторов квеста");
        return;
      }
      this.helpers = helpers.helpers;

      this.helpers.forEach(helper => {
        helper.title = helper.name;
      });

      this.prevHelpers = deepClone(this.helpers);
    },


    onChangeLink() {
      if (this.islinkactive) {
        openRoll(this.$refs.linkFields);
        return;
      }
      closeRoll(this.$refs.linkFields);
    },

    async copyLink() {
      if (this.questLink === undefined)
        return;
      await navigator.clipboard.writeText(this.questLink);
      this.$popups.success('Ссылка скопирована в буфер обмена');
    },


    async saveQuest() {
      await this.saveQuestInfo()
      await this.saveBranches();
      await this.saveHelpers();
      window.onbeforeunload = null;
      this.edited = false;
    },

    async saveQuestInfo() {
      this.$refs.form.loading = true;
      const newQuestInfo = await this.$api.updateQuestInfo(this.id, this.title, this.description, this.ispublished, this.islinkactive);
      this.$refs.form.loading = false;

      if (newQuestInfo.ok_) {
        this.$popups.success('Сохранено', 'Информация сохранена');
        this.$refs.form.showSuccess();
        return;
      }
      this.$refs.form.showError();
      this.$popups.error('Ошибка', 'Не удалось сохранить информацию о квесте');
    },

    async saveBranches() {
      this.branchesLoading = true;

      const branchesToCreate = [];
      const branchesCreated = [];
      for (const branch of this.branches) {
        const idx = this.branches.indexOf(branch);
        const prevBranch = this.prevBranches[idx];

        if (!branch.confirmed) {
          branchesToCreate.push({title: branch.title, description: ""});
          branchesCreated.push(branch);
        } else if (branch.title !== prevBranch?.title ||
            branch.id !== prevBranch?.id ||
            branch.orderid !== prevBranch?.orderid) {
          const res = await this.$api.updateBranchOrderId(branch.id, branch.title, branch.orderid);
          if (!res.ok_) {
            this.$popups.error('Ошибка', 'Не удалось изменить название ветки (или поменять местами)');
            this.$refs.form.showError();
            return;
          }
        }
      }
      const created = await this.$api.createBranchesMany(this.id, branchesToCreate);
      this.branchesLoading = false;

      if (!created.ok_) {
        this.$popups.error('Ошибка', 'Не удалось создать ветки(у)');
        this.$refs.form.showError();
        return;
      }

      branchesCreated.forEach((branch, idx) => {
        const createdBranch = created.branches[idx];
        branch.confirmed = true;
        branch.id = createdBranch.id;
        branch.orderid = createdBranch.orderid;
        branch.ispublished = createdBranch.ispublished;
        branch.description = createdBranch.description;
      });

      this.prevBranches = deepClone(this.branches);
    },

    async saveHelpers() {
      this.helpersLoading = true;

      for (const helper of this.helpers) {
        const id = helper.id;

        let res;
        if (id !== undefined) {
          res = await this.$api.updateHelper(id, this.id, helper.title);
          if (!res.ok_) {
            this.$popups.error('Ошибка', 'Не удалось обновить соавтора');
          }
        } else {
          res = await this.$api.createHelper(this.id, helper.title);
          if (res.ok_) {
            helper.id = res.id;
          } else {
            this.$popups.error('Ошибка', 'Не удалось создать соавтора');
          }
        }
      }

      for (const helper of this.prevHelpers) {
        const id = helper.id;

        if (this.helpers.find((el) => el.id === id) === undefined) {
          const res = await this.$api.deleteHelper(id);
          if (!res.ok_) {
            this.$popups.error('Ошибка', 'Не удалось удалить соавтора');
          }
        }
      }
      this.helpersLoading = false;

      this.prevHelpers = deepClone(this.helpers);
    },

    async deleteQuest() {
      if (!await this.$modal.confirm("Точно удаляем квест?", "Восстановить не получится. Может стоит просто снять флажок \"опубликован\"?"))
        return;

      this.$refs.form.loading = true;
      const res = await this.$api.deleteQuest(this.id);
      this.$refs.form.loading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось удалить квест');
        return;
      }
      this.$popups.success('Сохранено', 'Информация сохранена');
      window.onbeforeunload = null;
      this.$router.push('/quests/my');
    },

    onChange() {
      this.edited = true;
    }
  }
};
</script>
