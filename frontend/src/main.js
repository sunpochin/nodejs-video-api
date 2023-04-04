import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vue3GoogleLogin from 'vue3-google-login';

const app = createApp(App);

app.use(vue3GoogleLogin, {
	clientId:
		'266847528060-86qmub9fgtbtavdkvicc98h5qmot8iub.apps.googleusercontent.com',
	buttonConfig: { type: 'icon', locale: 'zh_TW' },
});


app.mount('#app');