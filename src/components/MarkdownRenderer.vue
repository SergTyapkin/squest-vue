<style lang="stylus">
@require '../styles/constants.styl'
@require '../styles/fonts.styl'

._markdown_renderer
  display block
  background colorShadowLight
  padding 20px
  font-small()

// Decoration for html tags inside messages
code-decoration-background = bgColor2
code-decoration-border-radius = 2px
blockquote-decoration-color = bgColor2
blockquote-decoration-width = 2px
blockquote-decoration-margin = 5px 0
blockquote-decoration-padding = 0 0 0 10px
blockquote-decoration-offset = 25px
list-decoration-margin = 5px 0
list-decoration-offset = 40px
list-decoration-color = bgColor2
p-decoration-margin = 15px 0
img-decoration-margin = 0

code
  font-family monospace
  background code-decoration-background
  border-radius(code-decoration-border-radius)

blockquote
  border-left blockquote-decoration-width blockquote-decoration-color solid
  margin blockquote-decoration-margin
  padding blockquote-decoration-padding
  margin-inline-start blockquote-decoration-offset

ul
  list-style-type disc
  margin list-decoration-margin
  padding-inline-start list-decoration-offset

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
  <div v-html="html" className="_markdown_renderer"></div>
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
