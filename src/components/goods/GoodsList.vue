<template>
    <div>
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="elbreadcrumb"
        >
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-row class="elrow">
                <el-col :span="7" class="header">
                    分类：
                    <el-select v-model="type" placeholder="分类">
                        <el-option
                            v-for="item in types"
                            :key="item._id"
                            :label="item.name"
                            :value="item.name"
                        >
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="17">
                    <el-button type="primary" @click="addGoodsVisible = true"
                        >添加商品</el-button
                    >
                </el-col>
            </el-row>

            <el-table :data="goodsList" stripe border>
                <el-table-column prop="name" label="名称" width="200px">
                </el-table-column>
                <el-table-column prop="price" label="价钱" width="100px">
                </el-table-column>
                <el-table-column prop="type.name" label="分类" width="200px">
                </el-table-column>
                <el-table-column label="是否上架" width="100px">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.isShow"
                            @change="showChange(scope.row)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-edit"
                            @click="openEditGoods(scope.row)"
                            >编辑</el-button
                        >

                        <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-delete"
                            @click="daleteGoods(scope.row)"
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

        <el-dialog
            :title="dialogTitle"
            :visible.sync="addGoodsVisible"
            width="70%"
            @close="hideDialog"
        >
            <el-form
                :model="addGoodsForm"
                ref="goodsRef"
                :rules="goodsRules"
                label-width="90px"
            >
                <el-form-item label="商品类型" prop="type">
                    <el-select
                        v-model="addGoodsForm.type"
                        placeholder="请选择商品类型"
                    >
                        <el-option
                            v-for="item in categoryList"
                            :key="item._id"
                            :label="item.name"
                            :value="item._id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品图片" prop="image">
                    <el-upload
                        class="avatar-uploader"
                        :action="uploadLink"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                        :headers="headersObj"
                    >
                        <img
                            v-if="addGoodsForm.image"
                            :src="addGoodsForm.image"
                            class="avatar"
                        />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商品名称" prop="name">
                    <el-input
                        v-model="addGoodsForm.name"
                        placeholder="请输入商品名称"
                    ></el-input>
                </el-form-item>
                <el-form-item label="商品描述" prop="desc">
                    <el-input
                        v-model="addGoodsForm.desc"
                        placeholder="请输入商品描述"
                        type="textarea"
                        :rows="1"
                    ></el-input>
                </el-form-item>

                <el-form-item label="商品价格" prop="price">
                    <el-input
                        type="number"
                        min="0"
                        placeholder="请输入商品价格"
                        v-model="addGoodsForm.price"
                    >
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>

                <template
                    v-if="
                        typeName !== '软欧包' &&
                        typeName !== '手作烘焙' &&
                        typeName !== '三明治'
                    "
                >
                    <el-form-item
                        :label="items.name"
                        v-for="(items, index) in propertyList"
                        :key="items._id"
                    >
                        <el-select
                            class="select_property"
                            v-model="property[index].values"
                            multiple
                            placeholder="请选择商品属性"
                        >
                            <el-option
                                v-for="item in items.values"
                                :key="item._id"
                                :label="item.value"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="cleanGoodsForm">取 消</el-button>
                <el-button type="primary" @click="opGoods">确 定</el-button>
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
            goodsList: [],
            categoryList: [],
            propertyList: [],
            addGoodsVisible: false,
            dialogTitle: "新建商品",
            addGoodsForm: {
                type: "",
                name: "",
                peice: "",
                desc: "",
                image: "",
                property: [],
            },

            property: [],
            types: [{ name: "全部", _id: 0 }],
            type: "全部",
            typeName: "",
            headersObj: {
                Authorization: window.localStorage.getItem("ADMIN_TOKEN") || "",
            },
            paramInfo: {
                pagesize: 10,
                current: 1,
                total: 100,
            },
            uploadLink: 'http://localhost:3000/admin/api/upload',
            goodsRules: {
                type: [{ required: true, message: "请选择商品类型", trigger: "blur" }],
                image: [{ required: true, message: "请选择商品图片", trigger: "blur" }],
                name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
                desc: [{ required: true, message: "请输入商品描述", trigger: "blur" }],
                price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
            },
        };
    },
    created() {
        this.getCategory();
        this.getProperty();
        this.getGoods();
        // this.uploadLink = `http://${process.env.VUE_HOST}:3000/admin/api/upload`
    },
    computed: {},
    methods: {
        currentChange(page) {
            this.paramInfo.current = page;
            this.getGoods();
        },
        cleanGoodsForm() {
            this.id = "";
            this.addGoodsVisible = false;
        },
        async getCategory() {
            const res = await this.$http.get("category");
            console.log(res);
            this.categoryList = res.data;
            this.types.push(...res.data);
        },
        async getGoods() {
            const res = await this.$http.get("goods");
            console.log(res);

            if (this.type === "全部") {
                this.goodsList = res.data;
            } else {
                this.goodsList = res.data.filter((i) => i.type.name === this.type);
            }

            let nowPage = (this.paramInfo.current - 1) * this.paramInfo.pagesize;
            this.paramInfo.total = this.goodsList.length;
            this.goodsList = this.goodsList.slice(
                nowPage,
                nowPage + this.paramInfo.pagesize
            );

            this.constGoods = res.data;
        },
        async getProperty() {
            const res = await this.$http.get("property");
            console.log(res);
            let property = [];

            for (let item of res.data) {
                property.push({ name: item.name, values: [] });
            }
            this.property = property;
            this.propertyList = res.data;
        },

        hideDialog() {
            this.$refs.goodsRef.resetFields();
            this.dialogTitle = "新建商品";
            this.addGoodsForm = {
                type: "",
                name: "",
                peice: "",
                desc: "",
                image: "",
                property: [],
            };
            this.property = [
                { name: "配料", values: [] },
                { name: "温度", values: [] },
                { name: "糖度", values: [] },
            ];
            this.addGoodsVisible = false;
        },
        async openEditGoods(item) {
            this.dialogTitle = "编辑商品";
            this.addGoodsForm = JSON.parse(JSON.stringify(item));
            this.addGoodsForm.type = this.addGoodsForm.type._id;
            this.property = [];

            if (item.property.findIndex((i) => i.name === "配料") === -1) {
                this.property.push({ name: "配料", values: [] });
            } else {
                let obj = item.property.find((i) => i.name === "配料");
                obj.values = obj.values.map((x) => x.value);
                this.property.push(obj);
            }
            if (item.property.findIndex((i) => i.name === "温度") === -1) {
                this.property.push({ name: "温度", values: [] });
            } else {
                let obj = item.property.find((i) => i.name === "温度");
                obj.values = obj.values.map((x) => x.value);
                this.property.push(obj);
            }
            if (item.property.findIndex((i) => i.name === "糖度") === -1) {
                this.property.push({ name: "糖度", values: [] });
            } else {
                let obj = item.property.find((i) => i.name === "糖度");
                obj.values = obj.values.map((x) => x.value);
                this.property.push(obj);
            }

            this.id = item._id;
            console.log(item);
            this.addGoodsVisible = true;
        },

        async editGoods() {
            const res = await this.$http.put(`goods/${this.id}`, this.addGoodsForm);
            console.log(res);
            this.getGoods();
            this.id = "";
            this.hideDialog();
            this.$message({
                type: "success",
                message: "编辑商品成功!",
            });
        },
        opGoods() {
            this.$refs.goodsRef.validate((valid) => {
                if (!valid) return this.$message.error("请填入合法的表单");

                let property = JSON.parse(JSON.stringify(this.property));
                property = property.filter((i) => i.values.length !== 0);
                property = property.map((i) => {
                    return {
                        name: i.name,
                        values: i.values.map((x) => {
                            return { value: x };
                        }),
                    };
                });
                this.addGoodsForm.property = property;
                this.addGoodsForm.price = Number(this.addGoodsForm.price);

                if (this.id) {
                    this.editGoods();
                } else {
                    this.addGoods();
                }
            });
        },
        async daleteGoods(item) {
            this.$confirm(`此操作将永久删除商品-${item.name}, 是否继续?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    this.id = item._id;
                    const res = await this.$http.delete(`goods/${this.id}`);
                    this.getGoods();
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

        async addGoods() {
            console.log(this.addGoodsForm);
            // return;
            const res = await this.$http.post("goods", this.addGoodsForm);
            this.getGoods();
            this.hideDialog();
            this.$message({
                type: "success",
                message: "新建商品成功!",
            });
        },

        handleSuccess(res, file) {
            this.addGoodsForm.image = res.url;
        },
        async showChange(item) {
            console.log(item);
            item.type = item.type._id;
            const res = await this.$http.put(`goods/${item._id}`, item);
            console.log(res);
            this.getGoods();
            let text = item.isShow ? "上架商品成功!" : "下架商品成功";
            this.$message({
                type: "success",
                message: text,
            });
        },
    },
    watch: {
        type(val) {
            if (val === "全部") {
                this.goodsList = JSON.parse(JSON.stringify(this.constGoods));
            } else {
                this.goodsList = JSON.parse(JSON.stringify(this.constGoods)).filter(
                    (i) => i.type.name === val
                );
            }
            this.paramInfo.current = 1;
            let nowPage = (this.paramInfo.current - 1) * this.paramInfo.pagesize;
            this.paramInfo.total = this.goodsList.length;
            this.goodsList = this.goodsList.slice(
                nowPage,
                nowPage + this.paramInfo.pagesize
            );
        },
        "addGoodsForm.type"(val) {
            if (val) {
                this.typeName = this.categoryList.find((i) => i._id === val).name;
                console.log(this.typeName);
            }
        },
    },
};
</script>

<style  scoped lang='less'>
.avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    min-width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #d9d9d9;
}
.avatar {
    width: 100px;
    height: 100px;
    display: block;
}
.select_property {
    width: 100%;
}
.header {
    display: flex;
    align-items: center;
}
</style>