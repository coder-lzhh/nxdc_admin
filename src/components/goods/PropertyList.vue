<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>属性列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row class="elrow">
        <el-col>
          <el-button type="primary" @click="addPropertyVisible = true"
            >添加属性</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="propertyList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column width="100px" prop="name" label="属性名称">
        </el-table-column>
        <el-table-column label="属性参数">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.values" :key="index">
              {{ item.value
              }}{{ index === scope.row.values.length - 1 ? "" : " /" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="185px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="openEditProperty(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="daleteProperty(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="addPropertyVisible"
      width="50%"
      @close="hideDialog"
    >
      <el-form
        :model="addPropertyForm"
        ref="propertyRef"
        :rules="propertyRules"
        label-width="80px"
      >
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="addPropertyForm.name"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="values">
          <el-tag
            :key="index"
            v-for="(tag, index) in addPropertyForm.values"
            closable
            :disable-transitions="false"
            @close="handleClose(tag.value)"
          >
            {{ tag.value }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            >+ 值</el-button
          >
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取 消</el-button>
        <el-button type="primary" @click="opProperty">确 定</el-button>
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
      propertyList: [],
      addPropertyVisible: false,
      addPropertyForm: {
        name: "",
        values: [],
      },
      inputVisible: false,
      inputValue: "",
      id: "",
      dialogTitle: "新建属性",
      propertyRules: {
        name: [{ required: true, message: "请输入属性名称", trigger: "blur" }],
        values: [{ required: true, message: "请输入属性值", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getProperty();
  },
  computed: {},
  methods: {
    hideDialog() {
      console.log('xxxxx')
      this.dialogTitle = "新建属性";
      this.addPropertyForm.name = "";
      this.addPropertyForm.values = [];
      this.addPropertyVisible = false;
      this.$refs.propertyRef.resetFields();
    },
    handleClose(tag) {
      this.addPropertyForm.values.splice(
        this.addPropertyForm.values.findIndex((i) => i === i.value),
        1
      );
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.addPropertyForm.values.push({ value: inputValue });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    async getProperty() {
      const res = await this.$http.get("property");
      console.log(res);
      this.propertyList = res.data;
    },

    async openEditProperty(item) {
      this.dialogTitle = "编辑属性";
      this.addPropertyForm = JSON.parse(JSON.stringify(item));
      this.id = item._id;
      console.log(item);
      this.addPropertyVisible = true;
      // const res = await this.$http.get(`property/${this.id}`, {
      //   name: this.editPropertyForm.name,
      // });

      // this.editPropertyVisible = true;
    },

    async editProperty() {
      // console.log(this.id, this.editPropertyForm);
      const res = await this.$http.put(
        `property/${this.id}`,
        this.addPropertyForm
      );
      console.log(res);
      this.getProperty();
      this.id = "";
      this.dialogTitle = "新建属性";
      this.addPropertyForm.name = "";
      this.addPropertyForm.values = [];
      this.addPropertyVisible = false;
    },
    opProperty() {
      this.$refs.propertyRef.validate((valid) => {
        if (!valid) return this.$message.error("请填入合法的表单");
        if (this.id) {
          this.editProperty();
        } else {
          this.addProperty();
        }
      });
    },
    async daleteProperty(item) {
      this.$confirm(`此操作将永久删除属性-${item.name}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.id = item._id;
          const res = await this.$http.delete(`property/${this.id}`);
          this.getProperty();
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

    async addProperty() {
      const res = await this.$http.post("property", this.addPropertyForm);
      this.getProperty();
      this.addPropertyForm.name = "";
      this.addPropertyForm.values = [];
      this.addPropertyVisible = false;
    },
  },
  watch: {},
};
</script>

<style  scoped lang='less'>
.el-tag {
  // margin-bottom: 10px;
  margin-left: 10px;
}
.button-new-tag {
  // margin-bottom: 10px;
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  // margin-bottom: 10px;
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>