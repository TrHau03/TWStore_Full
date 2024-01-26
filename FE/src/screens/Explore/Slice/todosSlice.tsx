import {createSlice} from '@reduxjs/toolkit';

interface List {
  listProduct: Array<{
    id: number;
    img: any;
    name: string;
    price: number;
    category: string;
  }>;
  listCategory: Array<{
    category: string
  }>
}
const initialState: List = {
    listProduct: [
        {
            id: 1,
            img: require('../../../asset/image/imgProduct.png'),
            name: 'A',
            price: 29999,
            
            category: 'Man Shoes',
          },
          {
            id: 2,
            img: require('../../../asset/image/imgProduct3.png'),
            name: 'B',
            price: 2999,
            category: 'Women Shoes',
          },
          {
            id: 3,
            img: require('../../../asset/image/imgProduct1.png'),
            name: 'C',
            price: 2998,
            category: 'Man Shoes',
          },
          {
            id: 4,
            img: require('../../../asset/image/imgProduct2.png'),
            name: 'D',
            price: 2997,
            category: 'Women Shoes',
          },
          {
            id: 5,
            img: require('../../../asset/image/imgProduct3.png'),
            name: 'E',
            price: 2995,
            category: 'Man Shoes',
          },
          {
            id: 6,
            img: require('../../../asset/image/imgProduct2.png'),
            name: 'F',
            price: 2996,
            category: 'Women Shoes',
          },
    ],
    listCategory:[
      {category: 'All'},
      {category: 'Man Shoes'},
      {category: 'Women Shoes'},
    ]
}
export default createSlice({
  name: 'todoList',
  initialState,
  reducers: {
  },

});
