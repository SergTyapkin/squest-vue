<style lang="stylus" scoped>
@require '../styles/constants.styl'

</style>

<template>
  <div>
    <TopButtons clickable arrows low-opacity :buttons="[
        {name: 'Назад', description: 'В профиль', to: {name: 'profile'}},
    ]"></TopButtons>


    <div class="container">
      <ArrowListElement class="ratings" ref="ratings" title="Рейтинг" closed open-on-set-elements
                        :elements="ratings"
                        :numbered="true"
                        @click-inside="(user) => $router.push({name: 'profile', query: {id: user.id}})"
      ></ArrowListElement>
    </div>

    <CircleLoading v-if="loading" class="preview-image"></CircleLoading>
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

      this.ratings = ratings.ratings.map((rating, idx) => {
        return {
          id: rating.id,
          title: rating.username,
          description: '★' + rating.rating,
          actionText: 'в профиль',
          arrow: true,
          noClose: true,
        };
      });
    },
  }
};
</script>
