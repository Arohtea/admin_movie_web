<template>
  <div class="movie-management">
    <!-- 新增电影表单 -->
    <el-form :model="form" ref="form" :rules="rules" label-width="120px" class="movie-form">
      <el-form-item prop="categoryId" label="电影分类">
        <el-input v-model="form.categoryId"></el-input>
      </el-form-item>
      <el-form-item prop="title" label="电影名称">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item prop="imgsrc" label="电影图像地址">
        <el-input v-model="form.imgsrc"></el-input>
      </el-form-item>
      <el-form-item prop="imgcsrc" label="轮播图地址">
        <el-input v-model="form.imgcsrc"></el-input>
      </el-form-item>
      <el-form-item prop="actors" label="电影演员">
        <el-input v-model="form.actors"></el-input>
      </el-form-item>
      <el-form-item prop="director" label="电影导演">
        <el-input v-model="form.director"></el-input>
      </el-form-item>
      <el-form-item prop="country" label="国家">
        <el-input v-model="form.country"></el-input>
      </el-form-item>
      <el-form-item prop="year" label="上映年份">
        <el-input v-model.number="form.year"></el-input>
      </el-form-item>
      <el-form-item label="是否轮播">
        <el-switch v-model="status" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="movies" style="width: 100%" class="movie-list">
      <el-table-column prop="title" label="电影名称" width="180"></el-table-column>
      <el-table-column prop="categoryId" label="电影分类" width="180"></el-table-column>
      <el-table-column prop="year" label="上映年份" width="180"></el-table-column>
      <el-table-column prop="director" label="导演"></el-table-column>
      <el-table-column prop="actors" label="演员"></el-table-column>
      <el-table-column prop="imgsrc" label="图片地址"></el-table-column>
      <el-table-column prop="imgcsrc" label="轮播图地址"></el-table-column>
      <el-table-column prop="country" label="国家"></el-table-column>
      <el-table-column label="是否轮播" width="180">
        <template #default="{ row }">
          {{ row.status === 1 ? '是' : '否' }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import instance from '@/instance/instance';

export default {
  data() {
    return {
      form: {
        categoryId: '',
        title: '',
        imgsrc: '',
        imgcsrc: '',
        actors: '',
        director: '',
        country: '',
        year: null,
        status: 0
      },
      status: '1',
      movies: [],
      currentPage: 1, 
      pageSize: 10, 
      total: 0,
      rules: {
        categoryId: [{ required: true, message: '请输入电影分类', trigger: 'blur' }],
        title: [{ required: true, message: '请输入电影名称', trigger: 'blur' }],
        imgsrc: [{ required: true, message: '请输入电影图像地址', trigger: 'blur' }],
        imgcsrc: [{ required: true, message: '请输入电影轮播图地址', trigger: 'blur' }],
        actors: [{ required: true, message: '请输入电影演员', trigger: 'blur' }],
        director: [{ required: true, message: '请输入电影导演', trigger: 'blur' }],
        country: [{ required: true, message: '请输入国家', trigger: 'blur' }],
        year: [{ required: true, message: '请输入上映年份', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.fetchMovies();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.status === '1') {
          this.form.status = 1;
        } else {
          this.form.status = 0;
        }
        if (valid) {
          instance.post('/movie', this.form)
            .then(response => {
              if (response.data.code === 0) {
                this.fetchMovies();
                this.resetForm(formName);
              } else {
                this.$message.error('添加电影失败');
              }
            })
            .catch(error => {
              console.error('Failed to add movie:', error);
              this.$message.error('添加电影失败');
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    fetchMovies(page = this.currentPage) {
      instance.get('/movie', {
        params: {
          pageNum: page,
          pageSize: this.pageSize
        }
      })
        .then(response => {
          this.movies = response.data.items;
          this.total = response.data.total; 
        })
        .catch(error => {
          console.error('Failed to fetch movies:', error);
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchMovies(val);
    }
  }
};
</script>

<style scoped>
.movie-management {
  display: flex;
  flex-direction: column;
}
.movie-form {
  margin-bottom: 20px;
}
</style>