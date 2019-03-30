// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import './utils/filter_utils.js'
import moment from 'moment'


Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$moment = moment;
window.bus = new Vue();
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
