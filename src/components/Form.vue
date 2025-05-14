<style lang="stylus">
@import '../styles/constants.styl'
@import '../styles/fonts.styl'
// form-bg = linear-gradient(20deg, bgColor0 0%, empColor6 50%, empColor4 110%) 50% 50% no-repeat
form-bg = linear-gradient(20deg, bgColor1 0%, empColor6 50%, bgColor2 100%) 50% 50% no-repeat

input-bg = linear-gradient(20deg, rgba(45, 36, 13, 0.4) 0%, rgba(62, 39, 17, 0.6) 50%, rgba(38, 30, 11, 0.4) 100%) 50% 50% no-repeat

textarea
input
.input-like
  all unset
  box-sizing border-box
  width 100%
  padding 10px
  color textColor1
  transition all 0.2s ease
  font-small()
  font-special()
textarea
  background colorShadowDark
  border transparent 1px solid
  border-radius 3px
textarea:focus
  border empColor2 1px solid
input
.input-like
  background colorShadowLight-x
  border-right 100px solid transparent
  border-bottom 1px solid empColor3
  border-left 100px solid transparent
  border-radius 5px 5px 0 0

  @media ({mobile})
    border-right-width 10px
    border-left-width 10px
textarea:focus
input:focus.randomgz94vdn88ak9tdpn,.randomoymuxiicxpb174rh.randomaavq92avh41xu3gs,
.randomf8qskr28662z245r
.random9y2g5v05pc7s9ytj,.random9pczodu6c09rn05s.randomkilfjp7ocdqujtr0,
.randomwbxbk7iwh2lpf8ki.random41fuldmfl3848ufb,.randomaohl3kbwn1vyc5yt.randomk1ks24x0207bzewa,
.randomfx216s826i0pvjp3
.randomhjjw2ftid1mxclz8,.randomdnrjn1n3xo50ka7c.random698m7bxqhm2iiuz1,
.random6l6xan0p867yxpxx.randomnhjzj1h4rcako03n,.randomz94qo4ggv8lb4luu.randomk48a7wiuuhf089h3,
.random72z4orbg97kt1cxp
.randomacbttn5740ja4iu9,.randomom2ii9qmp7ey6zjv.randomhqtfd0bxbir1zze3,
.randomz212mfudfd5ksmhc.randoml0tzjw9ohuopnkyj,.randomhouvno4mjli38ej9.random0hm5fyo03a6p0vmm,
.randoms50pamlftx26pgt8
.randomlwdhrdya2qf89nbu,.randomuq16lvag0zl7giap.randomnwnbzcxyfgmyjnr4,
.random6tm6uslesdixllga.randomqlhlljx7kq7bnvme,.randomgwlvh5eff791ahse.random8axwfwhc3jzmm8yv,
.randomyl68jmt31ijbujqg
.randomm7xw8wbxjx76bz4r,.random8pu5gxsfc10du0ln.random5i6jjqrx156jgexb,
.random0atpq4hqzpz9sizm.randomppdpuqbh3u7whk74,.randomvtbyrwwvne4kp7xr.randomeufimoluhk9a07iz,
.randomoocn1swfrhepdbq8
.randomn0rr6q07xo3yxbh4,.randomt74nzblho0drxoyd.randomcco954w55uyofiot,
.randoml833u470jz27nkp4.randomk8xkjf56swtng8nb,.randompy7i13kzqniqni2f.randomr670jorswxo0a3q1,
.randomtv42mndpqeyj7kd1
.random187bl368pmud78y4,.randomjsbaaxb6gaa4x152.randomlve757c5acevl6d6,
.randomdk3i5mjkfgm3g5kl.random5l8om2kyx2ezk2pr,.randoml3n4pzrd2vuqs3no.randomi3nxnb2j6j6qyfpy,
.random4wbqec27fqcl5c9y
.random2rh2ssymjp5sev3f,.randomvjfzz1nvpm0sz3ef.random9rwh2mscpqd4jzs4,
.input-like:focus
  background colorShadowDark
  border-right-width 0
  border-left-width 0
  // border-color empColor1
.form:not(.no-bg)
  margin-top 100px
  padding 40px 30px
  background form-bg
  box-shadow 3px 3px 10px black

.form
  width 100%
  max-width 460px
  margin-right auto
  margin-left auto
  border-radius 7px
  transition all 0.3s ease

  .info-container
    margin 20px auto
    text-align center

  .submit-container
    .info
      margin-top 15px

  .fields-container
    > div
      margin 20px 0
      transition all 0.3s ease
      > label
        font-medium-small()
      > textarea
      > input[type=text]
      > input[type=password]
      > input[type=email]
        display block
        width 100%
        padding 10px
      .info
        margin 5px 0

.form
  > div // containers
    margin 30px 0
  > div:last-child
    margin-bottom 0
  > div:first-child
    margin-top 0

.form
  textarea
    resize vertical
    transition border-color 0.3s ease

  input[type=button]
  input[type=submit]
    cursor pointer
    width 100%
    padding 10px
    text-align center
    background linear-gradient(20deg, rgba(45, 36, 13, 0.4) 0%, rgba(90, 56, 25, 0.7) 50%, rgba(55, 43, 16, 0.4) 100%) 50% 50% no-repeat
    border 1px empColor3 solid
    border-color empColor3
    border-radius 3px
    box-shadow inset 0 0 0 transparent, 5px 5px 10px colorShadowDark
  input[type=button]:hover
  input[type=submit]:hover
    box-shadow inset 0 0 20px rgb(195, 162, 127), 0 0 10px rgb(255, 235, 164)


.form
  .form-info
    opacity 0
    transition all 0.3s
.form.error
.form.success
  .form-info
    opacity 1

.form.error
.form .error
  color #ff8e72
  *
    color #ff8e72
  textarea
  input
  .input-like
    border-color #ff8e72
// animation error 3s forwards
.form.success
.form .success
  color #c4ff72
  *
    color #c4ff72
  textarea
  input
  .input-like
    border-color #c4ff72
// animation success 3s forwards

.form.disabled
  input
  .input-like
    user-select none
    filter saturate(0)

@media ({mobile})
  .form
    padding-right 10px
    padding-left 10px
</style>

<template>
  <form @submit.prevent.stop="submit" class="form" :class="{disabled: loading}" ref="form">
    <slot />
  </form>
</template>

<script>
import {setTimedClass} from "../utils/utils";

export default {
  emits: ['submit'],

  data() {
    return {
      loading: false,
      info: '',
    };
  },

  methods: {
    submit() {
      this.$emit('submit', this.values);
    },

    showError() {
      setTimedClass([this.$refs.form], 'error');
    },
    showSuccess() {
      setTimedClass([this.$refs.form], 'success');
    },
  }
};
</script>
