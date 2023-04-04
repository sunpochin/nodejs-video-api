<!-- <script setup>
import { onMounted } from "vue"
import { ref } from 'vue'

import axios from "axios";

const userInfo = ref();

const data = ref()
// onMounted(() => {
//     console.log('mounted')
//     getMe();
// })
</script> -->
<template>
  <div>
    <div :class="{ invisible: false }">
      <button @click="authorize">登入 with Google</button>
    </div>
    <div> {{ this.meEmail }}</div>
  </div>
</template>


<script >
  import axios from 'axios'
  export default{
    created(){
      console.log('created');
    },
    setup(){
      console.log('setup');
    },
    data() {
      return {
        loggedIn: false,
        meEmail: 'email',
      }
    },

    mounted() {
      console.log('mounted')
      this.getMe();
  //    this.searchCourse();
    },
    methods: {
      setMe(data) {
        try {
          console.log('me data: ', data);
          this.meEmail = data.email;
          if (this.meEmail.trim() !== "") {
            this.loggedIn = true;
          }
        } catch(e) {
          console.log('error: ', e)
        }
      },
      async getMe() {
        let authme = "https://nodejs-video-api.onrender.com/auth/me"
        authme = "http://localhost:8000/auth/me"
        console.log('auth me: ', authme)
        await axios
          .get(authme, {
            withCredentials: true,
          })
          .then((res) => this.setMe(res.data));
      },
      authorize() {
        window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fgoogle%2Fcallback&client_id=266847528060-86qmub9fgtbtavdkvicc98h5qmot8iub.apps.googleusercontent.com&access_type=offline&response_type=code&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email"
        // window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https%3A%2F%2Fnodejs-video-api.onrender.com%2Fauth%2Fgoogle%2Fcallback&client_id=266847528060-86qmub9fgtbtavdkvicc98h5qmot8iub.apps.googleusercontent.com&access_type=offline&response_type=code&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email"
    },

    },

    data() {
      return {
        loggedIn: false,
        meEmail: '',
        // 3 initial demo videos of cat and dog.
        searchString: '餵食貓咪',
        // youtubeIdList: ['HlFgIBAm0Jg','OgyZIZMZAUM', 'XcDtulLcrbU'],
        youtubeIdList: [],

        videoId: '',
        // 3 initial demo videos of cat and dog.
        vimeoIdList: ['807306477', '807306201', '192191']
      }
    },

  }
 
</script>

<style scoped>
p {
  margin-top: 12px;
  word-break: break-all;
}

.invisible {
  visibility: hidden;
}
</style>
