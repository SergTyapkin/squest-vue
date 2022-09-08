<style lang="stylus" scoped>
@require '../styles/constants.styl'


</style>

<template>
  <div ref="qr" v-html="html"></div>
</template>

<script>
import qrcode from "qrcode-generator-es6";

export default {
  emits: ['scan'],

  props: {
    closed: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      _qr: null,
      html: '',
    };
  },

  mounted() {
    this._qr = new qrcode(0, 'H');
  },

  unmounted() {
    delete this._qr;
  },

  methods: {
    generate(text) {
      this._qr.addData(text);
      this._qr.make();
      this.html = this._qr.createSvgTag({});
    },

    clear() {
      this.html = '';
    },
  }
};
</script>
