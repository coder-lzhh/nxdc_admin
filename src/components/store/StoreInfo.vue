<template>
    <div>
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="elbreadcrumb"
        >
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商家管理</el-breadcrumb-item>
            <el-breadcrumb-item>商家信息</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-row class="elrow">
                <el-col>
                    <el-button type="primary" @click="openStoreVisible()">
                        编辑</el-button
                    >
                    <!-- <el-button type="primary" @click="deleteData()">
                        删除
                    </el-button> -->
                </el-col>
            </el-row>
            <div class="flex">
                <div>商家名称：</div>
                <div>{{ store.name }}</div>
            </div>
            <div class="flex">
                <div class="title">商家介绍：</div>
                <div>{{ store.info }}</div>
            </div>
            <div class="flex">
                <div>联系电话：</div>
                <div>{{ store.phone }}</div>
            </div>
            <div class="flex">
                <div>包装费：</div>
                <div>{{ store.packingFee }} 元</div>
            </div>
            <div class="flex">
                <div>配送费：</div>
                <div>{{ store.deliveryCost }} 元</div>
            </div>
        </el-card>

        <el-dialog
            title="编辑信息"
            :visible.sync="storeVisible"
            @close="closeStoreVisible"
            width="70%"
        >
            <el-form
                :model="storeParams"
                ref="storeRef"
                :rules="storeRules"
                label-width="80px"
            >
                <el-form-item label="商家名称" prop="name">
                    <el-input v-model="storeParams.name"></el-input>
                </el-form-item>
                <el-form-item label="商家介绍" prop="info">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="storeParams.info"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="storeParams.phone"></el-input>
                </el-form-item>
                <el-form-item label="包装费" prop="packingFee">
                    <el-input v-model="storeParams.packingFee"></el-input>
                </el-form-item>
                <el-form-item label="配送费" prop="deliveryCost">
                    <el-input v-model="storeParams.deliveryCost"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="closeStoreVisible">取 消</el-button>
                <el-button type="primary" @click="editStore">确 定</el-button>
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
            store: {},
            storeVisible: false,
            storeParams: {
                info: "",
                name: "",
                phone: "",
                packingFee: "",
                deliveryCost: "",
            },
            storeRules: {
                info: [{ required: true, message: "请输入商家介绍", trigger: "blur" }],
                name: [{ required: true, message: "请输入商家名称", trigger: "blur" }],
                phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
                packingFee: [
                    { required: true, message: "请输入包装费", trigger: "blur" },
                ],
                deliveryCost: [
                    { required: true, message: "请输入配送费", trigger: "blur" },
                ],
            },
        };
    },
    created() {
        this.getStore();
        console.log('process',process)
    },
    computed: {},
    methods: {
        async deleteData() {

            await this.$http.delete(`store/${this.store._id}`);
            this.getStore();
        },
        async getStore() {
            let { data } = await this.$http.get("store");
            console.log(data);
            this.store = (data && data[0]) || JSON.parse(JSON.stringify(this.storeParams));
        },
        async editStore() {
            this.$refs.storeRef.validate(async (valid) => {
                console.log(valid);
                if (!valid) return this.$message.error("请填入合法的表单");

                console.log("xxxxx");

                if (this.storeParams._id) {
                    await this.$http.put(`store/${this.storeParams._id}`, this.storeParams);
                } else {
                    await this.$http.post('store', this.storeParams);
                }
                this.getStore();
                this.$message.success("修改成功");
                this.storeVisible = false;
            });
        },
        openStoreVisible() {
            this.storeParams = JSON.parse(JSON.stringify(this.store));
            this.storeVisible = true;
        },
        closeStoreVisible() {
            this.$refs.storeRef.resetFields();
            this.storeVisible = false;
        },
    },
    watch: {},
};
</script>

<style  scoped lang='less'>
.flex {
    display: flex;
    font-size: 18px;
    padding-bottom: 20px;
    div:first-child {
        min-width: 90px;
    }
}
</style>