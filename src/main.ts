// Start the app: plug in the router, then show App.vue inside <div id="app"> in index.html.
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

createApp(App).use(router).mount('#app')
