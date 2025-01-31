
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import { createRouter, createWebHashHistory } from 'vue-router'
import PasswordSetup from './views/PasswordSetup.vue'
import PasswordPrompt from './views/PasswordPrompt.vue'
import TextEditor from './views/TextEditor.vue'

const routes = [
  { path: '/passwordSetup', component: PasswordSetup },
  { path: '/passwordPrompt', component: PasswordPrompt },
  { path: '/textEditor', component: TextEditor },
  { path: '/', redirect: '/passwordPrompt' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

createApp(App).use(router).mount('#app')
