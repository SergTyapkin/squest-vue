<style lang="stylus" scoped>
@require '../styles/constants.styl'

</style>

<template>
  <Form @submit="submit" ref="form" :class="{'no-bg': noBg}">
    <div class="info-container">
      <div class="text-big-xx">{{ title }}</div>
      <div class="text-small">{{ description }}</div>
    </div>

    <div class="fields-container">
      <div class="form-info text-middle">{{ info }}</div>
      <FloatingInput v-for="field in fields"
                     :title="field.title"
                     :autocomplete="field.autocomplete"
                     :type="field.type"
                     :error="errors[field.jsonName]"
                     v-model="values[field.jsonName]"
      >{{ field.info }}
      </FloatingInput>
    </div>

    <div class="submit-container" v-if="!noSubmit">
      <input v-if="!loading" type="submit" :value="submitText">
      <CircleLoading v-else></CircleLoading>
    </div>

    <div class="text-small info">
      <slot></slot>
    </div>
  </Form>
</template>

<script>
import Form from "./Form.vue";
import FloatingInput from "./FloatingInput.vue";
import CircleLoading from './loaders/CircleLoading.vue';
import {setTimedClass} from "../utils/utils";

export default {
  components: {FloatingInput, CircleLoading, Form},
  emits: ['submit'],

  props: {
    title: {
      type: String,
    },
    description: {
      type: String,
    },

    fields: {
      type: Array,
      default: []
    },

    submitText: {
      type: String,
    },
    submitInfo: {
      type: String,
    },

    noBg: {
      type: Boolean,
      default: false
    },
    noSubmit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      info: '',
      errors: {},
      values: {}
    };
  },

  mounted() {
    for (const field of this.fields) {
      this.values[field.jsonName] = '';
      this.errors[field.jsonName] = '';
    }
  },

  methods: {
    submit() {
      this.$emit('submit', this.values);
    },

    showError() {
      this.$refs.form.info = this.info;
      this.$refs.form.showError();
    },

    showSuccess() {
      this.$refs.form.info = this.info;
      this.$refs.form.showSuccess();
    },
  }
};
</script>
