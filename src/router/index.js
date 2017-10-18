import Vue from 'vue'
import Router from 'vue-router'
import Calender from '@/components/Calender'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Calender',
      component: Calender
    }
  ]
})
