<template>
  <div class="container">
    <el-card class="create-section">
      <h2>创建新的电影分类</h2>
      <el-input v-model="newCategoryName" placeholder="请输入分类名称"></el-input>
      <el-button type="primary" @click="addCategory">添加分类</el-button>
    </el-card>

    <el-card class="list-section">
      <h2>已有的电影分类</h2>
      <el-table :data="categories" style="width: 100%">
        <el-table-column prop="id" label="分类ID" width="80">
        </el-table-column>
        <el-table-column prop="name" label="分类名称" width="180">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import instance from '@/instance/instance';
export default {
  data() {
    return {
      newCategoryName: '',
      categories: [
        { id:1,name: '科幻' },
        { id:2,name: '动作' },
        { id:3,name: '喜剧' }
      ]
    };
  },
  methods: {
    async addCategory() {
      if (this.newCategoryName.trim()) {
        instance.post('/category', { name: this.newCategoryName }).then(response => {
          if (response.code === 0) {
            this.fetchcategories();
            this.newCategoryName = '';
          } else {
            // alert('添加电影分类失败');
            this.$message.error('添加电影分类失败');
          }
        });
      }
    },
    async fetchcategories() {
     instance.get('/category').then(response => {
      if (response.code === 0){
      this.categories = response.data;
    }
      else{
        // alert('获取电影分类失败');
        this.$message.error('获取电影分类失败');
      }
    });
    }
  },
  created() {
    this.fetchcategories();
  }
};
</script>
<style scoped>
.container {
  margin: 0 auto;
}

.create-section, .list-section {
  margin-bottom: 20px;
}
.el-button {
  margin-top: 10px;
}
</style>
