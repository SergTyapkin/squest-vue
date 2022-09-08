<style lang="stylus" scoped>
@require '../styles/constants.styl'

input-box-shadow = 0 0 15px 0 rgb(24, 19, 3) inset, 0 0 10px 0 rgba(162, 116, 14, 0.7)
input-bg = linear-gradient(20deg, rgba(45, 36, 13, 0.4) 0%, rgba(62, 39, 17, 0.6) 50%, rgba(38, 30, 11, 0.4) 100%) 50% 50% no-repeat


// Floating placeholders
.input-like
input
  all unset
  width 100%
  padding 4px 10px
  color textColor1
  border-bottom 1px solid border-color
  box-sizing border-box
  transition all 0.2s
  font-size 16px
  font-family Arial

.floating-input-fields
  position relative
  input + label
    position absolute
    top 12px
    left 8px
    transition all 0.2s ease
    font-size 16px
    pointer-events none
  input:focus + label
  input:not(:placeholder-shown) + label
    top -16px
    left 4px
    font-size 14px
  input.left
    text-align left
  input.right
    text-align right
.floating-input-fields.error
  .input-like
  input
    border-color error-color
  .error-text
    margin-left 80px

.floating-input-fields
  > div
    margin 20px 0
    transition all 0.3s ease
    > label
      font-family Arial, monospace
    > textarea,
    > input[type=text]
    > input[type=password],
    > input[type=email],
      display block
      width 100%
      padding 10px
    .info
      margin 5px 0

  textarea
  input
  .input-area
    padding 10px
    font-size 1rem
    color textColor1
    border 1px solid colorShadow
    transition all 0.3s ease
    border-radius 3px
    box-sizing border-box
    background input-bg
    box-shadow input-box-shadow

  textarea:focus
  input[type=text]:focus
  input[type=email]:focus
  input[type=password]:focus
    outline 0
    border-color empColor1
    box-shadow  0 0 10px 0 rgb(179, 139, 38) inset, 0 0 15px 0 rgba(162, 116, 14, 0.8)

</style>

<template>
  <div :class="{error: error?.length}" class="floating-input-fields">
    <span class="error-text">{{ error }}</span>
    <input ref="input" :type="type" :autocomplete="autocomplete" placeholder=" " @input="updateVModel" :value="modelValue"
      :class="{left: textAlign === 'left', right: textAlign === 'right'}">
    <label class="text-big-xx">{{ title }}</label>
    <div class="info text-small-x">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    type: {
      default: "text"
    },
    autocomplete: {
      default: "off"
    },
    textAlign: {
      default: "center"
    },
    info: String,

    modelValue: null,
    error: String,
  },

  methods: {
    updateVModel(event) {
      this.$emit('update:modelValue', event.target.value);
    },

    focus() {
      this.$refs.input.focus();
    }
  }
};
</script>
