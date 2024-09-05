<template>
  <div class="movie-search">
    <el-form :model="searchForm" class="search-form">
      <el-form-item prop="keyword">
        <el-input v-model="searchForm.keyword" placeholder="请输入关键词"  @keyup.enter.prevent="searchMovies">
          <template #append>
            <el-button slot="append" icon="el-icon-search" @click="searchMovies"></el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <el-table :data="searchResults" style="width: 100%" class="movie-list">
      <el-table-column prop="id" label="电影ID" width="180"></el-table-column>
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
      layout="total,prev, pager, next,jumper"
      :total="searchTotal"
      :page-size="searchPageSize"
      :current-page.sync="searchCurrentPage"
      @current-change="handleSearchCurrentChange"
    />
  </div>
</template>

<script>
import instance from '@/instance/instance';


export default {
  data() {
    return {
      searchForm: {
        keyword: ''
      },
      searchResults: [],
      searchCurrentPage: 1,
      searchPageSize: 10,
      searchTotal: 0,
      categories:[]
    };
  },
  methods: {
    searchMovies() {
      if (this.searchForm.keyword.length === 0) {
        this.$message.warning('请输入关键词');
        return;
      }
      if (this.searchForm.keyword.length >0) {
        instance.get('/movie/detail', {
          params: {
            pageNum: this.searchCurrentPage,
            pageSize: this.searchPageSize,
            name: this.searchForm.keyword,
          }
        })
          .then(response => {
            this.searchResults = response.data.data.items;
            this.searchTotal = response.data.data.total;
            if (this.searchResults.length === 0) {
              this.$message.warning('未找到相关电影');
            }else{
              instance.get('/category').then(res => {
            if (res.data.code === 0) {
              this.categories = res.data.data;
              this.searchResults.forEach(searchResults => {
              const category = this.categories.find(c => c.id === searchResults.categoryId);
              if (category) {
                searchResults.categoryId = category.name;
              } else {
                searchResults.categoryId = ''; 
              }
              console.log(searchResults.categoryId);
            });
            } else {
              this.$message.error('获取电影分类失败');
            }
          });
            }
          })
          .catch(error => {
            console.error('Failed to search movies:', error);
            this.$message.error('搜索电影失败');
          });
      }
    },
    handleSearchCurrentChange(val) {
      this.searchCurrentPage = val;
      this.searchMovies();
    }
  }
};
</script>

<style scoped>
.movie-search {
  display: flex;
  flex-direction: column;
}
.search-form {
  margin-bottom: 20px;
}
</style>