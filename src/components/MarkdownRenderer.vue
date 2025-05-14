<style lang="stylus">
@import '../styles/constants.styl'
@import '../styles/fonts.styl'

blockquote-decoration-color = bgColor2
blockquote-decoration-margin = 5px 0
blockquote-decoration-offset = 25px
blockquote-decoration-padding = 0 0 0 10px
blockquote-decoration-width = 2px

// Decoration for html tags inside messages
code-decoration-background = bgColor2
code-decoration-border-radius = 2px
img-decoration-margin = 0
list-decoration-color = bgColor2
list-decoration-margin = 5px 0
list-decoration-offset = 40px
p-decoration-margin = 15px 0

._markdown_renderer
  display block
  padding 20px
  background colorShadowLight
  font-small()

code
  font-family monospace
  background code-decoration-background
  border-radius(code-decoration-border-radius)

blockquote
  margin blockquote-decoration-margin
  margin-inline-start blockquote-decoration-offset
  padding blockquote-decoration-padding
  border-left blockquote-decoration-width blockquote-decoration-color solid

ul
  margin list-decoration-margin
  padding-inline-start list-decoration-offset
  list-style-type disc

  li::marker
    color list-decoration-color

p
  margin p-decoration-margin

  &:last-child
    margin-bottom 0

  &:first-child
    margin-top 0

img
  max-width 100%
  margin img-decoration-margin
</style>

<template>
  <div v-html="html" className="_markdown_renderer" />
</template>

<script>
import {marked} from "marked";
import sanitizeHtml from 'sanitize-html';


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
      sanitizeOptions: {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['audio', 'video', 'img', 's', 'del', 'b', 'i', 'em', 'strong', 'a', 'iframe', 'code']),
        allowedIframeHostnames: ['www.youtube.com', 'www.tiktok.com', 'instagram.com', 'facebook.com', 'dailymotion.com', 'hulu.com', 'www.crunchyroll.com', 'www.netflix.com', 'vimeo.com', 'kinescope.io', '9gag.com', 'www.twitch.tv', 'www.veoh.com'],
        allowedAttributes:  Object.assign(sanitizeHtml.defaults.allowedAttributes, {
          'img': ['src', 'alt', 'title'],
          'audio': ['src', 'controls', 'autoplay', 'loop', 'muted'],
          'video': ['src', 'controls', 'controlslist', 'disablepictureinpicture', 'disableremoteplayback', 'width', 'height', 'poster', 'playsinline', 'loop', 'muted'],
          'a': ['href'],
          'iframe': ['src', 'width', 'height', 'allow', 'allowfullscreen', 'title', 'frameborder'],
        }),
      }
    }
  },

  mounted() {
    if (this.text)
      this.update();
  },

  methods: {
    update(text) {
      if (text !== undefined)
        this.text = text;

      const parsed = marked.parse(this.text, {breaks: true});
      this.html = sanitizeHtml(parsed, this.sanitizeOptions);
    }
  }
};
</script>
