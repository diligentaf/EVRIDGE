<template>
  <v-app>
    <app-bar @toggle-drawer="showDrawer = !showDrawer"></app-bar>

    <v-main>
      <v-container fluid class="pa-10">
        <router-view />
      </v-container>
    </v-main>

    <modal />
    <snack-bar />
  </v-app>
</template>

<script>
import Modal from './components/Modals/Modal.vue'
import AppBar from './components/Application/AppBar.vue'
import SnackBar from './components/Application/SnackBar.vue'

export default {
  name: 'App',

  components: { AppBar, Modal, SnackBar },

  data: () => ({
    showDrawer: true,
  }),

  computed: {
    loading() {
      return this.$store.getters.loading
    },
  },
}
</script>

<style lang="scss">

//@font-face {
//  font-family: "Inter custom";
//  src: local("Inter custom"),
//   url(./fonts/Merienda/Merienda-Regular.ttf) format("truetype");
//}

.bounce-transition {
  &-enter-active,
  &-leave,
  &-leave-to {
    transition: transform 3s cubic-bezier(0.3 0.7, 1);
  }

  &-enter,
  &-leave-to {
    transform: translateY(100px);
  }
}
</style>
