<template>
  <div class="comment-management">
    <el-form :model="form" ref="form" :rules="rules" label-width="120px" class="comment-form">
      <el-form-item label="电影ID">
        <el-input v-model.number="form.id" placeholder="请输入电影ID" @input="debounceLoadComments"></el-input>
      </el-form-item>
    </el-form>
    <el-card v-if="movie.length > 0" class="movie-details">
        <el-descriptions :column="1" border :content-style="{ width: '1500px' }">
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
    <el-card v-if="currentComments.length > 0" class="comments-list">
      <el-table :data="currentComments" style="width: 100%">
        <el-table-column prop="text" label="评论内容" width="300">
        </el-table-column>
        <el-table-column prop="author" label="用户名" width="150">
        </el-table-column>
        <el-table-column prop="date" label="时间" width="200">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="danger" size="small" @click="showDeleteConfirmation(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total,prev, pager, next,jumper" :total="totalComments" :page-size="pageSize"
        :current-page="currentPage" @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>

    <el-dialog title="提示" :visible.sync="confirmVisible" width="30%" center>
      <span>确定要删除此评论吗？</span>
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
      movie: [],
      categories:[],
      currentComments: [],
      totalComments: 0,
      pageSize: 10,
      currentPage: 1,
      confirmVisible: false,
      selectedComment: null
    };
  },
  created() {

  },
  methods: {
    loadMovieById() {
      const movieId = this.form.id;
      if (!movieId) {
        this.$message.warning('请输入有效的电影ID');
        return;
      }

      instance.get(`/movie/search?id=${movieId}`)
        .then(response => {
          if (response.data.data ==null) {
            this.$message.error('加载电影失败');
            console.log('Failed to load movie')
            return;
          }
          const movie = response.data.data;
          instance.get('/category').then(res => {
            if (res.data.code === 0) {
              this.categories = res.data.data;
              for (let i = 0; i < this.categories.length; i++) {
                const category = this.categories[i];
                if (category.id === movie.categoryId) {
                  movie.categoryId = category.name;
                  break;
                }
              }
            } else {
              this.$message.error('获取电影分类失败');
            }
          });
          this.movie = [movie];
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
    showDeleteConfirmation(comment) {
      this.selectedComment = comment;
      this.confirmVisible = true;
    },
    cancelDelete() {
      this.confirmVisible = false;
    },
    confirmDelete() {
      this.confirmVisible = false;
      instance.delete(`/comment?id=${this.selectedComment.id}`)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success('删除成功');
            this.loadComments(this.currentPage);
          } else {
            this.$message.error('删除失败');
          }
        })
        .catch(error => {
          console.error('Failed to delete comment:', error);
          this.$message.error('删除失败');
        });
    },
    debounceLoadComments() {
      if (this.loadTimer) {
        clearTimeout(this.loadTimer);
      }
      this.loadTimer = setTimeout(() => {
        this.loadMovieById();
        this.loadComments(this.currentPage);
      }, 300);
    },
    loadComments(page = 1) {
      const movieId = this.form.id;
      if (!movieId) {
        this.$message.warning('请输入有效的电影ID');
        return;
      }

      instance.get(`/comment?pageNum=${page}&pageSize=${this.pageSize}&movieId=${movieId}`)
        .then(response => {
          if (response.data.code==1) {
            this.$message.warning(response.data.message);
            console.log('Failed to load comments')
            return;
          }
          const { items, total } = response.data.data;
          this.currentComments = items;
          this.totalComments = total;
        })
        .catch(error => {
            console.error('Failed to load comments:', error);
            this.$message.error('加载评论失败');
        });
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.loadComments(page);
    }
  }
};
</script>

<style scoped>
.comment-management {
  display: flex;
  flex-direction: column;
}

.comment-form {
  margin-bottom: 20px;
}

.comments-list {
  margin-top: 20px;
}
</style>