<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商家管理</el-breadcrumb-item>
      <el-breadcrumb-item>评价列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">综合平均分数：{{ totalScore }}</el-col>
        <el-col :span="6">服务平均分数：{{ serveScore }}</el-col>
        <el-col :span="6">口味平均分数：{{ tasteScore }}</el-col>
      </el-row>
      <el-table :data="comment" stripe border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="订单号：">
                {{ props.row.orderId }}
              </el-form-item>
              <el-form-item v-if="props.row.ratePics.length" label="图片：">
                <img
                  v-for="(item, index) in props.row.ratePics"
                  :key="index"
                  :src="item.url"
                  width="150px"
                  style="margin:10px"
                />
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评论内容"> </el-table-column>
        <el-table-column prop="totalScore" width="80px" label="综合评分">
        </el-table-column>
        <el-table-column prop="serveScore" width="80px" label="服务评分">
        </el-table-column>
        <el-table-column prop="tasteScore" width="80px" label="口味评分">
        </el-table-column>

        <el-table-column width="100px" label="评论时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | fmtTime }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="daleteComment(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="paramInfo.total"
        :current-page="paramInfo.current"
        @current-change="currentChange"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  components: {},
  props: {},
  data() {
    return {
      comment: [],
      tasteScore: 0,
      serveScore: 0,
      totalScore: 0,
      paramInfo: {
        pagesize: 10,
        current: 1,
        total: 100,
      },
    };
  },
  created() {
    this.getComment();
  },
  filters: {
    fmtTime(date) {
      return dayjs(date).format("YYYY-MM-DD"); // 使用 dayjs 格式化时间
    },
  },
  methods: {
    currentChange(page) {
      this.paramInfo.current = page;
      this.getComment();
    },
    async getComment() {
      let { data } = await this.$http.get("comment");
      console.log(data);
      let length = data.length;
      this.totalScore = (
        data.reduce((total, score) => (total += score.totalScore), 0) / length
      ).toFixed(1);
      this.serveScore = (
        data.reduce((total, score) => (total += score.serveScore), 0) / length
      ).toFixed(1);
      this.tasteScore = (
        data.reduce((total, score) => (total += score.tasteScore), 0) / length
      ).toFixed(1);

      let nowPage = (this.paramInfo.current - 1) * this.paramInfo.pagesize;
      this.paramInfo.total = length;
      this.comment = data.slice(nowPage, nowPage + this.paramInfo.pagesize);
    },
    async daleteComment(item) {
      this.$confirm(`此操作将永久删除该评价, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.id = item._id;
          const res = await this.$http.delete(`comment/${this.id}`);
          this.getComment();
          this.id = "";
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.id = "";
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  watch: {},
};
</script>

<style  scoped lang='less'>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
  font-weight: bold;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.el-row {
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #aaa;
}
</style>