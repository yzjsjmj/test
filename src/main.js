// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import {Promise} from 'es6-promise-polyfill';
import promise from 'es6-promise';
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'
import VueResource from 'vue-resource';
import iconfont from './assets/icon/iconfont.css'
import Global  from './assets/utils/global.js' 
   

promise.polyfill();
Vue.config.productionTip = false;
Vue.use(ElementUI);                  //elementUI 组件
Vue.use(VueResource);               // ajax请求
Vue.prototype.$echarts = echarts    //echarts全局注入
Vue.use(Global)                     //全局使用Global
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
