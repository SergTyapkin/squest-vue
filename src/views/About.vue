<style lang="stylus" scoped>
@import "../styles/constants.styl"

side-item-gradient = "linear-gradient(%s, rgba(184, 134, 11, 0.3) 30%, rgba(218, 165, 32, 0) 100%) 0 100% no-repeat"

.flex-root
  .side-item
    padding 20px
    margin-bottom 30px

    ul
      margin 0
      padding-left 25px

  .side-item.left
    background side-item-gradient % 90deg
    background-size 100% 1px
    left 0
    text-align left
  .side-item.right
    background side-item-gradient % -90deg
    background-size 100% 1px
    right 0
    text-align right

  .side-item.right
    .text-big-xx
      font-size 30px

  .register-button
    width fit-content
    background linear-gradient(90deg, rgba(71, 56, 20, 0.4) 0%, rgba(84,69,25,0.7) 100%) 50% 50% no-repeat
    margin-top 20px
    margin-bottom 20px
    display block
    margin-left auto
    margin-right auto

.about-page
  text-align center
</style>

<template>
  <div class="flex-root">

    <div class="about-page app-flex-filler">
      <div class="side-item left" >
        <div class="text-big-xx">КУДА ТЫ ПОПАЛ?</div>
        <div class="text-small"><span class="text-big">Здесь</span> ты сможешь найти <span class="text-big">онлайн-квест</span> по душе, созданный нашими професси<i>онал</i>ами.</div>
      </div>
      <div class="side-item right">
        <div class="text-big-xx">ЭТО ХОТЬ БЕСПЛАТНО?</div>
        <div class="text-small">Всё <span class="text-big">бесплатно</span> <s>пока что</s>.</div>
      </div>
      <div class="side-item left">
        <div class="text-big-xx">КАК ПОЛЬЗОВАТЬСЯ?</div>
        <div class="text-big">Смотри, всё просто:
          <ul>
            <li class="text-small">регистрируешься</li>
            <li class="text-small">выбираешь квест и ветку</li>
            <li class="text-small">чем больше проходишь - тем выше ты в рейтинге</li>
          </ul>
        </div>
      </div>
      <div class="side-item right">
        <div class="text-big-xx">У МЕНЯ ОСТАЛИСЬ ВОПРОСЫ</div>
        <div class="text-small">Там снизу есть <span class="text-big">контакты</span> - пиши, не стестняйся.</div>
      </div>

      <router-link :to="`/signup`" class="register-button text-big-x button highlight rounded">Зарегистрироваться</router-link>
    </div>

    <Footer></Footer>
  </div>
</template>


<script>
import CircleLoading from "../components/loaders/CircleLoading.vue";
import Footer from "../components/Footer.vue";
import TopBar from "../components/TopBar.vue";


export default {
  components: {TopBar, Footer, CircleLoading},
}
</script>
