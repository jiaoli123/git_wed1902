<template>
    <div class="category">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 按钮 -->
        <div class="btns one">
			<el-row>
				<!-- 左侧搜索 -->
				<el-col :span="20">
					<el-form :inline="true">
                        <el-form-item>
							名称
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
					<el-button size="small" type="primary" @click="toAddHandler">添加</el-button>
			        <el-button size="small" type="danger"@click="batchDeleteHandler">批量删除</el-button>
				</el-col>
				<!-- /右侧按钮 -->
			</el-row>
		</div>
         <!-- 按钮 -->
         <el-table :data="categories.list" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="name" label="名称"></el-table-column>
			<el-table-column prop="num" label="数量"></el-table-column>
            <el-table-column label="图标">
				<template v-slot:default="record">
					<img :src="record.row.icon" alt="">
				</template>
			</el-table-column>
			<el-table-column label="操作" width="250">
				<template #default="record">
			        <el-button type="primary" size="small" @click.prevent="deleteHandler(record.row.id)">删除</el-button>
			        <el-button type="danger" size="small" @click="editHandler(record.row)">修改</el-button>
                    <el-button type="danger" size="small" @click.prevent="toDetailsHandler(record.row)">详情</el-button>
			    </template>
			</el-table-column>
		</el-table>
        <el-pagination
            @current-change="pageChangeHandler"
            layout="prev, pager, next"
            :current-page="paramss.page+1"
            :page-size="categories.pageSize"
            :total="categories.total">
        </el-pagination>
        <el-dialog
		title="添加/修改信息"
		:visible.sync="visible"
		width="30%"
		:before-close="handleClose">
			<span>
				<el-form :inline="true" :model="category" class="demo-form-inline" :rules="rules" ref="categoryForm">
					<el-form-item label="名称" label-width="100px"  prop="name">
						<el-input v-model="category.name" placeholder="名称" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="数量" label-width="100px"  prop="num">
						<el-input v-model="category.num" placeholder="数量" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
			</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeModal">取 消</el-button>
				<el-button type="primary" @click="submitHandler">确 定</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    data(){
        return{
            category:{},
            ids:[],
            paramss:{
				page:0,
				pageSize:5,
				name:''
			},
            rules:{
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                tnum: [
                    { required: true, message: '请输入数量', trigger: 'blur' }
                ]
            }
        }
    },
    computed:{
        ...mapState("category",["categories","visible"]),
        ...mapGetters("category",["orderCategory","categorySize"])
    },
    created(){
        this.findAll();
    },
    methods:{
        ...mapMutations("category",["showModal","closeModal","setTitle","pageChangeHandler"]),
        ...mapActions("category",["findAllCategories","saveOrUpdateCategory","deleteCategoryById","batchDeleteCategory"]),
        findAll(){
            this.findAllCategories(this.paramss)
        },
        pageChangeHandler(currentPage){
			this.paramss.page = currentPage-1;
			this.findAllCategories(this.paramss);
        },
        handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					this.closeModal();
			})
			.catch(_ => {});
        },
        toAddHandler(){
            // 1. 重置表单
            this.category = {};
            // 2. 显示模态框
            this.showModal();
        },
        submitHandler(){
            this.$refs.categoryForm.validate((valid)=>{
                // 如果校验通过
                if(valid){
                    let promise = this.saveOrUpdateCategory(this.category)
                    promise.then((response)=>{
                        // promise为action函数的返回值，异步函数的返回值就是promise的then回调函数的参数
                        this.$message({type:"success",message:response.statusText});
                    })
                    .finally((response)=>{
                        this.findAll();
                    })
                } else {
                    return false;
                }
            })  
        },
        deleteHandler(id){
            this.$confirm('确认删除？')
				.then(_ => {
					this.deleteCategoryById(id)
                    .then((response)=>{
                        this.$message({type:"success",message:response.statusText});
                    })
                    .finally((response)=>{
                        this.findAll();
                    })
			})
			.catch(_ => {});   
        },
        handleSelectionChange(val) {
            this.ids = val.map(item=>item.id);
        },
        batchDeleteHandler(){
            this.$confirm('确认批量删除？')
				.then(_ => {
					this.batchDeleteCategory(this.ids)
                    .then((response)=>{
                        this.$message({type:"success",message:response.statusText});
                    })
                    .finally((response)=>{
                        this.findAll();
                    })
			})
			.catch(_ => {});  
        },
        editHandler(row){
            this.category = row;
            this.showModal();
        },
        // 普通方法
        toDetailsHandler(category){
        //跳转到详情页面
            // this.$router.push("/customerDetails")
            this.$router.push({
                path:"/cateproduct",
                query:{id:category.id}
            })
        },  
    }
}
</script>
<style scoped>
    .one{
        margin:5px 0;
    }
</style>