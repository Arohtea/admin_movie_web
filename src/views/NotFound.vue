<template>
  <div class="not-found">
    <h1>404 - 页面未找到</h1>
    <p>对不起，你访问的页面不存在。</p>
    <P style="font-style: italic; font-weight: bold;font-size:31px">前面的区域以后再来探索吧</P>
    <p>前端制作：李思源</p>
    <p>后端制作：罗嘉豪</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 50px;
}
</style>