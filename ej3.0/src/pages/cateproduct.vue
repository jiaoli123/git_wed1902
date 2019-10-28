<template>
    <div class="cateproduct">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>产品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button size="small" type="info" @click="backHandler" class="one">返回</el-button>
        <el-table :data="productss">
			<el-table-column prop="id" label="编号"></el-table-column>
			<el-table-column prop="name" label="产品名"></el-table-column>
			<el-table-column prop="description" label="简介"></el-table-column>
			<el-table-column prop="price" label="价格"></el-table-column>
			<el-table-column prop="status" label="状态"></el-table-column> 
		</el-table>
    </div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
export default {
    data(){
        return {
            activeName:"info"
        }
    },
    created(){
        let id = this.$route.query.id;
        // 通过id查询顾客，订单，地址
        this.findByCategoryId(id);
    },
    computed:{
        ...mapState("cateproduct",["productss"]),
    },
    methods:{
        ...mapActions("cateproduct",["findByCategoryId"]),
        backHandler(){
        // this.$router.push("/customer")
        this.$router.go(-1)
        }
    }
}
</script>
<style scoped>
    .one{
        margin:5px 0;
    }
</style>