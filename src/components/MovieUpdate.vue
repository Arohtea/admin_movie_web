<template>
  <div class="movie-management">
    <el-form :model="form" ref="form" :rules="rules" label-width="120px" class="movie-form">
      <el-form-item label="电影ID">
        <el-input v-model.number="form.id" placeholder="请输入电影ID" @input="debounceLoadMovieById"></el-input>
      </el-form-item>
      <el-form-item prop="categoryId" label="电影分类">
        <el-input v-model.number="form.categoryId"></el-input>
      </el-form-item>
      <el-form-item prop="title" label="电影名称">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item prop="imgsrc" label="电影图像地址">
        <el-upload action="http://localhost:8080/upload" :show-file-list="false" :on-success="handleAvatarSuccess"
            class="avatar-uploader" accept="image/*" :before-upload="beforeAvatarUpload" :multiple="false">
            <el-button size="small">上传文件</el-button>
          </el-upload>
      </el-form-item>
      <el-form-item prop="imgcsrc" label="轮播图地址">
        <el-upload action="http://localhost:8080/upload" :show-file-list="false" :on-success="handleSuccess"
            class="avatar-uploader" accept="image/*" :before-upload="beforeAvatarUpload" :multiple="false">
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
  </div>
</template>

<script>
import instance from '@/instance/instance';

export default {
  data() {
    return {
      form: {
        id: null,
        categoryId: null,
        title: '',
        imgsrc: '',
        imgcsrc: '',
        actors: '',
        director: '',
        country: '',
        year: null,
        status: 0
      },
      status: '0',
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
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.status === '1') {
          this.form.status = 1;
        } else {
          this.form.status = 0;
        }
        if (valid) {
          instance.put('/movie', this.form)
            .then(response => {
              if (response.data.code === 0) {
                // this.loadMovieById();
                this.$message.success('更新电影成功');
                this.resetForm(formName);
              } else {
                this.$message.error('更新电影失败');
              }
            })
            .catch(error => {
              console.error('Failed to update movie:', error);
              this.$message.error('更新电影失败');
            });
        } else {
          console.log('error submit!!');
          
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.form.id = null; 
    },
    debounceLoadMovieById() {
      if (this.loadTimer) {
        clearTimeout(this.loadTimer);
      }
      this.loadTimer = setTimeout(() => {
        this.loadMovieById();
      }, 300);
    },
    loadMovieById() {
      const movieId = this.form.id;
      if (!movieId) {
        this.$message.warning('请输入有效的电影ID');
        return;
      }

      instance.get(`/movie/search?id=${movieId}`)
        .then(response => {
          if (response.data.code !== 0) {
            this.$message.error('未找到该电影');
            return;
          }
          const movie = response.data.data;
          this.form.categoryId = movie.categoryId;
          this.form.title = movie.title;
          this.form.imgsrc = movie.imgsrc;
          this.form.imgcsrc = movie.imgcsrc;
          this.form.actors = movie.actors;
          this.form.director = movie.director;
          this.form.country = movie.country;
          this.form.year = movie.year;
          this.status = movie.status.toString();
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            this.$message.error('未找到该电影');
          } else {
            console.error('Failed to load movie:', error);
            this.$message.error('加载电影失败');
          }
        });
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
      if (response.code === 0) {
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