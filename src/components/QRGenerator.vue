<style lang="stylus" scoped>
@require '../styles/constants.styl'

.qr-generator
  max-width 400px
.qr-image
  width 100%
  max-height 400px
.invert
  filter invert(1)
</style>

<template>
  <div class="qr-generator">
    <div class="text-middle">Закодировано: {{ text }}</div>
    <div ref="qr" v-html="html" class="qr-image" :class="{invert}"></div>
    <label>Размер</label>
    <input type="range" min="1" max="3" step="1" v-model="size" @input="onInput">
    <label>Черный</label>
    <FloatingInput type="checkbox" v-model="invert"></FloatingInput>
  </div>
</template>

<script>
import qrcode from "qrcode-generator-es6";
import FloatingInput from "./FloatingInput.vue";

export default {
  components: {FloatingInput},
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

      size: 0,
      errorCorrectionLevel: this.$props.errorCorrectionLevel,
      invert: false,
    };
  },

  mounted() {
    this.create()
  },

  unmounted() {
    this.destroy();
  },


  methods: {
    create() {
      this._qr = new qrcode(0, this.errorCorrectionLevel);
      if (this.text)
        this.generate();
    },
    destroy() {
      delete this._qr;
      this._qr = null;
    },


    generate(text) {
      if (text)
        this.text = text;
      this._qr.addData(this.text);
      this._qr.make();
      this.html = this._qr.createSvgTag({});
    },

    clear() {
      this.html = '';
    },

    onInput() {
      if (this.size === '1')
        this.errorCorrectionLevel = 'L';
      else if (this.size === '2')
        this.errorCorrectionLevel = 'M';
      else if (this.size === '3')
        this.errorCorrectionLevel = 'H';
      this.destroy();
      this.create();
    }
  }
};
</script>
