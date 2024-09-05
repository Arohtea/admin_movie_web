<template>
  <div class="container">
    <el-card class="update-section">
      <h2>更新电影分类</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="选择分类" prop="selectedCategory">
          <el-select v-model="form.selectedCategory" placeholder="请选择分类" @change="onCategoryChange">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入修改后分类名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">更新分类</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="list-section">
      <h2>已有的电影分类</h2>
      <el-table :data="categories" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80">
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
      form: {
        selectedCategory: '', 
        name: '',
      },
      categories: [],
      rules: {
        selectedCategory: [{ required: true, message: '请选择分类', trigger: 'change' }],
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    };
  },
  methods: {
    onCategoryChange(value) {
      this.form.selectedCategory = value;
    },
    async fetchCategories() {
      instance.get('/category').then(response => {
        if (response.data.code === 0) {
          this.categories = response.data.data;
        } else {
          this.$message.error('获取电影分类失败');
        }
      });
    },
    async submitForm() {
      const formRef = this.$refs.formRef;
      formRef.validate(async valid => {
        if (valid) {
          if (this.form.selectedCategory === '') {
            this.$message.warning('请选择分类');
            return;
          }
          const categoryId = Number(this.form.selectedCategory);
          const updatedData = {
            id: categoryId,
            name: this.form.name
          };
          try {
            const response=await instance.put('/category', updatedData);
            if (response.data.code === 0){
              this.$message.success('更新电影分类成功');
            }
            this.fetchCategories();
            this.form.selectedCategory = ''; 
            this.form.name = '';
          } catch (error) {
            this.$message.error('更新电影分类失败');
          }
        } else {
          // console.log('Validation failed');
          this.$message.error('请输入分类名称');
          return false;
        }
      });
    }
  },
  created() {
    this.fetchCategories();
  }
};
</script>

<style scoped>
.container {
  margin: 0 auto;
}

.update-section, .list-section {
  margin-bottom: 20px;
}

.update-section h2, .list-section h2 {
  margin-bottom: 10px;
}
</style>