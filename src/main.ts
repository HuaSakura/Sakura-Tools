import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";

createApp(App).use(router).mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })

  window.ipcRenderer.on('setting-config',(_event, message)=>{
    const data = JSON.parse(message)
    Object.keys(data).forEach((key) => {
      localStorage.setItem(key, data[key])
    })
  })
})
