<style lang="stylus">
logo-size = 140px

.form
  .logo
    width logo-size
    margin-bottom 20px

.text-centered
  margin 10px 0
  text-align center
</style>


<template>
  <div>
    <Form
      v-if="!loginByCode"
      ref="form"
      title="Вход"
      description="Ну давай, вспомни пароль, войди в меня"
      :fields="[
        { title: 'ЛОГИН или E-MAIL', autocomplete: 'on', jsonName: 'username' },
        { title: 'ПАРОЛЬ', autocomplete: 'on', jsonName: 'password', type: 'password', info: 'Забыл пароль? - пей таблетки', infoHref: {name: 'password-restore'}},
      ]"
      submit-text="Погнали"
      @submit="signIn"
    >
      Нужен аккаунт? <router-link :to="{name: 'signup'}" class="link">Создать</router-link>

      <div class="text-small text-centered">или</div>
      <div class="button rounded" @click="loginByCode = true">Войти по коду</div>
    </Form>

    <Form
      v-else
      ref="formEmail"
      title="Вход по коду"
      description="Можно не вспоминать пароль, а просто открыть почту"
      :fields="[
        { title: 'E-mail', autocomplete: 'on', jsonName: 'email'},
      ]"
      submit-text="Выслать код"
      @submit="signInByEmailCodeSendEmail"
    >
      <Form
        :no-bg="true"
        ref="formCode"
        :fields="[
          { title: 'Одноразовый код', jsonName: 'code'},
        ]"
        submit-text="Войти"
        @submit="signInByEmailCode"
      />
      <div class="text-small text-centered">или</div>
      <div class="button rounded" @click="loginByCode = false">Войти по паролю</div>
    </Form>
  </div>
</template>


<script>
import Form from "../../components/FormExtended.vue";
import FloatingInput from "../../components/FloatingInput.vue";

export default {
  components: {FloatingInput, Form},

  data() {
    return {
      loginByCode: false,
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
    validateEmail(email) {
      let ok = true;
      if (email.length === 0) {
        this.$refs.formEmail.errors.email = 'E-mail не может быть пустым';
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
        // this.$popups.success('Отличный вход!', 'Ну привет...');
        this.$refs.form.errors = {};
        this.$router.push({name: 'profile'});
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

    async signInByEmailCodeSendEmail({email}) {
      if (!this.validateEmail(email))
        return;

      this.$refs.formEmail.loading = true;
      const response = await this.$api.sendSignInEmail(email);
      this.$refs.formEmail.loading = false;

      if (response.ok_) {
        this.$popups.success('Письмо выслано', 'Найдите одноразовый код на вашей почте');
        this.$refs.formEmail.errors = {};
        return;
      }

      if (response.status_ === 404) {
        this.$refs.formEmail.errors.email = 'E-mail не зарегистрирован';
        this.$refs.formEmail.showError();
        return;
      }

      if (response.status_ === 403) {
        this.$refs.formEmail.errors.email = 'E-mail не подтвержден в аккаунте';
        this.$refs.formEmail.showError();
        return;
      }

      this.$popups.error('Не удалось выслать код', response.info || 'Неизвестная ошибка');
    },

    async signInByEmailCode({code}) {
      const email = this.$refs.formEmail.values.email
      if (!this.validateEmail(email))
        return;

      this.$refs.formCode.loading = true;
      const response = await this.$api.signInByEmailCode(email, code);
      this.$refs.formCode.loading = false;

      if (response.ok_) {
        this.$refs.formCode.loading = true;
        await this.$store.dispatch('GET_USER');
        this.$refs.formCode.loading = false;
        this.$popups.success('Отличный вход!', 'Ну привет...');
        this.$refs.formCode.errors = {};
        this.$router.push({name: 'profile'});
        return;
      }

      if (response.status_ === 401) {
        this.$refs.formCode.errors.code = 'Неверный одноразовый код';
        this.$refs.formCode.showError();
        return;
      }

      this.$popups.error('Не удалось выслать код', response.info || 'Неизвестная ошибка');
    }
  }
}
</script>
