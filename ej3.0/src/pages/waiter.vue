<template>
    <div class="waiter">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>员工管理</el-breadcrumb-item>
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
							<el-input v-model="paramss.telephone" placeholder="请输入关键字"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button @click="findAll">搜索</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<!-- /左侧搜索 -->
				<!-- 右侧按钮 -->
				<el-col :span="4" style="text-align:right">
					<el-button size="small" type="primary"  @click="toAddHandler">添加</el-button>
			        <el-button size="small" type="danger"  @click="batchDeleteHandler">批量删除</el-button>
				</el-col>
				<!-- /右侧按钮 -->
			</el-row>
		</div>
         <!-- 按钮 -->
         <!-- {{ids}} -->
         <el-table :data=" waiters.list" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="realname" label="姓名"></el-table-column>
			<el-table-column prop="telephone" label="手机号"></el-table-column>
            <el-table-column prop="password" label="密码"></el-table-column>
			<el-table-column prop="gender" label="性别"></el-table-column>
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
            :page-size=" waiters.pageSize"
            :total=" waiters.total">
        </el-pagination>
        <el-dialog
		title="添加/修改信息"
		:visible.sync="visible" 
		width="30%"
		:before-close="handleClose">
			<span>
				<el-form :inline="true" :model="waiter" class="demo-form-inline" :rules="rules" ref="categoryForm">
					<el-form-item label="姓名" label-width="100px"  prop="realname">
						<el-input v-model="waiter.realname" placeholder="姓名" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="手机号" label-width="100px" prop="telephone">
						<el-input v-model="waiter.telephone" placeholder="手机号" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="密码" label-width="100px"  prop="password">
						<el-input type="password" v-model="waiter.password" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="性别" label-width="100px" prop="gender">
                        <template>
                            <el-radio-group v-model="waiter.gender">
                                <el-radio label="男">男</el-radio>
                                <el-radio label="女">女</el-radio>
                            </el-radio-group>
                        </template>
					</el-form-item>
				</el-form>
			</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeModal" >取 消</el-button>
				<el-button type="primary"  @click="submitHandler">确 定</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    data(){
        return{
            waiter:{},
            ids:[],
            paramss:{
				page:0,
				pageSize:5,
				telephone:''
			},
            radio:"男",
            rules:{
                realname: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                passward: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
                ],
                telephone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                ]
            }
        }
    },
    computed:{
        ...mapState("waiter",["waiters","visible"]),
        ...mapGetters("waiter",["orderWaiter","waiterSize"])
    },
    created(){
        this.findAll();
    },
    methods:{
        ...mapMutations("waiter",["showModal","closeModal","setTitle","pageChangeHandler"]),
        ...mapActions("waiter",["findAllWaiters","saveOrUpdateWaiter","deleteWaiterById","batchDeleteWaiter"]),
        findAll(){
            this.findAllWaiters(this.paramss)
        },
        pageChangeHandler(currentPage){
			this.paramss.page = currentPage-1;
			this.findAllWaiters(this.paramss);
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
            this.waiter = {};
            // 2. 显示模态框
            this.showModal();
        },
        submitHandler(){
            this.$refs.categoryForm.validate((valid)=>{
                // 如果校验通过
                if(valid){
                    let promise = this.saveOrUpdateWaiter(this.waiter)
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
					this.deleteWaiterById(id)
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
					this.batchDeleteWaiter(this.ids)
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
            this.waiter = row;
            this.showModal();
        },  
    }
}
</script>
<style scoped>
    .one{
        margin:5px 0;
    }
</style>