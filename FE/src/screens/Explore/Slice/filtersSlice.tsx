import {createSlice} from '@reduxjs/toolkit'

export default createSlice({
    name: 'filters',
    initialState:{
        search:'',
        category: 'All',
       
    },
    reducers:{
        //Tìm kiếm tên
        search:(state, action)=>{
            //Mutation || IMMER
            state.search = action.payload;
        },
        //Lọc theo trạng thái
        filterCategorySelector:(state, action)=>{
            state.category = action.payload;
        },
    },
})