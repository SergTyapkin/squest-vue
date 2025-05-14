<style lang="stylus">
  @import '../../styles/constants.styl'
  @import '../../styles/fonts.styl'

  borderRadius = 2px
  clBgPrimaryAlert = #d9d23f
  clBgPrimaryError = #e54d42

  clBgPrimarySuccess = #28a745
  clBgSecondaryAlert = #b89f24
  clBgSecondaryError = #b82e24
  clBgSecondarySuccess = #218838

  indent = 15px
  innerPadding = 10px

  messageWidth = 225px
  titleMargin = 5px

  .popup-messages
    position fixed
    z-index 1000
    top indent
    right indent
    width messageWidth
    font-medium-small()
    .popup-message
      overflow hidden
      box-sizing content-box
      margin-bottom indent
      padding innerPadding
      color textColor1
      opacity 1
      border-radius borderRadius
      .title
        padding-bottom titleMargin
    .popup-message
      background-color clBgPrimarySuccess
      border-left 5px solid clBgSecondarySuccess
    .popup-message.error
      background-color clBgPrimaryError
      border-left-color clBgSecondaryError
    .popup-message.alert
      background-color clBgPrimaryAlert
      border-left-color clBgSecondaryAlert
    .popup-message._transitionOpacity
      opacity 0.3
      transition opacity 1s ease
    .popup-message._transitionHeight
      height 0
      margin 0
      padding 0
      opacity 0
      transition all 0.3s ease
</style>

<template>
  <div class="popup-messages" />
</template>

<script>
  import {getChildrenHeight} from "/src/utils/utils";

  const DEFAULT_DISSAPPEAR_AFTER_MS = 3000;
  const DEFAULT_TRANSITION_OPACITY_TIME_MS = 500;
  const DEFAULT_TRANSITION_HEIGHT_TIME_MS = 300;

  export default {
    data() {
      return {
        messages: [],
      };
    },

    methods: {
      async __addMessage(title, message, cls, disappearTime) {
        const el = document.createElement('div');
        el.classList.add('popup-message', cls);
        el.innerHTML = `<div class="title"><strong>${title}</strong></div>
                        <div class="message">${message}</div>`
        this.$el.append(el);
        el.style.height = getChildrenHeight(el) + 'px';

        setTimeout(() => {
          el.classList.add('_transitionOpacity');
          setTimeout(() => {
            el.classList.add('_transitionHeight');
            el.style.removeProperty('height');
            setTimeout(() => {
              el.remove();
            }, DEFAULT_TRANSITION_HEIGHT_TIME_MS);
          }, DEFAULT_TRANSITION_OPACITY_TIME_MS);
        }, disappearTime);
      },

      success(title, message = '', time = DEFAULT_DISSAPPEAR_AFTER_MS) {
        this.__addMessage(title, message, 'success', time);
      },

      alert(title, message = '', time = DEFAULT_DISSAPPEAR_AFTER_MS) {
        this.__addMessage(title, message, 'alert', time);
      },

      error(title, message = '', time = DEFAULT_DISSAPPEAR_AFTER_MS) {
        this.__addMessage(title, message, 'error', time);
      }
    }
  }
</script>
