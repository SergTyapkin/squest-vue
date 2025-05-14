<style lang="stylus" scoped>
  @import '../../styles/constants.styl'

  close-btn-size = 20px

  .modal
    position fixed
    z-index 999
    top 0
    left 0
    width 100%
    height 100vh

    .modal-background
      position fixed
      top 0
      left 0
      width 100%
      height 100vh
      background-color #000000aa

    .form
      position relative

      .confirm-button
        display inline-block
        width 45%
        margin-right 2.5%
        margin-left 2.5%

      .close-btn
        cursor pointer
        position absolute
        top 10px
        right 20px
        width close-btn-size
        height close-btn-size
        color textColor2
        text-shadow textColor2
        transition all 0.2s ease
      .close-btn:hover
        transform scale(1.1)
        color textColor1
        text-shadow textColor1
</style>

<template>
  <div class="modal" v-show="isShowed" @keydown.enter.prevent="__resolve(true)" @keydown.esc="__resolve(false)">
    <div class="modal-background" @click="__resolve(false)" />

    <div class="form" ref="form">
      <span class="close-btn" @click="__resolve(false)">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" /></svg>
      </span>

      <div class="info-container">
        <div class="title text-big-x">{{ title }}</div>
        <div class="description text-small">{{ description }}</div>
      </div>

      <div class="fields-container">
        <div v-if="type === 'prompt'" class="form-group">
          <FloatingInput type="text" v-model="text" ref="inputText" class="form-control" />
        </div>
      </div>

      <div class="submit-container submit-buttons">
        <div class="form-group">
          <input type="submit" @click="__resolve()" v-if="type !== 'confirm'" ref="buttonOk" value="Ок">
          <div v-else class="confirm-buttons">
            <input type="submit" @click="__resolve(true)" class="confirm-button" ref="buttonYes" value="Да">
            <input type="submit" @click="__resolve(false)" class="confirm-button btn-danger" value="Нет">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FloatingInput from "../FloatingInput.vue";
  export default {
    components: {FloatingInput},
    data() {
      return {
        type: "",
        title: "",
        description: "",
        isShowed: false,
        text: "",
      };
    },

    unmounted() {
      this.isShowed = false;
    },

    methods: {
      async __createModal(title, description = '', type='alert') {
        this.type = type;
        this.title = title;
        this.description = description;

        if (this.isShowed) {
          return this.promise;
        }
        this.isShowed = true;

        await this.$nextTick();

        if (this.type === 'confirm') {
          this.$refs.buttonYes.focus();
        } else if (this.type === 'prompt') {
          this.$refs.inputText.focus();
        } else {
          this.$refs.buttonOk.focus();
        }

        const promise = new Promise((resolve) => {
          this.resolvePromise = resolve;
        });
        this.promise = promise;

        return promise;
      },
      __resolve(result) {
        if (!this.isShowed) {
          return
        }

        if (this.type !== 'confirm') {
          if (result === false) {
            result = null
          } else {
            result = this.text
          }
        }

        this.resolvePromise(result);
        this.isShowed = false;
        this.text = '';
      },

      prompt(title, description, defaultText) {
        this.text = defaultText;
        return this.__createModal(title, description, 'prompt');
      },
      confirm(title, description) {
        return this.__createModal(title, description, 'confirm');
      },
      alert(title, description) {
        return this.__createModal(title, description, 'alert');
      },
    }
  }
</script>
