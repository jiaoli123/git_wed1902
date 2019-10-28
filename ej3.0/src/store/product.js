import {get,post,post_array} from '../http/axios';
export default {
    namespaced:true,
    state:{
        products:[],
        categories:[],
        visible:false,
    },
    mutations:{
        showModal(state){
            state.visible = true;
        },
        closeModal(state){
            state.visible = false;
        },
        refreshProducts(state,products){
            state.products = products;
        },
        refreshCategories(state,categories){
            state.categories = categories;
        },
    },
    actions:{
        async findAllProducts(context,param){
            // 1. ajax查询
            let response = await post("/product/query",param);
            // 2. 将查询结果更新到state中
            context.commit("refreshProducts",response.data);
        },
        async findAllCategories(context){
            let response = await get("/category/findAll");
            context.commit("refreshCategories",response.data);
        },
        // payload 顾客信息
        async saveOrUpdateProduct(context,payload){
            // 1. 保存或更新
            let response = await post("/product/saveOrUpdate",payload)
            // 2. 刷新页面
            // dispatch("findAllCustomers");
            // 3. 关闭模态框
            context.commit("closeModal");
            // 4. 提示
            return response;
        },
        async deleteProductById(context,id){
            let response = await get("/product/deleteById?id="+id);
            // context.dispatch("findAllCustomers");
            return response;
        },
        async batchDeleteProduct(context,ids){
            // 1. 批量删除
            let response = await post_array("/product/batchDelete",{ids})
            // 2. 分发
            // context.dispatch("findAllCustomers");
            // 3. 返回结果
            return response;
        },
    }
}