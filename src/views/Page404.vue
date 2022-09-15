<template>
  <Form title="Ошибка 404" description="Страница не найдена" no-submit>
    <router-link :to="`/profile`" class="title">На главную</router-link>
  </Form>
</template>

<script>
import Form from "../components/FormExtended.vue";

export default {
  components: {Form},
}
</script>
