import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vant from 'vant'
import 'amfe-flexible'
import HmHeader from './components/HmHeader.vue'
import HmLogo from './components/HmLogo.vue'
import axios from 'axios'
// 导入通用样式
import './style/base.less'
import './style/iconfont.css'
import 'vant/lib/index.css'
// 全局注册组件
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
// 把axios挂载到vue的原型
Vue.prototype.$axios = axios
// 给axios配置默认的baseURL ,基准地址
axios.defaults.baseURL = 'http://localhost:3000'
// 导入Vant
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
