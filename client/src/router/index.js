import Vue from 'vue'
import VueRouter from 'vue-router'
import Cosmeta from '../views/CosmetaView.vue'
import MTK from '../views/MetamaskToKeplr.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Cosmeta',
    component: Cosmeta,
  },
  {
    path: '/mtk',
    name: 'MTK',
    component: MTK,
  },
]

const router = new VueRouter({
  routes,
})

export default router
