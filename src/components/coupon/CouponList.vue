<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>优惠券管理</el-breadcrumb-item>
      <el-breadcrumb-item>优惠券列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row class="elrow">
        <el-col>
          <el-button type="primary" @click="addCouponVisible = true"
            >添加优惠券</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="couponList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="优惠券名称"> </el-table-column>
        <el-table-column prop="desc" label="优惠券描述"> </el-table-column>

        <el-table-column label="金额">
          <template slot-scope="scope">
            {{
              scope.row.enough
                ? `满${scope.row.enough}减${scope.row.value}`
                : scope.row.value
            }}
          </template>
        </el-table-column>

        <el-table-column label="优惠券类型">
          <template slot-scope="scope">
            {{ scope.row.type === 1 ? "无门槛" : "满立减" }}
          </template>
        </el-table-column>
        <el-table-column prop="count" label="库存"> </el-table-column>
        <el-table-column label="操作" width="185px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="openEditCoupon(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="daleteCoupon(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="addCouponVisible"
      width="60%"
      @close="hideDialog"
    >
      <el-form
        :model="addCouponForm"
        ref="couponRef"
        :rules="couponRules"
        label-width="100px"
      >
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="addCouponForm.name"></el-input>
        </el-form-item>
        <el-form-item label="优惠券描述" prop="desc">
          <el-input
            v-model="addCouponForm.desc"
            type="textarea"
            :rows="1"
          ></el-input>
        </el-form-item>
        <el-form-item label="所需积分" prop="consume">
          <el-input v-model="addCouponForm.consume"></el-input>
        </el-form-item>
        <el-form-item label="优惠券类型">
          <el-select
            v-model="addCouponForm.type"
            placeholder="请选择优惠券类型"
          >
            <el-option
              v-for="item in couponType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠金额" prop="value">
          <div v-show="addCouponForm.type === 1">
            <el-input
              type="number"
              min="0"
              placeholder="请输入优惠金额"
              v-model="addCouponForm.value"
            >
              <template slot="append">元</template>
            </el-input>
          </div>
          <div v-show="addCouponForm.type === 2">
            满
            <el-input
              class="input"
              type="number"
              min="0"
              v-model="addCouponForm.enough"
            >
              <template slot="append">元</template></el-input
            >
            减
            <el-input
              class="input"
              type="number"
              min="0"
              v-model="addCouponForm.value"
            >
              <template slot="append">元</template></el-input
            >
          </div>
        </el-form-item>
        <el-form-item label="优惠券库存" prop="count">
          <el-input
            type="number"
            min="0"
            placeholder="请输入优惠券库存"
            v-model="addCouponForm.count"
          >
            <template slot="append">张</template>
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取 消</el-button>
        <el-button type="primary" @click="opCoupon">确 定</el-button>
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
      couponList: [],
      addCouponVisible: false,
      addCouponForm: {
        name: "",
        value: "",
        type: 1,
        desc: "",
        count: "",
        enough: "",
      },
      id: "",
      dialogTitle: "新建优惠券",
      couponType: [
        {
          value: 1,
          label: "无门槛",
        },
        {
          value: 2,
          label: "满立减",
        },
      ],
      couponRules: {
        name: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" },
        ],
        count: [
          { required: true, message: "请输入优惠券库存", trigger: "blur" },
        ],
        consume: [
          { required: true, message: "请输入所需积分", trigger: "blur" },
        ],
        desc: [
          { required: true, message: "请输入优惠券描述", trigger: "blur" },
        ],
        value: [
          { required: true, message: "请输入优惠券金额", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCoupon();
  },
  computed: {},
  methods: {
    async getCoupon() {
      const res = await this.$http.get("coupon");
      console.log(res);
      this.couponList = res.data;
    },
    hideDialog() {
      this.$refs.couponRef.resetFields();
      this.dialogTitle = "编辑优惠券";
      this.id = "";
      this.addCouponForm = {
        name: "",
        value: "",
        type: 1,
        desc: "",
        count: "",
        enough: "",
      };
      this.addCouponVisible = false;
    },

    async openEditCoupon(item) {
      this.dialogTitle = "编辑优惠券";
      this.addCouponForm = JSON.parse(JSON.stringify(item));
      this.id = item._id;
      console.log(item);
      this.addCouponVisible = true;
    },

    async editCoupon() {
      if (this.addCouponForm.type === 1) {
        this.addCouponForm.enough = 0;
      }
      this.addCouponForm.value = Number(this.addCouponForm.value);
      this.addCouponForm.enough = Number(this.addCouponForm.enough);
      this.addCouponForm.count = Number(this.addCouponForm.count);
      const res = await this.$http.put(`coupon/${this.id}`, this.addCouponForm);
      console.log(res);
      this.getCoupon();
      this.id = "";
      this.dialogTitle = "新建优惠券";
      this.addCouponForm = {
        name: "",
        value: "",
        type: 1,
        desc: "",
        count: "",
        enough: "",
      };
      this.addCouponVisible = false;
    },
    opCoupon() {
      this.$refs.couponRef.validate((valid) => {
        if (!valid) return this.$message.error("请填入合法的表单");
        if (this.id) {
          this.editCoupon();
        } else {
          this.addCoupon();
        }
      });
    },
     daleteCoupon(item) {
      this.$confirm(`此操作将永久删除优惠券-${item.name}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.id = item._id;
          const res = await this.$http.delete(`coupon/${this.id}`);
          this.getCoupon();
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

    async addCoupon() {
      if (this.addCouponForm.type === 1) {
        this.addCouponForm.enough = 0;
      }
      this.addCouponForm.value = Number(this.addCouponForm.value);
      this.addCouponForm.enough = Number(this.addCouponForm.enough);
      this.addCouponForm.count = Number(this.addCouponForm.count);

      // return;
      const res = await this.$http.post("coupon", this.addCouponForm);
      this.getCoupon();
      this.addCouponForm = {
        name: "",
        value: "",
        type: 1,
        desc: "",
        count: "",
        enough: "",
      };
      this.addCouponVisible = false;
    },
  },
  watch: {},
};
</script>

<style  scoped lang='less'>
.input {
  width: 150px;
}
</style>