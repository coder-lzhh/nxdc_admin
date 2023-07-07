<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row class="elrow">
        <el-col>
          <el-button type="primary" @click="openCategory({})"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="categoryList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="分类名称"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="openCategory(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="daleteCategory(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="title"
      :visible.sync="categoryVisible"
      width="50%"
      @close="categoryForm.name = ''"
    >
      <el-form
        :model="categoryForm"
        ref="categoryRef"
        :rules="categoryRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCategory">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      categoryForm: { name: "" },
      categoryVisible: false,
      categoryList: [],
      categoryRules: {
        name: [{ required: true, message: "请输入商品分类", trigger: "blur" }],
      },
      title: "添加分类",
    };
  },
  created() {
    this.getCategory();
  },
  computed: {},
  methods: {
    async getCategory() {
      const res = await this.$http.get("category");
      this.categoryList = res.data;
    },
    openCategory({ name, _id }) {
      if (name) {
        this.categoryForm.name = name;
        this.id = _id;
        this.title = "编辑分类";
      }
      this.categoryVisible = true;
    },
    closeCategory() {
      this.categoryVisible = false;
      this.$refs.categoryRef.resetFields();
      this.id = "";
      this.categoryForm.name = "";
      this.title = "添加分类";
    },
    async daleteCategory(item) {
      this.$confirm(`此操作将永久删除分类-${item.name}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.id = item._id;
          const res = await this.$http.delete(`category/${this.id}`);
          this.getCategory();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async confirm() {
      this.$refs.categoryRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return this.$message.error("请填入合法的表单");

        if (this.id) {
          const res = await this.$http.put(`category/${this.id}`, {
            name: this.categoryForm.name,
          });
          console.log(res);
          this.$message.success("修改成功");
        } else {
          const res = await this.$http.post("category", {
            name: this.categoryForm.name,
          });
          console.log(res);
          this.$message.success("新建成功");
        }
        this.getCategory();
        this.closeCategory();
      });
    },
  },
  watch: {},
};
</script>

<style  scoped lang='less'>
.elrow {
  margin-bottom: 15px;
}
</style>