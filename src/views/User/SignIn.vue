<style lang="stylus">
logo-size = 140px

.form
  .logo
    width logo-size
    margin-bottom 20px
</style>


<template>
  <div>
    <Form ref="form"
          title="Вход" description="Ну давай, вспомни пароль, войди в меня"
          :fields="[
            { title: 'ЛОГИН', autocomplete: 'on', jsonName: 'username' },
            { title: 'ПАРОЛЬ', autocomplete: 'on', jsonName: 'password', type: 'password', info: 'Забыл пароль? - пей таблетки'},
          ]"
          submit-text="Погнали"
          @submit="signIn"
    >Нужен аккаунт? <router-link to='/signup' class="link">Создать</router-link>
    </Form>
  </div>
</template>


<script>
import Form from "../../components/FormExtended.vue";

export default {
  components: {Form},

  methods: {
    validate(username, password) {
      let ok = true;
      if (username.length === 0) {
        this.$refs.form.errors.username = 'Логин не может быть пустым';
        ok = false;
      }
      if (password.length === 0) {
        this.$refs.form.errors.password = 'Пароль не может быть пустым';
        ok = false;
      }
      return ok;
    },

    async signIn({username, password}) {
      if (!this.validate(username, password))
        return;

      this.$refs.form.loading = true;
      const response = await this.$api.signIn(username, password);
      this.$refs.form.loading = false;

      if (response.ok_) {
        await this.$store.dispatch('GET_USER');
        this.$popups.success('Прекрасно входит...', 'и замечательно выходит');
        this.$refs.form.errors = {};
        this.$router.push('/profile');
        return;
      }

      if (response.status_ === 401) {
        this.$refs.form.info = 'Неверный логин или пароль';
        this.$refs.form.errors.username = 'Неверный логин или пароль';
        this.$refs.form.errors.password = 'Неверный логин или пароль';
        this.$refs.form.showError();
        return;
      }

      this.$popups.error("Не удалось войти в аккаунт", 'Произошла неизвестная ошибка!');
    },
  }
}
</script>
