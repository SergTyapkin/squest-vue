<style lang="stylus" scoped>
@require '../styles/buttons.styl'
@require '../styles/constants.styl'
@require '../styles/fonts.styl'

.root-take-quest
  display flex
  align-items center
  justify-content center
  height 100%
  width 100%
</style>

<template>
  <div class="root-take-quest">
    <CircleLoading class="loading"></CircleLoading>
  </div>
</template>

<script>
import CircleLoading from "../components/loaders/CircleLoading.vue";
import {QuestModes} from "~/constants";

export default {
  components: {CircleLoading},

  data() {
    return {
      branches: [],
      id: this.$route.query.id,
      uid: this.$route.query.uid,
      mode: this.$route.query.mode || QuestModes.normal,
      branchId: this.$route.query.branchid,

      username: this.$route.query.username,
      password: this.$route.query.password || '',
    }
  },

  async mounted() {
    // Register user ot login
    if (this.username !== undefined) {
      const res = await this.$api.signIn(this.username, this.password);
      if (res.ok_) {
        console.info('Successfully signed in using credentials in query-parameters');
      } else {
        console.info('Cannot sign in using credentials in query-parameters. Trying to sign up...');

        const res = await this.$api.signUpTemporary(this.username, this.password, null, null, this.id);
        if (res.ok_) {
          console.info('Successfully signed up using credentials in query-parameters');
          this.mode = QuestModes.fast;
        } else {
          this.$popups.error("Ошибка", "Не удалось создать нового пользователя для квеста");
          this.$router.push({name: 'default'});
          return;
        }
      }
    }
    await this.$store.dispatch('GET_USER');

    // Choose quest branch
    this.mode = Number(this.mode);

    if (this.id === undefined && this.uid === undefined) {
      this.$popups.error("Квест не найден", "Не указаны id или uid квеста");
      this.$router.push({name: 'default'});
      return;
    }
    await this.getQuestInfo();
    if (this.branchId !== undefined) {
      await this.selectBranch(this.branchId);
      return;
    }
    await this.getBranches();
    await this.selectBranch(this.branches[0].id);
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

    async selectBranch(branchId) {
      this.loading = true;
      const res = await this.$api.chooseBranch(this.id, branchId, this.mode);
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
  }
};
</script>
