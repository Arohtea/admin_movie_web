<template>
  <div class="movie-management">
    <el-form :model="form" ref="form" :rules="rules" label-width="120px" class="movie-form">
      <el-form-item prop="categoryId" label="电影分类">
        <el-input v-model.number="form.categoryId"></el-input>
      </el-form-item>
      <el-form-item prop="title" label="电影名称">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item prop="imgsrc" label="电影图像地址">
        <el-upload action="http://localhost:8080/upload" :show-file-list="false" :on-success="handleAvatarSuccess"
            class="avatar-uploader" accept="image/*" :before-upload="beforeAvatarUpload">
            <el-button size="small">上传文件</el-button>
          </el-upload>
      </el-form-item>
      <el-form-item prop="imgcsrc" label="轮播图地址">
        <el-upload action="http://localhost:8080/upload" :show-file-list="false" :on-success="handleSuccess"
            class="avatar-uploader" accept="image/*" :before-upload="beforeAvatarUpload">
            <el-button size="small">上传文件</el-button>
          </el-upload>
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
        categoryId:null,
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
        // imgsrc: [{ required: true, message: '请输入电影图像地址', trigger: 'blur' }],
        // imgcsrc: [{ required: true, message: '请输入电影轮播图地址', trigger: 'blur' }],
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
          this.movies = response.data.data.items;
          this.total = response.data.data.total; 
        })
        .catch(error => {
          console.error('Failed to fetch movies:', error);
          this.$message.error('获取电影列表失败');
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchMovies(val);
    },
    beforeAvatarUpload(file) {
    const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1920 / 1080 < 12;

    if (!isJPGorPNG) {
      this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
    }
    if (!isLt2M) {
      this.$message.error('上传图片大小不能超过 12MB!');
    }
    return isJPGorPNG && isLt2M;
  },
    handleAvatarSuccess(response) {
      console.log(response.code);
      if (response!=null) {
        console.log(response.data);
        this.form.imgsrc = response.data;
        this.$message.success('上传成功');
      } else {
        this.$message.error('上传失败');
      }
    },
    handleSuccess(response) {
      if (response.code === 0) {
        this.form.imgcsrc = response.data;
        this.$message.success('上传成功');
      } else {
        this.$message.error('上传失败');
      }
    },
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