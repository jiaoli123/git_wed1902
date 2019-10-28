import {get} from '../http/axios';
export default {
    namespaced:true,
    state:{
        productss:[],
    },
    getters:{
       
    },
    mutations:{
        refresh(state,productss){
            state.productss = productss;
        },
        
    },
    actions:{
        async findByCategoryId(context,id){
            let response = await get("/product/findByCategoryId?id="+id);
            context.commit("refresh",response.data)
          }
    }
}