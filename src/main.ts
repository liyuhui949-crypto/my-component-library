import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import ElementPlus from 'element-plus'
import Vant from 'vant'
import VxeUI from 'vxe-table'
import VxeUIPluginElement from 'vxe-table-plugin-element'

import App from './App.vue'
import router from './router'

import 'element-plus/dist/index.css'
import 'vant/lib/index.css'
import 'vuetify/styles'
import 'vxe-table/lib/style.css'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(vuetify)
app.use(Vant)

VxeUI.use(VxeUIPluginElement)
app.use(VxeUI)

app.mount('#app')
