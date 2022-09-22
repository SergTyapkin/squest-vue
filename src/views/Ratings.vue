<style lang="stylus" scoped>
@require '../styles/constants.styl'


</style>

<template>
  <div>
    <TopButtons clickable arrows low-opacity :buttons="[
        {name: 'Назад', description: 'В профиль', to: base_url_path + '/profile'},
    ]"></TopButtons>


    <div class="container">
      <ArrowListElement class="ratings" ref="ratings" title="Рейтинг" closed open-on-set-elements
                        :elements="ratings"
                        @click-inside="goToProfile"
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

      base_url_path: this.$base_url_path,
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
