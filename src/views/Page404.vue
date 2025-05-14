<style lang="stylus" scoped>
  .form
    position absolute
    top 30%
    left 50%
    transform translate(-50%, -50%)
</style>

<template>
  <Form class="form" title="Ошибка 404" description="Страница не найдена" no-submit>
    <router-link :to="{name: 'profile'}" class="title">На главную</router-link>
  </Form>
</template>

<script>
import Form from "../components/FormExtended.vue";

export default {
  components: {Form},

  data() {
    return {
    }
  }
}
</script>
