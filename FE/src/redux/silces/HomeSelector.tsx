import { createSelector } from "@reduxjs/toolkit";

export const listProductRecommend = (state: any) => state.SlicesReducer.listProductRecommend;
export const searchFilterChange = (state: any) => state.HomeScreenSlice.filters.search;
export const listProducts = (state: any) => state.SlicesReducer.listProductFilter;
export const filterBrand = (state: any) => state.HomeScreenSlice.filters.brand;
export const filterColor = (state: any) => state.HomeScreenSlice.filters.color;
export const filterSize = (state: any) => state.HomeScreenSlice.filters.size;
export const filterMinPrice = (state: any) => state.HomeScreenSlice.filterPrice.minPrice;
export const filterMaxPrice = (state: any) => state.HomeScreenSlice.filterPrice.maxPrice;
export const listOrder = (state: any) => state.HomeScreenSlice.order;

export const todoRemainingProducts = createSelector(listProducts, searchFilterChange, filterBrand, filterColor, filterSize, filterMinPrice, filterMaxPrice, (product, search, brand, color, size, minPrice, maxPrice) => {
    if (product) {
        return product.filter((todo: any) => {
            if (brand === 'All' && color === 'All' && size === 'All') {
                return todo.productName.includes(search) && Number(minPrice) < todo.price && todo.price < Number(maxPrice);
            } else if (brand === 'All' && color === 'All') {
                return todo.productName.toLowerCase().includes(search.toLowerCase()) && todo.size.some((sizeData: { name: string | any[]; }) => sizeData.name === size) && Number(minPrice) < todo.price && todo.price < Number(maxPrice);
            } else if (brand === 'All' && size === 'All') {
                return todo.productName.toLowerCase().includes(search.toLowerCase()) && todo.colorID.some((colorID: { code: string | any[]; }) => colorID.code === color) && Number(minPrice) < todo.price && todo.price < Number(maxPrice);
            } else if (color === 'All' && size === 'All') {
                return todo.productName.toLowerCase().includes(search.toLowerCase()) && todo.brand.name.includes(brand) && Number(minPrice) < todo.price && todo.price < Number(maxPrice);
            } else if (brand === 'All' && color === 'All' && size === 'All') {
                return todo.productName.toLowerCase().includes(search.toLowerCase()) && Number(minPrice) < todo.price && todo.price < Number(maxPrice);
            } else if (brand === 'All' && color === 'All') {
                return todo.productName.toLowerCase().includes(search.toLowerCase()) && todo.size.some((sizeData: { name: string | any[]; }) => sizeData.name === size) && Number(minPrice) < todo.price && todo.price < Number(maxPrice);
            } else if (brand === 'All' && size === 'All') {
                return todo.productName.toLowerCase().includes(search.toLowerCase()) && todo.colorID.some((colorID: { code: string | any[]; }) => colorID.code === color) && Number(minPrice) < todo.price && todo.price < Number(maxPrice);
            } else if (brand === 'All') {
                return todo.productName.toLowerCase().includes(search.toLowerCase()) && todo.size.some((sizeData: { name: string | any[]; }) => sizeData.name === size) && todo.colorID.some((colorID: { code: string | any[]; }) => colorID.code === color) && Number(minPrice) < todo.price && todo.price < Number(maxPrice);
            } else if (color === 'All' && size === 'All') {
                return todo.productName.toLowerCase().includes(search.toLowerCase()) && todo.brand.includes(brand) && Number(minPrice) < todo.price && todo.price < Number(maxPrice);
            } else if (color === 'All') {
                return todo.productName.toLowerCase().includes(search.toLowerCase()) && todo.brand.includes(brand) && todo.size.some((sizeData: { name: string | any[]; }) => sizeData.name === size) && Number(minPrice) < todo.price && todo.price < Number(maxPrice);
            } else if (size === 'All') {
                return todo.productName.toLowerCase().includes(search.toLowerCase()) && todo.brand.name.includes(brand) && todo.colorID.some((colorID: { code: string | any[]; }) => colorID.code === color) && Number(minPrice) < todo.price && todo.price < Number(maxPrice);
            } else if (brand === 'All') {
                return todo.productName.toLowerCase().includes(search.toLowerCase()) && todo.colorID.some((colorID: { code: string | any[]; }) => colorID.code === color) && todo.size.some((sizeData: { name: string | any[]; }) => sizeData.name === size) && Number(minPrice) < todo.price && todo.price < Number(maxPrice) && Number(minPrice) < todo.price && todo.price < Number(maxPrice)
            } else if (size === 'All') {
                return todo.productName.toLowerCase().includes(search.toLowerCase()) && todo.colorID.some((colorID: { code: string | any[]; }) => colorID.code === color) && todo.brand.includes(brand) && Number(minPrice) < todo.price && todo.price < Number(maxPrice);
            } else if (color === 'All') {
                return todo.productName.toLowerCase().includes(search.toLowerCase()) && todo.size.some((sizeData: { name: string | any[]; }) => sizeData.name === size) && todo.brand.includes(brand) && Number(minPrice) < todo.price && todo.price < Number(maxPrice);
            }
            return todo.productName.toLowerCase().includes(search.toLowerCase()) && todo.brand.name.includes(brand) && todo.colorID.some((colorID: { code: string | any[]; }) => colorID.code === color) && todo.size.some((sizeData: { name: string | any[]; }) => sizeData.name === size) && Number(minPrice) < todo.price && todo.price < Number(maxPrice);
        })
    } else {
        return [];
    }
});

export const searchProduct = createSelector(listProducts, searchFilterChange, (product, search) => {
    return product.filter((todo: any) => {
        return todo.productName.toLowerCase().includes(search.toLowerCase());
    })
});