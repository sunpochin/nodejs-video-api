<script setup>
// https://ithelp.ithome.com.tw/articles/10304289
import axios from "axios";
import { ref } from 'vue'
const data = ref()

const callback = async (response) => {
  // write google login logic here

  data.value = response
  console.log('data.value: ', data.value)
  console.log('credential: ', data.value.credential)

  let authme = "https://nodejs-video-api.onrender.com/google"
  authme = "http://localhost:8000/google"
  // console.log('auth me: ', authme)
  await axios
    .post(authme, {
      credential: data.value.credential,
    }).then((res) => {
      console.log('res.data: ', res.data);
      data.value = `Hello: ${res.data.email}`;
      //this.setMe(res.data)
    });


}
</script>

<template>
  <div>
    <GoogleLogin :callback="callback" />
    <br>
    <GoogleLogin :logoutButton=true>Logout</GoogleLogin>
    <p>
      {{ data }}
    </p>
  </div>
</template>

<style scoped>
p {
  margin-top: 12px;
  word-break: break-all;
}
</style>
