<template>
  <header class="top-nav">
    <div class="logo-container">
      <router-link to="/frontpage">
        <img src="https://movie-web12321.oss-cn-beijing.aliyuncs.com/e201475f-0ccf-4087-ac24-ead6d9d362f1.jpg" alt="Logo" style="width: 40px;">
      </router-link>
      <router-link to="/frontpage" style="text-decoration: none ;color :black">电影网站管理系统</router-link>
      <div class="space" style="width:10px"></div>
    </div>
    <div class="middle-space"></div>
  </header>
</template>

<script>
import router from '@/router';
import { mapState } from 'vuex'

export default {
  router,
  computed: {
    ...mapState(['logincode']),
   avatarr() {
    return this.avatar;
   }
  },
  data() {
    return {
    };
  },
};
</script>

<style scoped>
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f9fa;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-container img {
  margin-right: 10px;
  border-radius: 50%;
}

.middle-space {
  flex-grow: 1;
  /* 这个div将占据剩余的所有空间 */
}
.user-profile {
  display: flex;
  align-items: center;
}
.user-profile img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.username {
  margin-top: -30px ;
  margin-right: 10px;
  font-size: 16px;
  display: inline-block; /* 保证文本不会换行 */
  vertical-align: middle; /* 文本垂直居中 */
}
</style>