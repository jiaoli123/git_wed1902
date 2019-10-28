import {get} from '../http/axios';
export default {
    namespaced:true,
    state:{
        addresses:[],
    },
    getters:{
       
    },
    mutations:{
        refresh(state,addresses){
            state.addresses = addresses;
        },
        
    },
    actions:{
        async findByAddressId(context,id){
            let response = await get("/address/findByCustomerId?id="+id);
            context.commit("refresh",response.data)
          }
    }
}