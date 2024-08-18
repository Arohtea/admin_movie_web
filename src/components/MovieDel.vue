<template>
  <div class="movie-management">
    <el-form :model="form" ref="form" :rules="rules" label-width="120px" class="movie-form">
      <el-form-item label="电影ID">
        <el-input v-model.number="form.id" placeholder="请输入电影ID" @input="debounceLoadMovieById"></el-input>
      </el-form-item>
      <el-card v-if="movie.length > 0" class="movie-details">
        <el-descriptions :column="1" border :content-style="{ width: '1800px' }">
          <el-descriptions-item label="电影名称">{{ movie[0].title }}</el-descriptions-item>
          <el-descriptions-item label="电影分类">{{ movie[0].categoryId }}</el-descriptions-item>
          <el-descriptions-item label="上映年份">{{ movie[0].year }}</el-descriptions-item>
          <el-descriptions-item label="导演">{{ movie[0].director }}</el-descriptions-item>
          <el-descriptions-item label="演员">{{ movie[0].actors }}</el-descriptions-item>
          <el-descriptions-item label="图片地址">{{ movie[0].imgsrc }}</el-descriptions-item>
          <el-descriptions-item label="轮播图地址">{{ movie[0].imgcsrc }}</el-descriptions-item>
          <el-descriptions-item label="国家">{{ movie[0].country }}</el-descriptions-item>
          <el-descriptions-item label="是否轮播">
            {{ movie[0].status === 1 ? '是' : '否' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <p></p>
      <el-form-item>
        <el-button type="primary" @click="deleteMovie">删除</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="提示" :visible.sync="confirmVisible" width="30%" center>
      <span>确定要删除此电影吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDelete">取 消</el-button>
        <el-button type="primary" @click="confirmDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import instance from '@/instance/instance';

export default {
  data() {
    return {
      form: {
        id: null
      },
      movie: [{}],
      confirmVisible: false
    };
  },
  created() {
    
  },
  methods: {
    deleteMovie() {
      if (!this.form.id) {
        this.$message.warning('请输入有效的电影ID');
        return;
      }

      instance.delete(`/movie?id=${this.form.id}`)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success('删除成功');
            this.form.id = null; 
            this.movie = []; 
          } else {
            this.$message.error('删除失败');
          }
        })
        .catch(error => {
          console.error('Failed to delete movie:', error);
          this.$message.error('删除失败');
        });
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
          const movie = response.data.data;
          this.movie[0] = movie;
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            this.$message.error('未找到该电影');
          } else {
            console.error('Failed to load movie:', error);
            this.$message.error('加载电影失败');
          }
        });
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
.movie-details {
  margin-top: 20px;
}
</style>