<template>
    <div>
  <TopHeader></TopHeader>
  <div id="navg">
      <el-container>
        <el-aside width="200px">
          <el-menu router>
            <el-submenu index="1">
              <template slot="title">电影分类管理</template>
              <el-menu-item index="/category/add">新增</el-menu-item>
              <el-menu-item index="/category/update">更新</el-menu-item>
              <el-menu-item index="/category/delete">删除</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">电影管理</template>
              <el-menu-item index="/movie/add">新增</el-menu-item>
              <el-menu-item index="/movie/search">搜索</el-menu-item>
              <el-menu-item index="/movie/update">更新</el-menu-item>
              <el-menu-item index="/movie/delete">删除</el-menu-item>
              <el-menu-item index="/component/delete">评论</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </div>     
</div>
</template>

<script>
import TopHeader from '../components/TopHeader.vue'
export default {
    components: {
        TopHeader,   
    }
}
</script>

<style>

</style>