<style lang="stylus" scoped>
@import '../../styles/constants.styl'

li
  display flex
  justify-content space-between
  margin-top 10px
  margin-bottom 10px

  :last-child
    margin-bottom 0
  :first-child
    margin-top 0

  > input
    float left
    flex 1
    box-sizing border-box
    width 100%
    padding 10px
    border-left none
  > .radio
    margin-right 5px
    margin-left 20px
  > .button
    float right
    overflow hidden
    display flex
    align-content center
    justify-content center
    box-sizing border-box
    height 40px
    opacity 1
    transition all 0.3s ease
    .arrow.right
      margin-left 5px
  > :last-child
    width 20%
    margin-left 0
  > :not(:last-child)
    margin-right 20px
  > .closed
    pointer-events none
    width 0
    margin-right 0
    margin-left 0
    padding-right 0
    padding-left 0
    opacity 0
  > .orderid
    display flex
    align-items center
    margin-right 5px
  > .move-buttons
    > .button
      padding 0 15px
li:first-child
  > .move-buttons
    > .button:first-child
      pointer-events none
      opacity 0.2
li.last-child
  > .move-buttons
    > .button:last-child
      pointer-events none
      opacity 0.2

@media ({mobile})
  li
    > .orderid
      font-size 20px
    > div:not(:last-child)
      margin-right 8px
    > div:last-child
      margin-left 8px
    > div.goto-button
      width 12%
      padding 10px 0
      .arrow
        margin-right 5px
</style>

<template>
  <li>
    <span class="text-big-x orderid">{{ idx + 1 }}</span>
    <div v-if="canDelete" class="button rounded delete-button" @click="$emit('delete', idx)"><Cross /></div>
    <div class="move-buttons" v-if="modelValue.confirmed">
      <div class="button half-height rounded" @click="$emit('move', {idx, to: idx-1})">˄</div>
      <div class="button half-height rounded" @click="$emit('move', {idx, to: idx+1})">˅</div>
    </div>
    <input type="text" :placeholder="placeholder" :value="modelValue.title" autocomplete="off" @input="updateVModel" ref="input">

    <router-link :to="actionTo(modelValue.id)" v-if="modelValue.confirmed && actionText && modelValue.id" class="text-middle button rounded goto-button">
      <span class="mobile-hide">{{ actionText }}</span> <Arrow right />
    </router-link>
  </li>
</template>

<script>
  import Cross from "../Cross.vue";
  import Arrow from "../Arrow.vue";
  export default {
    components: {Arrow, Cross},
    emits: ['delete', 'move', 'update:modelValue'],

    props: {
      idx: Number,
      modelValue: {
        title: '',
        confirmed: '',
      }, // aka "item"
      actionText: String,
      placeholder: String,
      canDelete: Boolean,
      actionTo: Function,
    },

    data() {
      return {
      }
    },

    methods: {
      updateVModel() {
        this.modelValue.title = this.$refs.input.value;
        this.$emit('update:modelValue', this.modelValue);
      },
    }
  }
</script>
