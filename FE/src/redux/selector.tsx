import {createSelector} from '@reduxjs/toolkit';

export const search = (state:any) => state.filters.search;
export const todoListSelector = (state:any) => state.todoList;
export const filterStatusSelector = (state:any) => state.filters.status;
export const filterCategorySelector = (state:any) => state.filters.category;

export const listProducts = (state:any) =>{
    return state.todoList.listProduct;
}
// export const getAllProducts = createSelector(listProducts,(product:any) => {
//     return product;
// });


export const listCategory = (state:any)   => {
    return state.todoList.listCategory;
}
export const getAllCategories = createSelector(listCategory,(category:any) => {
    return category;
});



export const todoRemainingSelectProduct = createSelector(
    listProducts,
    search,
    filterCategorySelector,
    (listProduct,search, category) => {
        console.log('search: '+search);
        
    return listProduct.filter((todo: any) => {
        if (category === 'All') {
            return todo.category && todo.name.includes(search);
        }
        return todo.name.includes(search)&&todo.category.includes(category);
    })

});
