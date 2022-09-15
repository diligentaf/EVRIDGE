import Vue from 'vue'
import VueRouter from 'vue-router'
import Cosmeta from '../views/CosmetaView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Cosmeta',
    component: Cosmeta,
  },
]

const router = new VueRouter({
  routes,
})

export default router
