<style lang="stylus" scoped>
@require '../styles/constants.styl'

</style>

<template>
</template>

<script>
export default {
  emits: ['save'],

  components: {},

  props: {
  },

  data() {
    return {
    }
  },

  mounted() {
    window.addEventListener('keydown', this.checkKey);
  },
  unmounted() {
    window.removeEventListener('keydown', this.checkKey);
  },

  methods: {
    checkKey(e) {
      if (e.key === 'Enter' && e.ctrlKey) {
        this.$emit('save');
      }
    },
  }
};
</script>
