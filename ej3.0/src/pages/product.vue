<template>
    <div class="product">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>产品管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 按钮 -->
        <div class="one">
			<el-row>
				<!-- 左侧搜索 -->
				<el-col :span="20">
					<el-form :inline="true">
                        <el-form-item>
							产品名
						</el-form-item>
						<el-form-item>
							<el-input v-model="paramss.name" placeholder="请输入关键字"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button @click="findAll">搜索</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<!-- /左侧搜索 -->
				<!-- 右侧按钮 -->
				<el-col :span="4" style="text-align:right">
					<el-button type="primary" size="small" @click="toAddHandler" >添加</el-button>
                    <el-button size="small" type="danger" @click="batchDeleteHandler">批量删除</el-button>
				</el-col>
				<!-- /右侧按钮 -->
			</el-row>
		</div>
        <el-table :data="products.list" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="name" label="产品名"></el-table-column>
			<el-table-column prop="description" label="简介"></el-table-column>
			<el-table-column prop="price" label="价格"></el-table-column>
			<el-table-column prop="status" label="状态"></el-table-column>
			<el-table-column prop="categoryId" label="所属栏目"></el-table-column>
			<el-table-column label="操作" width="200">
				<template #default="record">
			        <el-button type="primary" size="small" @click.prevent="deleteHandler(record.row.id)">删除</el-button>
			        <el-button type="danger" size="small" @click="editHandler(record.row)">修改</el-button>
			    </template>
			</el-table-column> 
		</el-table>
        <el-pagination
            @current-change="pageChangeHandler"
            layout="prev, pager, next"
            :current-page="paramss.page+1"
            :page-size="products.pageSize"
            :total="products.total">
        </el-pagination>
         <!-- 模态框 -->
        <el-dialog title="添加信息"  :visible.sync="visible"  :before-close="handleClose">
            <el-form :model="product" :rules="rules" ref="categoryForm">
                <el-form-item label="产品名" label-width="100px"  prop="name">
                <el-input v-model="product.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="简介" label-width="100px" prop="description">
                <el-input v-model="product.description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="价格" label-width="100px" prop="telephone">
                    <el-input v-model="product.price" placeholder="价格" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属栏目" label-width="100px">
                    <el-select v-model="product.categoryId" placeholder="所属栏目">
                        <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" auto-complete="off"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeModal">取 消</el-button>
                <el-button size="small" type="primary" @click="submitHandler">确 定</el-button>
            </div>
        </el-dialog>
            <!-- /模态框 -->
    </div>
</template>
<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    data(){
        return{
            product:{},
            paramss:{
                page:0,
                pageSize:5,
                name:''
            },
            rules:{
                name: [
                    { required: true, message: '请输入产品名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '请输入简介', trigger: 'blur' },
                     { min: 2, max: 100, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                price: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                categoryId: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ]
            },
            ids:[]
        }
    },
    computed:{
        ...mapState("product",["products","visible","categories","params"]),
        ...mapGetters("product",["orderProduct","productsize"])
    },
    created(){
        this.findAll();
        this.findAllCategories();
    },
    methods:{
        ...mapMutations("product",["showModal","closeModal","setTitle","pageChangeHandler"]),
        ...mapActions("product",["findAllProducts","saveOrUpdateProduct","deleteProductById","batchDeleteProduct","findAllCategories"]),
        findAll(){
            this.findAllProducts(this.paramss)
        },
        pageChangeHandler(currentPage){
			this.paramss.page = currentPage-1;
			this.findAllProducts(this.paramss);
        },
        deleteHandler(id){
            this.$confirm('确认关闭？')
				.then(_ => {
					this.deleteProductById(id)
                    .then((response)=>{
                        this.$message({type:"success",message:response.statusText});
                    })
                    .catch((response)=>{
                        this.$message({type:"error",message:response.statusText});
                    })
                    .finally((response)=>{
                        this.findAll();
                    })
			})
			.catch(_ => {});
            
        },
        toAddHandler(){
            // 1. 重置表单
            this.product = {};
            // 2. 显示模态框
            this.showModal();
        },
        submitHandler(){
            this.$refs.categoryForm.validate((valid)=>{
                // 如果校验通过
                if(valid){
                    let promise = this.saveOrUpdateProduct(this.product)
                    promise.then((response)=>{
                        // promise为action函数的返回值，异步函数的返回值就是promise的then回调函数的参数
                        this.$message({type:"success",message:response.statusText});
                    })
                    promise.catch((response)=>{
                        this.$message({type:"error",message:response.statusText});
                    })
                    .finally((response)=>{
                        this.findAll();
                    })
                } else {
                    return false;
                }
            }) 
           
        },
        handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					this.closeModal();
			})
			.catch(_ => {});
        },
        editHandler(row){
            this.product = row;
            this.showModal();
        },
        handleSelectionChange(val) {
            this.ids = val.map(item=>item.id);
        },
        batchDeleteHandler(){
            this.$confirm('确认批量删除？')
				.then(_ => {
					this.batchDeleteProduct(this.ids)
                    .then((response)=>{
                        this.$message({type:"success",message:response.statusText});
                    })
                    .finally((response)=>{
                        this.findAll();
                    })
			})
			.catch(_ => {});  
        },
    }
}
</script>
<style scoped>
    .one{
        margin:5px 0;
    }
</style>