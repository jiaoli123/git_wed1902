import {get,post,post_array} from '../http/axios';
export default {
    namespaced:true,
    state:{
        customers:[],
        visible:false,
    },
    getters:{
       
    },
    mutations:{
        showModal(state){
            state.visible = true;
        },
        closeModal(state){
            state.visible = false;
        },
        refreshCustomers(state,customers){
            state.customers = customers;
        },
        
    },
    actions:{
        async findAllCustomers(context,param){
            // 1. ajax查询
            let response = await post("/customer/query",param);
            // 2. 将查询结果更新到state中
            context.commit("refreshCustomers",response.data);
        },
        // payload 顾客信息
        async saveOrUpdateCustomer({commit,dispatch},payload){
            // 1. 保存或更新
            let response = await post("/customer/saveOrUpdate",payload)
            // 2. 刷新页面
            // dispatch("findAllCustomers");
            // 3. 关闭模态框
            commit("closeModal");
            // 4. 提示
            return response;
        },
        async deleteCustomerById(context,id){
            let response = await get("/customer/deleteById?id="+id);
            // context.dispatch("findAllCustomers");
            return response;
        },
        async batchDeleteCustomer(context,ids){
            // 1. 批量删除
            let response = await post_array("/customer/batchDelete",{ids})
            // 2. 分发
            // context.dispatch("findAllCustomers");
            // 3. 返回结果
            return response;
        },
    }
}