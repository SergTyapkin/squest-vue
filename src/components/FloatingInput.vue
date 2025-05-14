<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/fonts.styl'

input-bg = linear-gradient(20deg, rgba(45, 36, 13, 0.4) 0%, rgba(62, 39, 17, 0.6) 50%, rgba(38, 30, 11, 0.4) 100%) 50% 50% no-repeat

input-box-shadow = 0 0 15px 0 rgb(24, 19, 3) inset, 0 0 10px 0 rgba(162, 116, 14, 0.7)


.floating-input-fields
  position relative
  font-medium()
  input:not([type=checkbox]) + label
    font-medium-large()
    font-special()

    pointer-events none
    position absolute
    top 14px
    left 8px
    font-size 16px
    transition all 0.2s ease
  input:not([type=checkbox]):focus + label
  input:not([type=checkbox]):not(:placeholder-shown) + label
    top -16px
    left 4px
    font-size 14px
  input
    font-medium-small()

    margin-top 10px
    text-align center
  input:not([type=checkbox]).left
    text-align left
    border-left none
  input:not([type=checkbox]).right
    text-align right
    border-right none
.floating-input-fields.error
  .input-like
  input
    border-color error-color
    border-right none
  .error-text
    font-small()

    position absolute
    top -16px
    right 0

.floating-input-fields
  > div
    margin 20px 0
    transition all 0.3s ease
    > label
      font-small()
    > textarea
    > input[type=text]
    > input[type=password]
    > input[type=email]
      display block
      width 100%
      padding 10px
    .info
      margin 5px 0


@supports (-webkit-appearance: none) or (-moz-appearance: none)
  input[type=checkbox]
    --active colorYes
    --active-inner textColor1
    --focus 2px white
    --border textColor2
    --border-hover textColor1
    --background colorNo
    --disabled empColor3
    --disabled-inner #e1e6f9

    cursor pointer
    position relative
    display inline-block
    height 21px
    margin 0
    vertical-align top
    -webkit-appearance none
    -moz-appearance none
    background var(--b, var(--background))
    border 1px solid var(--bc, var(--border))
    outline none
    box-shadow 0 0 5px 0 black inset
    transition background 0.3s, border-color 0.3s, box-shadow 0.2s

  input[type=checkbox]:after
    content ""
    position absolute
    top 0
    left 0
    display block
    transition transform var(--d-t, 0.3s) var(--d-t-e, ease), opacity var(--d-o, 0.2s)

  input[type=checkbox]:checked
    --b var(--active)
    --d-o 0.3s
    --d-t 0.6s
    --d-t-e cubic-bezier(0.2, 0.85, 0.32, 1.2)

  input[type=checkbox]:disabled
    --b var(--disabled)

    cursor not-allowed
    opacity 0.9

  input[type=checkbox]:disabled:checked
    --b var(--disabled-inner)

  input[type=checkbox]:disabled + label
    cursor not-allowed

  input[type=checkbox]:hover:not(:checked):not(:disabled)
    --bc var(--border-hover)

  input[type=checkbox]:not(.switch)
    width 21px

  input[type=checkbox]:not(.switch):after
    opacity var(--o, 0)

  input[type=checkbox]:not(.switch):checked
    --o 1

  input[type=checkbox] + label
    cursor pointer
    display inline-block
    margin-left 4px
    font-size 14px
    line-height 21px
    vertical-align top


  input[type=checkbox]:not(.switch)
    border-radius 7px

  input[type=checkbox]:not(.switch):after
    top 4px
    left 7px
    transform rotate(var(--r, 20deg))
    width 5px
    height 9px
    border 2px solid var(--active-inner)
    border-top 0
    border-left 0

  input[type=checkbox]:not(.switch):checked
    --r 43deg

  input[type=checkbox].switch
    width 38px
    border-radius 11px

  input[type=checkbox].switch:after
    top 2px
    left 2px
    transform translateX(var(--x, 0))
    width 15px
    height 15px
    background var(--ab, var(--border))
    border-radius 50%

  input[type=checkbox].switch:checked
    --ab var(--active-inner)
    --x 17px

  input[type=checkbox].switch:disabled:not(:checked):after
    opacity 0.6
</style>

<template>
  <div :class="{error: error?.length}" class="floating-input-fields">
    <span class="error-text">{{ error }}</span>
    <input
      ref="input"
      :type="type"
      :autocomplete="autocomplete"
      placeholder=" "
      @input="updateVModel"
      :value="modelValue"
      :checked="modelValue"
      :disabled="disabled"
      :class="{
        left: textAlign === 'left',
        right: textAlign === 'right',
        switch: type === 'checkbox',
      }"
    >
    <label class="text-big-x">{{ title }}</label>
    <div class="info text-small-x">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  emits: ['change', 'update:modelValue'],

  props: {
    title: String,
    type: {
      default: "text"
    },
    autocomplete: {
      default: "off"
    },
    textAlign: {
      default: "left"
    },
    disabled: Boolean,
    info: String,

    modelValue: null,
    error: String,
  },

  methods: {
    updateVModel(event) {
      let value = event.target.value;
      if (this.type === 'checkbox')
        value = event.target.checked;
      this.$emit('update:modelValue', value);
      this.$emit('change');
    },

    focus() {
      this.$refs.input.focus();
    }
  }
};
</script>
