<style lang="stylus" scoped>
@require '../styles/constants.styl'

</style>

<template>
  <div v-html="html"></div>
</template>

<script>
import {marked} from "marked";
import {HtmlSanitizer} from "@jitbit/htmlsanitizer";

export default {
  props: {
    text: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      html: '',
      text: this.$props.text,
    }
  },

  mounted() {
    if (this.text)
      this.update();
  },

  methods: {
    update(text) {
      if (text)
        this.text = text;
      HtmlSanitizer.AllowedTags['AUDIO'] = true;
      HtmlSanitizer.AllowedTags['S'] = true;
      this.html = HtmlSanitizer.SanitizeHtml(marked.parse(this.text, {breaks: true}));
    }
  }
};
</script>
