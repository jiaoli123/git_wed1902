import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import category from '../pages/category'
import cateproduct from '../pages/cateproduct'
import customer from '../pages/customer'
import custaddress from '../pages/custaddress'
import product from '../pages/product'
import order from '../pages/order'
import waiter from '../pages/waiter'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path:'/category',
    component:category
  },
  {
    path:'/cateproduct',
    component:cateproduct
  },
  {
    path:'/customer',
    component:customer
  },
  {
    path:'/custaddress',
    component:custaddress
  },
  {
    path:'/product',
    component:product
  },
  {
    path:'/waiter',
    component:waiter
  },
  {
    path:'/order',
    component:order,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
