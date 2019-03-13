import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/components/Login";
import Reg from "@/components/Reg";


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      hidden:true,
      component: Login
    },
    {
      path:'/reg',
      name:'注册',
      component:Reg
    }
  ]
})
