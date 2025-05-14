<style lang="stylus" scoped>
@import '../styles/constants.styl'

li
  cursor pointer
  width 100%
  margin 0
  padding 0
  list-style-type none
  background linear-gradient(20deg, rgba(121, 86, 34, 0.3) 0%, rgba(55, 43, 16, 0) 100%) -50% 50% no-repeat
  background-size 0
  border-color empColor6
  border-style solid
  border-width 0
  border-top-width 1px
  transition all 0.2s ease

  .all-info
    display flex
    align-items center
    justify-content flex-start
    padding 10px
    transition all 0.2s ease
    img
      display inline-block
      width 25px
      margin-right 10px
    .main-info
      max-width 70%
      .title-container
        .number
          margin-right 10px
          color empColor4
        // .title
      .info
        overflow hidden
        text-overflow ellipsis
    .choose
      margin-left 30px
      opacity 0.3
      transition all 0.3s ease-out
      transition-delay 20ms

  svg
    margin-right 10px

  ul
    margin 0
    padding 0

li:last-child
  border-bottom-width 1px
li.selected
li:hover.randompkkww02qjljyqibn,.randomqe1ptjd7vau8tgqm.randomwkuw84u7plxs7gew,
.random8p70l5dh5s8tdx7p.randomid3fm2nlspskx1fn,.randomfqxwryd4png33tce
.randomjzw18ebiijvg4nrg,.randomzvnyqxpdq18z774s.random1wvu2lw3e6nd8xwg,.random6lbxsryoisyqzzbe.random1urk081nbbapgywk,
.randomoqde99oxvg8sbh7k
.randoms25oqbbdctrkwdyj,.random170avkgxuhh7mpmc.randomr7o9j2uw7uh81kqs,
.randomu14peaxa32reysn1.randomwkrlbhxcub65md83,.random53p5bzq4syvw14lv.randomeux2d2tqbpw33qys,
.randomx6m1yf5ol1j3c9nx.randomqemx6zkzxk1zx7hz,.randomie2nu6ni8hg08rt9
.randomcidhw7kueu14pw4b,.random0d6mz83i3gem1eoq
.randomjeu972o6pm1eos19,.randome9ve5y3vphl17337.randomv3ssrbu3ayirg3i1,
.random4d9vt5td9ec7ik4b.random6frsup8qtefehwyt,.randomtjtr4ph8i3fsllea
.randommzojfm76c0wu6lvt,.randomhwmpij0jlktawiyz
.randomlb40mr6r6xanchn5,.randomujpgb96qf8f0vx3z.randomzvr68rxpn9bzgu04,
.randomdgfxhctu7k89u6zq.randomgs2njymbbninxkjc,.randomxe201jizu5d29e9l
.randomnqhc8b8xwen5vb6k,.randomlhbujchdd3q6c741.randomicw9r1w9ivpehxed,.randomgxe7djfzocn86m73.randomxhqoejj0l935cu0d,
.randomjs3zfz344cytrffs
.randomay8wvt6uo2wc7ecu,.random725mfxo8zoj71hmm.randomcxmmk21jv8pkhxkc,
.randomhg6h0zteofzbywpq.randommqmblca1hzq5s2pu,.randomezbb8jgjtwv79jq4.random32in70buc9yp6qlr,
.randomiv446qt5e077r82r.randomgbh8siwd6rjqs3m7,.randomhicvm5j23nmm9gft
.random1o99172mjj9rv53h,.random1se3p1gi3tzwrsmw
.random2geo7i5twpdw2fvq,.randomq0w205f5b9sgjkui.random4nmuntj3tapbgmj5,
.randomz9m86elv39pt8d24.random6ijl50i088un9gsl,.randomvkhxoadsu129ffeq
.randomshc9mwkj1ha0gu2d,li:hover + li
  border-color empColor1
