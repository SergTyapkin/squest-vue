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
    text: String,
    errorCorrectionLevel: {
      type: String,
      default: 'L',
    }
  },

  data() {
    return {
      _qr: null,
      html: '',
      text: this.$props.text,
    };
  },

  mounted() {
    this._qr = new qrcode(0, this.errorCorrectionLevel);
    if (this.text)
      this.generate();
  },

  unmounted() {
    delete this._qr;
  },

  methods: {
    generate(text) {
      if (text)
        this.text = text;
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
