import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShopView from '@/views/ShopView.vue'
import ItemView from '@/views/ItemView.vue'
import InscriptionView from '@/views/InscriptionView.vue'
// import ConnexionView from '@/views/ConnexionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/shop',
      name: 'shop',
      component: ShopView,
      props: true
    },
    {
      path: '/shop/:id',
      name: 'item',
      component: ItemView
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: InscriptionView
    },
    // {
    //   path: '/connexion',
    //   name: 'connexion',
    //   component: ConnexionView
    // }
  ]
})

export default router
