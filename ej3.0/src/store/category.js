import {get,post,post_array} from '../http/axios';
export default {
    namespaced:true,
    state:{
        categories:[],
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
        refreshCategories(state,categories){
            state.categories = categories;
        },
        
    },
    actions:{
        async findAllCategories(context,param){
            // 1. ajax查询
            let response = await post("/category/query",param);
            // 2. 将查询结果更新到state中
            context.commit("refreshCategories",response.data);
        },
        async saveOrUpdateCategory(context,payload){
            let response = await post("/category/saveOrUpdate",payload)
            context.commit("closeModal");
            return response;
        },
        async deleteCategoryById(context,id){
            let response = await get("/category/deleteById?id="+id);
            // context.dispatch("findAllCustomers");
            return response;
        },
        async batchDeleteCategory(context,ids){
            // 1. 批量删除
            let response = await post_array("/category/batchDelete",{ids})
            return response;
        },
    }
}