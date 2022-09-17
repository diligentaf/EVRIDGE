import Vue from 'vue'
import VueRouter from 'vue-router'
import KeplrToMetamask from '../views/KeplrToMetamask.vue'
import MTK from '../views/MetamaskToKeplr.vue'
import Scan from '../views/Scan.vue'
import Explorer from '../views/Explorer.vue'
import Import from '../views/Import.vue'
import VueSimpleAlert from "vue-simple-alert"

Vue.use(VueRouter)
Vue.use(VueSimpleAlert)

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
  {
    path: '/explorer',
    name: 'Explorer',
    component: Explorer,
  },
]

const router = new VueRouter({
  routes,
})

export default router
