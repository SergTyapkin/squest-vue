<style lang="stylus" scoped>
@require '../styles/constants.styl'

.root-qr-scanner
  video
    max-width 100%
  .camera-buttons-container
    display flex
    width 100%
    justify-content space-between
    gap 20px
    overflow-x auto
    .camera-button
      padding 5px
      min-width 150px

</style>

<template>
  <div class="root-qr-scanner roll-active" :class="{closed: closed}">
    <video class="qr-scanner-video" ref="video"></video>
    <div v-if="!noCamerasSelection" class="camera-buttons-container scrollable">
      <button v-for="camera in existingCameras" class="button bg rounded text-small camera-button" @click="selectCamera(camera)">{{ camera.label ? camera.label : camera.id }}</button>
    </div>
  </div>
</template>

<script>
import QrScanner from "qr-scanner";
import {closeRoll, openRoll} from "../utils/show-hide";

export default {
  emits: ['scan'],

  props: {
    closed: {
      type: Boolean,
      default: false,
      noCamerasSelection: Boolean,
    },
  },

  data() {
    return {
      text: null,

      active: false,
      existingCameras: [],
      _scanner: null,
    };
  },

  async mounted() {
    this.existingCameras = await QrScanner.listCameras(true);

    this._scanner = new QrScanner(this.$refs.video, (result) => {
      this.$emit('scan', result.data);
    }, {
      highlightScanRegion: true,
      maxScansPerSecond: 10,
    });
  },

  unmounted() {
    this._scanner.destroy();
  },

  methods: {
    start() {
      if (!this.active) {
        this._scanner.start().then(
            () => {},
            (error) => {
              this.$modal.alert("Не предоставлены права доступа к камере", "Настройте доступ к камере для этого сайта в браузере");
            }
        );
        this.active = true;
      }
    },

    selectCamera(camera) {
      this._scanner.setCamera(camera.id);
    },

    stop() {
      this._scanner.stop();
      this.active = false;
    },

    show() {
      openRoll(this.$el);
    },

    hide() {
      closeRoll(this.$el);
    }
  }
};
</script>
