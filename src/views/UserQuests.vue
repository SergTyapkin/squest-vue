<style lang="stylus" scoped>
@import "../styles/constants.styl"

</style>

<template>
  <div class="root">
    <div class="quests-page">
      <div>
        <TopButtons clickable arrows low-opacity :buttons="[
          {name: 'Назад', description: 'В профиль пользователя',
          to: base_url_path + `/profile?id=${id}`},
        ]"></TopButtons>

        <QuestsList :get-quests-foo="$api.getUserQuests" :args="id"></QuestsList>
      </div>
    </div>
  </div>
</template>


<script>
import TopButtons from "../components/TopButtons.vue";
import QuestsList from "../components/QuestsList.vue";

export default {
  components: {QuestsList, TopButtons},

  data() {
    return {
      id: this.$route.query.id,

      base_url_path: this.$base_url_path,
    }
  },
}
</script>