li.inside:hover
  border-left-width 20px
  > .all-info
    color textColor1
    text-shadow 0 0 50px #f5f0f0, 0 0 10px #eaacbf, 0 0 15px #eaa093
    letter-spacing 2px
    border-left-width 0
    .choose
      text-shadow 0 0 8px #e7bfac
      opacity 1

li.selected
  background-size 100%
  > .all-info
    text-shadow 0 0 3px #a29a97


li.inside
  > .all-info
    // padding-left 20px
    // background linear-gradient(91deg,#533d0f,transparent) no-repeat
    background-size 25px 100%
    border-left colorShadowDark 20px solid

li.bg
  background-size 100%
</style>

<template>
  <li class="text-big" :class="{inside, bg, selected: !closed}">
    <div class="all-info" @click.prevent="onClick">
      <img v-if="!ispublished" src="../res/invisible.svg" alt="unpublished">
      <img v-if="islinkactive" src="../res/link.svg" alt="link active">

      <div class="main-info">
        <div class="title-container">
          <span class="number text-middle" v-if="number">{{ number }}</span>
          <span class="title">{{ title }}</span>
        </div>
        <div class="text-small info">{{ description }}</div>
      </div>
      <span class="text-small choose">
        {{ actionText }}<Arrow right ref="arrow" v-if="arrow" />
      </span>
    </div>

    <ul class="roll-active" :class="{closed: closed}" ref="list">
      <ArrowListElement @click="$emit('click-inside', element)" v-for="(element, idx) in elements" v-bind="element" inside :arrow="element.arrow || arrowsOnElements" closed :no-close="element.noClose" :number="numbered ? '#' + (idx + 1) : null" />
    </ul>
  </li>
</template>

<script>
import Arrow from "./Arrow.vue";
import {closeRoll, openRoll, openRollList} from "../utils/show-hide";
import {nextTick} from "vue";

export default {

  name: 'ArrowListElement',
  components: {Arrow},

  emits: ['click', 'open', 'close', 'click-inside'],

  props: {
    title: String,
    description: String,
    actionText: String,

    elements: {
      type: Array,
      default: []
    },

    closed: {
      type: Boolean,
      default: false
    },

    inside: {
      type: Boolean,
      default: false
    },

    arrow: {
      type: Boolean,
      default: true
    },
    arrowsOnElements: {
      type: Boolean,
      default: false
    },

    noClose: {
      type: Boolean,
      default: false
    },

    bg: {
      type: Boolean,
      default: false
    },

    islinkactive: {
      type: Boolean,
      default: false
    },
    ispublished: {
      type: Boolean,
      default: true
    },
    openOnSetElements: {
      type: Boolean,
      default: false
    },
    preserveClickOpen: {
      type: Boolean,
      default: false
    },
    numbered: {
      type: Boolean,
      default: false
    },
    number: {
      type: String,
      default: null,
    }
  },

  data() {
    return {
      data_closed: this.$props.closed,
    }
  },

  mounted() {
    if (!this.data_closed) {
      this.$refs?.arrow?.setDirection(this.$refs.arrow.directions.bottom);
    }
  },

  methods: {
    onClick() {
      this.$emit('click');
      if (this.noClose)
        return;

      if (this.data_closed) {
        if (this.preserveClickOpen) {
          this.$emit('open');
          return;
        }
        this.open();
        this.$emit('open');
        return;
      }
      this.close();
      this.$emit('close');
    },

    open() {
      openRoll(this.$refs.list);
      this.$refs?.arrow?.setDirection(this.$refs.arrow.directions.bottom);
      this.data_closed = false;
    },
    close() {
      closeRoll(this.$refs.list);
      this.$refs?.arrow?.setDirection(this.$refs.arrow.directions.right);
      this.data_closed = true;
    },
  },

  watch: {
    elements: async function (to, from) {
      if (!this.openOnSetElements)
        return;

      await nextTick();
      this.open();
      this.$emit('open');
    }
  }
}
</script>
