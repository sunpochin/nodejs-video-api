<template>
  <div>
    <div :class="{ invisible: false }">
      <button @click="myCourses">My Courses</button>
      <div> {{ this.courseList }}</div>

    </div>
  </div>
</template>

<script >
  import axios from 'axios'
  export default{
    data() {
      return {
        courseList: 'courses',
      }
    },
    mounted() {
      this.myCourses();
    },
    methods: {
      setMessage(msg) {
        //setting new message
        this.courseList = msg;
      },

      myCourses() {
        axios.get("http://localhost:8000/courses", {
            withCredentials: true,
          })
          .then((res) => {
            // this.courseList = `${res.data}`;
            this.setMessage(res.data);
            console.log('res data: ', res.data);
            console.log('course list: ', this.courseList)
          });
      },
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
