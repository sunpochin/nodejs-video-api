<script setup>
import { onMounted } from "vue"
import { ref } from 'vue'
import { decodeCredential } from 'vue3-google-login'
import { googleOneTap, googleAuthCodeLogin, googleTokenLogin } from "vue3-google-login"

import axios from "axios";

const userInfo = ref();

const data = ref()
const parseResponse = (response) => {
  // console.log("Handle the response", response)
  // console.log("credential", response.credential)
  data.value = decodeCredential(response.credential)
  console.log("Handle the userData: ", data)
  console.log("Handle the value: ", data.value)
  const str = JSON.stringify(data.value);
  const str2 = data["_rawValue"]
  console.log("string: ", str2)
  console.log("email: ", str2.email)
  data.value = `Hello, ${str2.email}`
}

const login = async(response) => {
//  parseResponse(response);

  let access_token = ''
  await googleTokenLogin().then((response) => {
    access_token = response.access_token;
    // console.log("Handle the response", response)
    // console.log("access_token: ", access_token)
  })

  // await axios.post('http://localhost:5173/', {
  //   access_token: access_token,
  //   initialCache: false
  // })
  // .then( (response) => {
  //   // console.log('response: ', response)
  //   // console.log('data: ', response.data)
  //   data.value = response.data.email
  // })
  // .catch( (error) => console.log('error: ', error))
}

const callback = (response) => {
  parseResponse(response)

}
onMounted(() => {
    googleOneTap({ autoLogin: true })
    .then((response) => {
      // This promise is resolved when user selects an account from the the One Tap prompt
      parseResponse(response)
    })
    .catch((error) => {
      console.log("Handle the error", error)
    })
})

</script>

<template>
  <div>
    Login Part
    <br>
    <br>
    <button type="button" @click="login"> 使用 google 繼續</button>

    <div :class="{ invisible: true }">
      <GoogleLogin :callback="callback" popup-type="TOKEN" />
    </div>
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

.invisible {
  visibility: hidden;
}
</style>
