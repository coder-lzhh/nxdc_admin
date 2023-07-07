<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="ordersList" stripe border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item
                v-for="item in props.row.goods"
                :key="item._id"
                :label="item.name"
              >
                <span
                  >{{ item.props_text ? "- " + item.props_text : "" }} x{{
                    item.number
                  }}</span
                >
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column width="100px" label="商品数量">
          <template slot-scope="scope"> {{ scope.row.goods.length }} </template>
        </el-table-column>

        <el-table-column width="50px" label="类型">
          <template slot-scope="scope">
            {{ scope.row.isOrderOut ? "外卖" : "自取" }}
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column width="120px" label="取餐时间">
          <template slot-scope="scope">
            {{ scope.row.takeTime ? scope.row.takeTime : "立即取餐" }}
          </template>
        </el-table-column>
        <el-table-column width="120px" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | fmtTime }}
          </template>
        </el-table-column>
        <el-table-column width="110px" label="用户电话">
          <template slot-scope="scope">
            {{
              scope.row.isOrderOut
                ? scope.row.orderOut.phone
                : scope.row.userPhone
            }}
          </template>
        </el-table-column>
        <el-table-column width="80px" prop="postscript" label="订单状态">
        </el-table-column>

        <el-table-column label="操作" width="230px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-circle-check"
              @click="successOrder(scope.row)"
              v-if="scope.row.postscript === '制作中'"
            >
              完成</el-button
            >
            <el-button size="mini" type="info" @click="orderMore(scope.row)"
              >更多<i class="el-icon-more"></i
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="daleteOrders(scope.row)"
            ></el-button>
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

    <el-dialog title="更多信息" :visible.sync="orderMoreVisible" width="50%">
      <el-row class="p_tb">
        <el-col :span="6"> <div>订单号：</div></el-col>
        <el-col :span="18"
          ><div>
            {{ orderItem._id }}
          </div></el-col
        >
      </el-row>
      <el-row class="p_tb" v-if="orderItem.orderOut">
        <el-col :span="6"> <div>订单用户：</div></el-col>
        <el-col :span="18"
          ><div>
            {{ orderItem.orderOut.name }}
          </div></el-col
        >
      </el-row>
      <el-row class="p_tb" v-if="orderItem.orderOut">
        <el-col :span="6"> <div>订单地址：</div></el-col>
        <el-col :span="18"
          ><div>
            {{ orderItem.orderOut.address }}
          </div></el-col
        >
      </el-row>
      <el-row class="p_tb">
        <el-col :span="6"> <div>优惠金额：</div></el-col>
        <el-col :span="18"
          ><div>
            {{ orderItem.discount ? orderItem.discount.value : 0 }}
          </div></el-col
        >
      </el-row>
      <el-row class="p_tb">
        <el-col :span="6"> <div>订单金额：</div></el-col>
        <el-col :span="18"
          ><div>
            {{ orderItem.priceTotal }}
          </div></el-col
        >
      </el-row>
      <el-row class="p_tb">
        <el-col :span="6"> <div>支付方式：</div></el-col>
        <el-col :span="18"
          ><div>
            {{ orderItem.channel }}
          </div></el-col
        >
      </el-row>
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
      ordersList: [],
      orderMoreVisible: false,
      orderItem: {},
      paramInfo: {
        pagesize: 10,
        current: 1,
        total: 100,
      },
    };
  },
  filters: {
    fmtTime(date) {
      return dayjs(date).format("MM-DD HH:mm:ss"); // 使用 dayjs 格式化时间
    },
  },
  created() {
    this.getOrdersList();
    // console.log(dayjs("12-25-1995", "MM-DD-YYYY"));
  },
  computed: {},
  methods: {
    currentChange(page) {
      this.paramInfo.current = page;
      this.getOrdersList();
    },
    async successOrder(item) {
      console.log(item);
      await this.$http.put(`order/${item._id}`, {
        postscript: "已完成",
      });
      this.$message.success("操作成功");
      this.getOrdersList();
    },
    async daleteOrders(item) {
      // await this.$http.delete(`order/${item._id}`);
      // this.$message.success("删除成功");
      // this.getOrdersList();

      this.$confirm(`此操作将永久删除改订单, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$http.delete(`order/${item._id}`);
          this.getOrdersList();
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    orderMore(item) {
      console.log(item);
      this.orderMoreVisible = true;
      this.orderItem = item;
    },
    async getOrdersList() {
      const { data } = await this.$http.get("orders");

      let nowPage = (this.paramInfo.current - 1) * this.paramInfo.pagesize;
      this.paramInfo.total = data.length;
      this.ordersList = data.slice(nowPage, nowPage + this.paramInfo.pagesize);
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
  width: 50%;
}
.p_tb {
  padding: 5px 0;
}
</style>