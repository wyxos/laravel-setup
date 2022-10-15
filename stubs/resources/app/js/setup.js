import './bootstrap';
// import '../scss/app.scss'
import '../css/app.css'
import {createApp} from 'vue/dist/vue.esm-bundler'
import plugins from "./plugins";

export default function setup(element) {
    const app = createApp(element)

    plugins.forEach(plugin => {
        app.use(plugin[0], plugin[1])
    })

    app.mount('#app');
}
