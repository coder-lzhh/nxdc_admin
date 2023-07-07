<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="usersList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="userPhone"
          width="110px"
          label="账号"
        ></el-table-column>
        <el-table-column prop="nikeName" label="昵称"></el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            {{ scope.row.sex ? "男士" : "女士" }}
          </template>
        </el-table-column>
        <el-table-column prop="consum" label="积分"></el-table-column>
        <el-table-column label="注册时间" width="130px">
          <template slot-scope="scope">
            {{ scope.row | fmtTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="openEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="daleteUser(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="编辑信息" :visible.sync="userVisible" width="70%">
      <el-form :model="userParams" label-width="80px">
        <el-form-item label="用户昵称">
          <el-input v-model="userParams.nikeName"></el-input>
        </el-form-item>
        <el-form-item label="用户性别">
          <el-radio v-model="userParams.sex" :label="1">男士</el-radio>
          <el-radio v-model="userParams.sex" :label="0">女士</el-radio>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUserVisible">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  components: {},
  props: {},
  data() {
    return {
      usersList: [],
      userVisible: false,
      userParams: {
        nikeName: "",
        sex: 3,
      },
    };
  },
  filters: {
    fmtTime(item) {
      return item.createdAt
        ? dayjs(item.createdAt).format("YYYY-MM-DD")
        : "2021-01-21"; // 使用 dayjs 格式化时间
    },
  },
  created() {
    this.geUsersList();
  },
  computed: {},
  methods: {
    openEdit(row) {
      console.log(row);
      this.userId = row._id;
      this.userParams = {
        nikeName: row.nikeName,
        sex: row.sex,
      };
      this.userVisible = true;
    },
    closeUserVisible() {
      this.userId = "";
      this.userParams = {
        nikeName: "",
        sex: 3,
      };
      this.userVisible = false;
    },
    async editUser() {
      await this.$http.put(`user/${this.userId}`, this.userParams);
      this.geUsersList();
      this.$message.success("修改成功");
      this.closeUserVisible();
    },
    async geUsersList() {
      const res = await this.$http.get("users");
      this.usersList = res.data;
      console.log(this.usersList);
    },
    daleteUser(row) {
      console.log(row);
      this.$confirm(`此操作将永久用户-${row.userPhone}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$http.delete(`user/${row._id}`);
          this.geUsersList();
          this.$message.success("删除成功");
        })
        .catch(() => {
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
</style>