import { createRouter, createWebHistory } from 'vue-router'
<<<<<<< HEAD
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import InscriptionView from '@/views/InscriptionView.vue'
import ConnexionView from '@/views/ConnexionView.vue'
=======
<<<<<<< HEAD
// import HomeView from '../views/HomeView.vue'
=======
import HomeView from '../views/HomeView.vue'
import CatalogueView from '@/views/CatalogueView.vue'
>>>>>>> 95fa1db (layout plus ou moins fini en mobile, commencé en descktop)
>>>>>>> 5e42165 (layout plus ou moins fini en mobile, commencé en descktop)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
<<<<<<< HEAD
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: InscriptionView
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: ConnexionView
=======
      path: '/catalogue',
      name: 'catalogue',
      component: CatalogueView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
>>>>>>> 5e42165 (layout plus ou moins fini en mobile, commencé en descktop)
    }
  ]
})

export default router
