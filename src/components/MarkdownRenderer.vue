<style lang="stylus" scoped>
@require '../styles/constants.styl'

</style>

<template>
  <div v-html="html" class="link"></div>
</template>

<script>
import {marked} from "marked";
import {HtmlSanitizer} from "@jitbit/htmlsanitizer";

export default {
  props: {
    initialText: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      html: '',
      text: this.$props.initialText,
    }
  },

  mounted() {
    HtmlSanitizer.AllowedTags['AUDIO'] = true;
    HtmlSanitizer.AllowedTags['S'] = true;
    HtmlSanitizer.AllowedTags['DEL'] = true;

    if (this.text)
      this.update();
  },

  methods: {
    update(text) {
      if (text)
        this.text = text;

      const parsed = marked.parse(this.text, {breaks: true});
      this.html = HtmlSanitizer.SanitizeHtml(parsed);
    }
  }
};
</script>
