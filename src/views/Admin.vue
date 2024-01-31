<style lang="stylus" scoped>
@require '../styles/constants.styl'

.form-fullwidth
  margin-top 0
  max-width unset

textarea
  white-space pre-wrap
</style>

<template>
  <div>
    <TopButtons bg clickable arrows :buttons="[
        {name: 'В профиль', description: `Когда устранил весь кринж`, to: {name: 'profile'}},
    ]"></TopButtons>

    <Form class="form-fullwidth" ref="form" @submit="execute">
      <div class="info-container">
        <div class="text-big-xx">Админская страничка</div>
      </div>

      <CircleLoading v-if="loading"></CircleLoading>

      <div class="fields-container">
        <div id="sql-fields">
          <label class="text-big">Выполнить SQL</label>
          <div class="text-small">Вот сейчас спокойно, дыши, без DROP, DELETE и TRUNCATE, пожалуйста</div>
          <textarea rows=8 class="text-middle scrollable" v-model="sql"></textarea>

          <label class="text-big">Результат</label>
          <textarea rows=4 class="text-middle scrollable" :value="result" disabled></textarea>
          <input type="submit" value="Выполнить">
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
import Form from "../components/Form.vue";
import TopButtons from "../components/TopButtons.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";


export default {
  components: { CircleLoading, TopButtons, Form },

  data() {
    return {
      sql: '',
      result: '',

      loading: false,
    }
  },

  mounted() {
    if (!this.$user.isAdmin) {
      this.$popups.error("Ты не админ", "Не влезай, убьёт");
      this.$router.push({name: 'profile'});
    }
  },

  methods: {
    async execute() {
      console.log(this.result);
      console.log(this.sql);
      this.loading = true;
      const res = await this.$api.executeAdminSql(this.sql);
      this.loading = false;

      console.log(res);
      if (res.ok_) {
        this.$popups.success(res.status_, res.info);
        this.$refs.form.showSuccess();

        this.result = '[';
        res.response.forEach(row => {
          this.result += '\r\n\t{';
          for (const key in row) {
            this.result += `\r\n\t\t${key}: ${row[key]},`;
          }
          this.result += '\r\n\t},';
        });
        this.result += '\r\n]';
        return;
      }

      if (res.status_ === 500) {
        this.$popups.error(`Ошибка ${res.status_}!`, res.info, 10000);
        this.$refs.form.showError();
        return;
      }
      this.$popups.error(`Ошибка ${res.status_}!`, res.info, 10000);
    },
  }
};
</script>
