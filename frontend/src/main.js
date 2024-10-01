import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import FlashMessage from '@smartweb/vue-flash-message';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import VuePapaParse from 'vue-papa-parse'
import CKEditor from '@ckeditor/ckeditor5-vue';
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    iconfont: 'mdi',
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

library.add(fas, far)
dom.watch()

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(FlashMessage);
app.use(router)
app.use(VuePapaParse)
app.use( CKEditor )
app.use(VueTelInput);
app.mount('#app')
app.use(VueSweetalert2);
app.use(vuetify)
