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
            { title: 'ПАРОЛЬ', autocomplete: 'on', jsonName: 'password', type: 'password', info: 'Забыл пароль? - пей таблетки', infoHref: base_url_path + `/password/restore`},
          ]"
          submit-text="Погнали"
          @submit="signIn"
    >Нужен аккаунт? <router-link :to="base_url_path + `/signup`" class="link">Создать</router-link>
    </Form>
    <div class="text-middle">ИЛИ</div>
    <Form ref="formEmailCode"
          title="Вход по одноразовому коду" description="Можно не вспоминать пароль, а просто открыть почту"
          :fields="[
            { title: 'E-mail', autocomplete: 'on', jsonName: 'email', disabled: emailSent},
            { title: 'Одноразовый код', autocomplete: 'on', jsonName: 'code', disabled: !emailSent},
          ]"
          :submit-text="emailSent ? 'Войти' : 'Выслать код'"
          @submit="signInByEmailCode"
    ></Form>
  </div>
</template>


<script>
import Form from "../../components/FormExtended.vue";

export default {
  components: {Form},

  data() {
    return {
      emailSent: false,

      base_url_path: this.$base_url_path,
    }
  },

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
        this.$refs.form.loading = true;
        await this.$store.dispatch('GET_USER');
        this.$refs.form.loading = false;
        this.$popups.success('Отличный вход!', 'Ну привет...');
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

      this.$popups.error("Не удалось войти в аккаунт", response.info || 'Произошла неизвестная ошибка!');
    },

    async signInByEmailCode({email, code}) {
      if (code.length === 0) {
        this.$refs.formEmailCode.loading = true;
        const response = await this.$api.sendSignInEmail(email);
        this.$refs.formEmailCode.loading = false;

        if (response.ok_) {
          this.$popups.success('Письмо выслано', 'Найдите одноразовый код на вашей почте');
          this.$refs.formEmailCode.errors = {};
          return;
        }

        if (response.status_ === 404) {
          this.$refs.form.errors.email = 'Email не зарегистрирован';
          this.$refs.form.showError();
          return;
        }

        this.$popups.error('Не удалось выслать код', response.info || 'Неизвестная ошибка');
        return;
      }

      this.$refs.formEmailCode.loading = true;
      const response = await this.$api.signInByEmailCode(email, code);
      this.$refs.formEmailCode.loading = false;

      if (response.ok_) {
        this.$refs.formEmailCode.loading = true;
        await this.$store.dispatch('GET_USER');
        this.$refs.formEmailCode.loading = false;
        this.$popups.success('Отличный вход!', 'Ну привет...');
        this.$refs.formEmailCode.errors = {};
        this.$router.push('/profile');
        return;
      }

      if (response.status_ === 401) {
        this.$refs.formEmailCode.errors.code = 'Неверный одноразовый код';
        this.$refs.form.showError();
        return;
      }

      this.$popups.error('Не удалось выслать код', response.info || 'Неизвестная ошибка');
    }
  }
}
</script>
