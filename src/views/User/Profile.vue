<style lang="stylus" scoped>
@require '../../styles/constants.styl'

borderColorInputs = textColor5
borderColorInputsFocus = textColor2

input-box-shadow = 0 0 15px 0 rgb(24, 19, 3) inset, 0 0 10px 0 rgba(162, 116, 14, 0.7)
input-bg = linear-gradient(20deg, rgba(45, 36, 13, 0.4) 0%, rgba(62, 39, 17, 0.6) 50%, rgba(38, 30, 11, 0.4) 100%) 50% 50% no-repeat


hr
  margin 0

.profile-plate
  margin-top 50px
  margin-left auto
  margin-right auto
  padding 40px 30px
  width 100%
  max-width 460px
  border-radius 150px 150px 10px 10px / 100px 100px 10px 10px
  background linear-gradient(20deg, rgba(84, 67, 24, 0) 0%, rgb(88, 58, 24) 50%, rgba(84, 67, 24, 0) 100%) 50% 50% no-repeat
  box-shadow 0 0 10px 0 rgba(162, 116, 14, 0.7), 0 0 15px 0 rgba(34, 28, 4, 0.4) inset

  .info-container
    > *
      display flex
      justify-content space-between
      width 100%
      text-align center
    .rating
    .position
      flex 1
      height 80px
      line-height 80px
      font-size 30px
    .avatar
      width 80px
      height 80px
      border textColor1 1px solid
      border-radius 50%

    .username
      margin-top 5px
      background none
      outline none
      border none
      transition all 0.2s ease
      padding 5px
    .username:focus
      box-shadow input-box-shadow

  .quest-statistics
    .quest
      height 40px
      line-height 40px


input[type=submit]
input[type=button]
input[type=submit]
  all unset
  width 100%
  color textColor1
  box-sizing border-box
  font-family Arial
  padding 10px
  font-size 1rem
  border 1px solid colorShadow
  border-bottom 1px solid border-color
  border-radius 3px
  background input-bg
  box-shadow input-box-shadow
  background linear-gradient(20deg, rgba(45, 36, 13, 0.4) 0%, rgba(90, 56, 25, 0.7) 50%, rgba(55, 43, 16, 0.4) 100%) 50% 50% no-repeat
  text-align center
  border-color empColor3
  cursor pointer
  transition all 0.2s ease
input[type=button]:hover
input[type=submit]:hover
  box-shadow inset 0 0 20px rgb(195, 162, 127), 0 0 15px rgb(255, 235, 164)

.logout
  width 100%
  margin-top 20px

.fields-container
  margin-top 30px
</style>

<template>
  <div>
    <div class="profile-page">
      <TopButtons arrows clickable :buttons="[
          {name: 'В игру', to: '/play'},
          {name: 'Мои квесты', to: '/quests/my'},
          {name: 'Рейтинг', to: '/ratings'},
      ]"></TopButtons>

      <div class="profile-plate">
        <div>
          <div class="info-container">
            <div>
              <span class="rating">★ {{ $user.rating }}</span>
              <img class="avatar" :src="$user.avatarUrl" alt="avatar">
              <span class="position"># {{ $user.ratingPosition }}</span>
            </div>
            <input class="username text-big" v-model="username">
          </div>

          <hr>

          <div class="quest-statistics text-middle">
            <div class="quest">Пройдено квестов: {{ finishedQuests }}</div>
            <div class="quest">Создано квестов: {{ createdQuests }}</div>
          </div>

          <hr>

          <span class="text-small" v-if="$user.chosenQuest && $user.chosenBranch">Сейчас играет в: {{ $user.chosenQuest }} - {{ $user.chosenBranch }}</span>

          <Form ref="form" no-bg
                :fields="[
                  { title: 'ТВОЁ ИМЯ', jsonName: 'name' },
                  { title: 'ТВОЙ E-mail', jsonName: 'email', type: 'email'},
                ]"
                submit-text="Изменить данные"
                @submit="changeData"
          ></Form>
        </div>

        <div ref="passwordFormContainer" class="roll-active closed">
          <Form ref="passwordForm" no-bg no-submit
                :fields="[
                    { title: 'Старый пароль', jsonName: 'oldPassword', type: 'password'},
                    { title: 'Новый пароль', jsonName: 'newPassword', type: 'password'},
                    { title: 'Новый пароль ещё раз', jsonName: 'newPasswordConfirm', type: 'password'},
                  ]"
                submit-text="Сменить пароль"
                @submit="changePassword"
          ></Form>
        </div>
        <div id="" class="submit-container" @click.prevent="clickOnChangePassword">
          <input type="submit" value="Сменить пароль">
        </div>

        <button class="text-middle button bg outline rounded logout" @click="logOut">Выйти</button>
      </div>

      <router-link to="/admin" class="text-big-x button rounded outline centered-horizontal hidden">На админскую</router-link>
    </div>
  </div>
