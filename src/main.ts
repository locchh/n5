// Start the app: plug in the router and the stylesheet, then show App.vue inside <div id="app"> in index.html.
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './style.css'

createApp(App).use(router).mount('#app')
