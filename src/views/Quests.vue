<style lang="stylus" scoped>
@import "../styles/constants.styl"

.quest-container
  width 100%
  display flex
  flex-wrap wrap
  justify-content space-around
</style>

<template>
  <div class="root">
    <div class="quests-page">
      <div>
        <TopButtons bg :buttons="[
          {name: 'Выбор квеста', description: 'Выбирай первый понравившийся и погнали!'},
        ]"></TopButtons>

        <CircleLoading v-if="loading"></CircleLoading>
        <div class="quest-container">
          <Quest v-for="quest in quests" v-bind="quest"></Quest>
        </div>
      </div>

      <router-link class="float-button text-middle" to="/quest/create">
        <div class="hover-text">Создать квест</div>
        <svg pointer-events="none" xmlns="http://www.w3.org/2000/svg"><path transform="scale(2.2) translate(-1,-1)" d="M10 3.25c.41 0 .75.34.75.75v5.25H16a.75.75 0 010 1.5h-5.25V16a.75.75 0 01-1.5 0v-5.25H4a.75.75 0 010-1.5h5.25V4c0-.41.34-.75.75-.75z"></path></svg>
      </router-link>
    </div>
  </div>
</template>


<script>
import TopBar from "../components/TopBar.vue";
import TopButtons from "../components/TopButtons.vue";
import Quest from "../components/Quest.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";

export default {
  components: {CircleLoading, Quest, TopBar, TopButtons},

  data() {
    return {
      quests: [],
      loading: false,
    }
  },

  async mounted() {
    this.loading = true;
    const res = await this.$api.getAllQuests();
    this.loading = false;

    if (!res.ok_) {
      this.$popups.error(`Ошибка ${res.status}!`, res.info);
      return;
    }
    this.quests = res.quests;
  },
}
</script>
