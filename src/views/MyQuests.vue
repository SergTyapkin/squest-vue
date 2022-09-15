<style lang="stylus" scoped>
@import "../styles/constants.styl"

.quest-container
  width 100%
  display flex
  flex-wrap wrap
  justify-content space-around

.float-button
  z-index 10
</style>

<template>
  <div class="root">
    <div class="quests-page">
      <div>
        <TopButtons bg :buttons="[
          {name: 'Твои квесты', description: 'Здесь собраны созданные тобой квесты'},
        ]"></TopButtons>

        <CircleLoading v-if="loading"></CircleLoading>
        <div class="quest-container">
          <Quest v-for="quest in quests" v-bind="quest"></Quest>
        </div>
      </div>

      <FloatingButton title="Создать квест" :to="`/quest/create`" class="float-button">
        <img src="../res/plus_bold.svg" alt="">
      </FloatingButton>
    </div>
  </div>
</template>


<script>
import TopBar from "../components/TopBar.vue";
import TopButtons from "../components/TopButtons.vue";
import Quest from "../components/Quest.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";
import FloatingButton from "../components/FloatingButton.vue";

export default {
  components: {FloatingButton, CircleLoading, Quest, TopBar, TopButtons},

  data() {
    return {
      quests: [],
      loading: false,
    }
  },

  async mounted() {
    this.loading = true;
    const res = await this.$api.getMyQuests(this.$user.id);
    this.loading = false;

    if (!res.ok_) {
      this.$popups.error(`Ошибка ${res.status}!`, res.info);
      return;
    }
    this.quests = res.quests;
  },
}
</script>
