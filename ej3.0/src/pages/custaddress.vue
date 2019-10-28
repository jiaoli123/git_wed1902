<template>
    <div class="custaddress">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>顾客管理</el-breadcrumb-item>
            <el-breadcrumb-item>地址列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button size="small" type="info" @click="backHandler" class="one">返回</el-button>
        <el-table :data="addresses">
			<el-table-column prop="id" label="编号"></el-table-column>
			<el-table-column prop="province" label="省"></el-table-column>
			<el-table-column prop="city" label="城市"></el-table-column>
			<el-table-column prop="area" label="县城"></el-table-column>
			<el-table-column prop="address" label="详细地址"></el-table-column>
            <el-table-column prop="telephone" label="电话"></el-table-column>  
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
        this.findByAddressId(id);
    },
    computed:{
        ...mapState("custaddress",["addresses"]),
    },
    methods:{
        ...mapActions("custaddress",["findByAddressId"]),
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