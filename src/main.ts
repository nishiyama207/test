// セットアップ系の処理
// olのcss読込や、「App.vue」とindex.html内のエレメントとの紐づけ処理

import { createApp } from 'vue'
import App from './App.vue'
import 'ol/ol.css'

createApp(App).mount('#app')