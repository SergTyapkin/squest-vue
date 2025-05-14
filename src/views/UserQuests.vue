<style lang="stylus" scoped>
@import "../styles/constants.styl"

</style>

<template>
  <div class="root">
    <div class="quests-page">
      <div>
        <TopButtons
          clickable
          arrows
          low-opacity
          :buttons="[
            {name: 'Назад', description: 'В профиль пользователя',
             to: {name: 'profile', query: {id: id}}},
          ]"
        />

        <QuestsList :get-quests-foo="$api.getUserQuests" :args="id" />
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
    }
  },
}
</script>
