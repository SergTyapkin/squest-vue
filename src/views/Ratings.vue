<style lang="stylus" scoped>
@require '../styles/constants.styl'


</style>

<template>
  <div>
    <TopButtons clickable arrows low-opacity :buttons="[
        {name: 'Назад', description: 'В профиль', to: '/profile'},
    ]"></TopButtons>

    <CircleLoading v-if="loading" class="preview-image"></CircleLoading>

    <div class="container">
      <ArrowListElement class="ratings" ref="ratings" title="Рейтинг"
                        :elements="ratings"
                        @click-inside="goToProfile"
      ></ArrowListElement>
    </div>
  </div>
</template>

<script>
import ArrowListElement from "../components/ArrowListElement.vue";
import TopButtons from "../components/TopButtons.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";

export default {
  components: {CircleLoading, TopButtons, ArrowListElement},

  data() {
    return {
      loading: false,
      ratings: [],
    }
  },

  async mounted() {
    this.getRatings();
  },

  methods: {
    async getRatings() {
      this.loading = true;
      const ratings = await this.$api.getRatings();
      this.loading = false;

      if (!ratings.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить рейтинги");
        return;
      }

      this.ratings = ratings.ratings.map((rating) => {
        return {
          id: rating.id,
          title: rating.username,
          description: rating.rating,
          actionText: 'в профиль',
          arrow: true,
          noClose: true,
        };
      });
    },

    goToProfile(user) {
      this.$router.push(`/profile?id=${user.id}`)
    }
  }
};
</script>
