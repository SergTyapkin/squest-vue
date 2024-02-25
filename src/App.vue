<style lang="stylus" scoped>
top-bar-height = 70px

.wrapper
  width 100%
  min-height "calc(100vh - %s)" % top-bar-height

  > *
    position absolute
    width 100%
  .loading
    top 50%
    left 50%
    transform translate(-50%, -50%)
    width 100px
    height 100px
</style>

<template>
  <Navbar></Navbar>

  <div class="wrapper">
    <CircleLoading v-if="!$store.state.user.isGotten" class="loading"></CircleLoading>
    <router-view v-else v-slot="{ Component }">
      <transition :name="transitionName">
        <component :is="Component"/>
      </transition>
    </router-view>
  </div>

  <Modal ref="modal"></Modal>
  <Popups ref="popups"></Popups>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s ease;
}
.slide-left-enter-to {
  left: 0;
}
.slide-left-enter-from {
  left: -100%;
}
.slide-left-leave-to {
  left: -100%;
  transform: scale(0.8);
}
.slide-left-leave-from {
  left: 0;
}


.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s ease;
}
.slide-right-enter-to {
  left: 0;
}
.slide-right-enter-from {
  left: -100%;
}
.slide-right-leave-to {
  right: -100%;
  transform: scale(0.5);
}
.slide-right-leave-from {
  right: 0;
}


.scale-slide-left-enter-active,
.scale-slide-left-leave-active {
  transition: all 0.3s ease;
}
.scale-slide-left-enter-from {
  left: -30%;
  opacity: 0;
}
.scale-slide-left-enter-to {
  left: 0%;
  opacity: 1;
}
.scale-slide-left-leave-from {
  transform: scale(1);
}
.scale-slide-left-leave-to {
  transform: scale(0.8);
  opacity: 0;
}


.scale-slide-right-enter-active,
.scale-slide-right-leave-active {
  transition: all 0.4s ease;
}
.scale-slide-right-enter-from {
  right: -30%;
  opacity: 0;
}
.scale-slide-right-enter-to {
  right: 0%;
  opacity: 1;
}
.scale-slide-right-leave-from {
  transform: scale(1);
}
.scale-slide-right-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

.scale-in-enter-active,
.scale-in-leave-active {
  transition: all 0.3s ease;
}
.scale-in-enter-from {
  transform: scale(1.2);
  opacity: 0;
}
.scale-in-enter-to {
  transform: scale(1);
  opacity: 1;
}
.scale-in-leave-from {
  transform: scale(1);
  opacity: 1;
}
.scale-in-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

.opacity-enter-active {
  animation: opacity .3s;
}
.opacity-leave-active {
  animation: opacity .3s reverse forwards;
}
@keyframes opacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

<script>
import {getCurrentInstance} from "vue";
import Modal from "/src/components/vue-plugins/Modal.vue";
import Popups from "/src/components/vue-plugins/Popups.vue";
import CircleLoading from "/src/components/loaders/CircleLoading.vue";
import Navbar from "./components/Navbar.vue";
import {API_URL, Themes} from "./constants";


export default {
  components: {Navbar, CircleLoading, Modal, Popups},

  data() {
    return {
      transitionName: "",

      Themes: Themes,
    }
  },

  watch: {
    $route(to, from) {
      this.transitionName = 'scale-in';

      console.log(from.path, 'TO', to.path)
    },
    '$store.state.theme'(to, from) {
      if (to === Themes.flat) {
        document.body.classList.add('flat');
      } else {
        document.body.classList.remove('flat');
      }
    }
  },

  async mounted() {
    const global = getCurrentInstance().appContext.config.globalProperties;

    global.$modal = this.$refs.modal;
    global.$popups = this.$refs.popups;

    global.$user = this.$store.state.user;
    global.$theme = this.$store.state.theme;
    global.$fullApiUrl = location.origin + API_URL;
  },
};
</script>
