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
        {name: 'На главную', description: `Не стесняйся, проходи`, to: `/`},
    ]"></TopButtons>

    <Form class="form-fullwidth" ref="form">
      <div class="info-container">
        <div class="text-big-xx">Ты нашёл QR!</div>
      </div>

      <CircleLoading v-if="loading"></CircleLoading>

      <div class="text-big">Но так низя(</div>
      <div class="text-small">
        Кажется, этот QR является ответом на один из вопросов какого-то квеста. <br>
        Вот только чтобы он сработал, его нужно отсканировать не каким-то другим сканером, а сканером прямо со страницы с вопросом. <br>
        Что ж, удачи) А если ты нашёл этот QR случайно, то жми на кнопку выше - там всё расскажут
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
      this.$router.push('/profile');
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