</template>


<script>
import TopBar from "/src/components/TopBar.vue";
import Form from "/src/components/Form.vue";
import FloatingInput from "../../components/FloatingInput.vue";
import {isClosedRoll, openRoll} from "../../utils/show-hide";
import TopButtons from "../../components/TopButtons.vue";

export default {
  components: {TopButtons, FloatingInput, TopBar, Form},
  data() {
    return {
      username: '',
    }
  },

  async mounted() {
    this.$refs.form.values = this.$user;
    this.username = this.$user.username;
  },

  methods: {
    validate(username, name, email) {
      let ok = true;
      if (username.length === 0) {
        this.$refs.form.errors.username = 'Логин не может быть пустым';
        ok = false;
      }
      if (name.length === 0) {
        this.$refs.form.errors.name = 'Имя не может быть пустым';
        ok = false;
      }
      if (email.length === 0) {
        this.$refs.form.errors.email = 'Email не может быть пустым';
        ok = false;
      }
      return ok;
    },

    async changeData({name, email}) {
      const username = this.username;
      if (!this.validate(username, name, email))
        return;

      this.$refs.form.loading = true;
      const response = await this.$api.updateUser(email, username, name);
      this.$refs.form.loading = false;

      if (response.ok_) {
        await this.$store.dispatch('GET_USER');
        this.$popups.success('Данные обновлены');
        this.$refs.form.errors = {};
        return;
      }

      if (response.status_ === 409) {
        this.$refs.form.errors.username = 'Такой логин уже занят';
        this.$refs.form.errors.email = 'Или e-mail уже занят';
      } else {
        this.$popups.error("Не удалось обновить данные", 'Произошла неизвестная ошибка!');
      }
    },

    clickOnChangePassword() {
      if (isClosedRoll(this.$refs.passwordFormContainer)) {
        openRoll(this.$refs.passwordFormContainer);
        return;
      }
      this.changePassword(this.$refs.passwordForm.values);
    },

    async changePassword({oldPassword, newPassword, newPasswordConfirm}) {
      if (newPassword !== newPasswordConfirm) {
        this.$refs.passwordForm.errors.newPasswordConfirm = this.errors.newPassword = 'Пароли не совпадают';
        return;
      }

      this.$refs.passwordForm.loading = true;
      const response = await this.$api.updatePassword(oldPassword, newPassword);
      this.$refs.passwordForm.loading = false;

      if (response.ok_) {
        this.$popups.success('Изменено', 'Пароль успешно изменён');
        this.$refs.passwordForm.errors = {};
        return;
      }

      if (response.status_ === 401) {
        this.$refs.passwordForm.info = 'Пароль не подходит';
        this.$refs.passwordForm.errors.oldPassword = 'Старый пароль не такой';
        this.$refs.passwordForm.showError();
        return;
      }

      this.$popups.error('Не получилось сменить пароль', 'Неизвестная ошибка');
    },

    async logOut() {
      const response = await this.$api.signOut();
      if (!response.ok_) {
        this.$popups.error('Не получилось выйти из аккаунта', 'Неизвестная ошибка');
        return;
      }
      this.$user.setDefault();
      await this.$router.push('/');
    },
  }
}
</script>
