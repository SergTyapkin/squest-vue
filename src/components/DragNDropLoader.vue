<style lang="stylus" scoped>
@import '../styles/constants.styl'

</style>

<template>
  <div
    class="root"
    :class="{'in-drag': isInDrag}"
    @dragenter="isInDrag = true"
    @dragleave="isInDrag = false"
    @dragover.prevent="isInDrag = true"
    @drop.prevent="handleDrop"
  >
    <div />
    <slot />
  </div>
</template>

<script>
import {getLoadedImageAsDataURL} from "~/utils/getImageAsDataURL";

export default {
  emits: ['load'],

  props: {
    cropSize: {
      type: Number,
      required: true,
    },
    compressSize: {
      type: Number,
      required: true,
    },
    maxAllowedSize: {
      type: Number,
      default: Infinity,
    }
  },

  data() {
    return {
      isInDrag: false,
    }
  },

  methods: {
    async handleDrop(event) {
      this.isInDrag = false;
      this.$emit('load', await getLoadedImageAsDataURL(event.dataTransfer, this.cropSize, this.compressSize, this.maxAllowedSize));
    }
  }
};
</script>
