import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/components/Login";
import Reg from "@/components/Reg";
import Home from "@/components/Home";
import Category from "@/components/Category";
import AddDrug from "@/components/AddDrug";
import DrugList from "@/components/DrugList";
import OrderList from "@/components/OrderList";
import OrderAdd from "@/components/OrderAdd";
import Personal from "@/components/Personal";


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
      name: '',
      hidden: true,
      component: Home
    }, {
      path: '/home',
      component: Home,
      name: '',
      hidden: true,
      children: [
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
          component: Category
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
          path: '/druglist',
          name: '药品列表',
          component: DrugList,
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/drugadd',
          name: '药品添加',
          component: AddDrug,
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
