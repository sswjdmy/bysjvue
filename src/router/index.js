import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/components/Login";
import Reg from "@/components/Reg";
import Home from "@/components/Home";
import CategoryList from "@/components/CategoryList";
import MedicineAdd from "@/components/MedicineAdd";
import MedicineList from "@/components/MedicineList";
import OrderList from "@/components/OrderList";
import OrderAdd from "@/components/OrderAdd";
import Personal from "@/components/Personal";
import Init from "@/components/Init";


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      hidden: true,
      component: Login
    },
    {
      path: '/reg',
      name: '注册',
      hidden: true,
      component: Reg
    },
     {
      path: '/home',
      component: Home,
      name: '',
      hidden: true,
      children: [
        {
          path:'/init',
          component:Init,
          name:''
        },
        {
          path: '/personal',
          component: Personal,
          name: '个人中心'
        }
      ]
    }, {
      path: '/home',
      component: Home,
      name: '',
      children: [
        {
          path: '/category',
          iconCls: 'fa fa-reorder',
          name: '类别管理',
          component: CategoryList
        }
      ]
    }
    , {
      path: "/home",
      component: Home,
      iconCls: 'fa fa-flask',
      name: '药品管理',
      children: [
        {
          path: '/medicines',
          name: '药品列表',
          component: MedicineList,
          meta: {
            keepAlive: false
          }
        },
        {
          path: '/addmedicine',
          name: '药品添加',
          component: MedicineAdd,
          meta: {
            keepAlive: false
          }
        }
      ]
    }, {
      path: '/home',
      component: Home,
      name: '订单管理',
      iconCls: 'fa fa-file-o',
      children: [
        {
          path: '/orderlist',
          name: '订单列表',
          component: OrderList,
          meta: {
            keepAlive: true
          }
        }, {
          path: '/orderadd',
          name: '添加订单',
          component: OrderAdd,
          mata: {
            keepAlive: false
          }
        }
      ]
    }
  ]
})
