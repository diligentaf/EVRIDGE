import Vue from 'vue'
import VueRouter from 'vue-router'
import KeplrToMetamask from '../views/KeplrToMetamask.vue'
import MTK from '../views/MetamaskToKeplr.vue'
import Scan from '../views/Scan.vue'
import Import from '../views/Import.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'KeplrToMetamask',
    component: KeplrToMetamask,
  },
  {
    path: '/mtk',
    name: 'MTK',
    component: MTK,
  },
  {
    path: '/scan',
    name: 'Scan',
    component: Scan,
  },
  {
    path: '/import',
    name: 'Import',
    component: Import,
  },
]

const router = new VueRouter({
  routes,
})

export default router
