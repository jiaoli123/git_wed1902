import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import category from './category'
import waiter from './waiter'
import product from './product'
import customer from './customer'
import cateproduct from './cateproduct'
import custaddress from './custaddress'
export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    category,
    product,
    customer,
    waiter,
    cateproduct,
    custaddress
  }
})
