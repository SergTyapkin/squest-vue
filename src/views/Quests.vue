<style lang="stylus" scoped>
@import "../styles/constants.styl"

</style>

<template>
  <div class="root">
    <div class="quests-page">
      <div>
        <TopButtons bg :buttons="[
          {name: 'Выбор квеста', description: 'Выбирай первый понравившийся и погнали!'},
        ]"></TopButtons>

        <QuestsList :get-quests-foo="$api.getAllQuests"></QuestsList>
      </div>

      <FloatingButton title="Создать квест" :to="{name: 'create-quest'}" class="float-button">
        <img src="../res/plus_bold.svg" alt="">
      </FloatingButton>
    </div>
  </div>
</template>


<script>
import TopButtons from "../components/TopButtons.vue";
import FloatingButton from "../components/FloatingButton.vue";
import QuestsList from "../components/QuestsList.vue";

export default {
  components: {QuestsList, FloatingButton, TopButtons},

  data() {
    return {
    }
  },
}
</script>
