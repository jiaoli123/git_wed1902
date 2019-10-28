import {get,post,post_array} from '../http/axios';
export default {
    namespaced:true,
    state:{
        waiters:[],
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
        refreshWaiters(state,waiters){
            state.waiters = waiters;
        },
        
    },
    actions:{
        async findAllWaiters(context,param){
            // 1. ajax查询
            let response = await post("/waiter/query",param);
            // 2. 将查询结果更新到state中
            context.commit("refreshWaiters",response.data);
        },
        async saveOrUpdateWaiter(context,payload){
            let response = await post("/waiter/saveOrUpdate",payload)
            context.commit("closeModal");
            return response;
        },
        async deleteWaiterById(context,id){
            let response = await get("/waiter/deleteById?id="+id);
            return response;
        },
        async batchDeleteWaiter(context,ids){
            // 1. 批量删除
            let response = await post_array("/waiter/batchDelete",{ids})
            return response;
        },
    }
}