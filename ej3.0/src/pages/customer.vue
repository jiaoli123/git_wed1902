<template>
    <div class="customer">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>顾客管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 按钮 -->
        <div class="btns one">
			<el-row>
				<!-- 左侧搜索 -->
				<el-col :span="20">
					<el-form :inline="true">
                        <el-form-item>
							姓名
						</el-form-item>
						<el-form-item>
							<el-input v-model="paramss.realname" placeholder="请输入关键字"></el-input>
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
			        <el-button size="small" type="danger" @click="batchDeleteHandler">批量删除</el-button>
				</el-col>
				<!-- /右侧按钮 -->
			</el-row>
		</div>
         <!-- 按钮 -->
         <el-table :data="customers.list"  @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="realname" label="姓名"></el-table-column>
			<el-table-column prop="telephone" label="手机号"></el-table-column>
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
            :page-size="customers.pageSize"
            :total="customers.total">
        </el-pagination>
        <el-dialog
		title="添加/修改信息"
		:visible.sync="visible" 
		width="30%"
		:before-close="handleClose">
			<span>
				<el-form :inline="true" :model="customer" class="demo-form-inline" :rules="rules" ref="categoryForm">
					<el-form-item label="姓名" label-width="100px"  prop="realname">
						<el-input v-model="customer.realname" placeholder="姓名" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="手机号" label-width="100px" prop="telephone">
						<el-input v-model="customer.telephone" placeholder="手机号" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
			</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeModal" >取 消</el-button>
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
            customer:{},
            ids:[],
            paramss:{
				page:0,
				pageSize:5,
				realname:''
			},
            rules:{
                realname: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                telephone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                ]
            }
        }
    },
    computed:{
        ...mapState("customer",["customers","visible","title","params"]),
        ...mapGetters("customer",["orderCustomer","customerSize"])
    },
    created(){
        this.findAll();
    },
    methods:{
        ...mapMutations("customer",["showModal","closeModal","setTitle","pageChangeHandler"]),
        ...mapActions("customer",["findAllCustomers","saveOrUpdateCustomer","deleteCustomerById","batchDeleteCustomer"]),
        findAll(){
            this.findAllCustomers(this.paramss)
        },
        pageChangeHandler(currentPage){
			this.paramss.page = currentPage-1;
			this.findAllCustomers(this.paramss);
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
            this.customer = {};
            // 2. 显示模态框
            this.showModal();
        },
        submitHandler(){
            this.$refs.categoryForm.validate((valid)=>{
                // 如果校验通过
                if(valid){
                    let promise = this.saveOrUpdateCustomer(this.customer)
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
					this.deleteCustomerById(id)
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
					this.batchDeleteCustomer(this.ids)
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
            this.customer = row;
            this.showModal();
        },
        toDetailsHandler(customer){
        //跳转到详情页面
            // this.$router.push("/customerDetails")
            this.$router.push({
                path:"/custaddress",
                query:{id:customer.id}
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