<style lang="stylus" scoped>
@import '../styles/constants.styl'

.form-fullwidth
  max-width unset
  margin-top 0

textarea
  white-space pre-wrap
</style>

<template>
  <div>
    <TopButtons
      bg
      clickable
      arrows
      :buttons="[
        {name: 'На главную', description: `Не стесняйся, проходи`, to: {name: 'default'}},
      ]"
    />

    <Form class="form-fullwidth" ref="form">
      <div class="info-container">
        <div class="text-big-xx">Ты нашёл QR!</div>
      </div>

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


export default {
  components: { TopButtons, Form },

  data() {
    return {
    }
  }
};
</script>
