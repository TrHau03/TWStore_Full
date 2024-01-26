import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AxiosInstance from '../../Axios/Axios';


export const fetchInitialListProductRecommend: any = createAsyncThunk('Slice/fetchInitialListProductRecommend', async (url: any) => {
  const response = await AxiosInstance().get(url);
  return response.data;
})
export const fetchInitialListProductFilter: any = createAsyncThunk('Slice/fetchInitialListProductFilter', async (url: any) => {

  const { brandID, categoryID } = url;
  const response = await AxiosInstance().get(categoryID ? `product/getProductByIdCategory/${categoryID}` : `product/getProductByIdBrand/${brandID}`);
  return response.data;
})

const initialState = {
  isLogin: false,
  isLoading: false,
  LoginGoogle: false,
  LoginFaceBook: false,

  user: {
    _id: '',
    _idUser: '',
    email: '',
    userName: '',
    cartItem: [],
    avatar: '',
    gender: '',
    birthDay: '',
    address: [],
    phone: '',
    password: '',
  },
  listProductRecommend: [],
  listProductFilter: [],

};

const Slice = createSlice({
  name: 'Slice',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const value = action.payload;
      state.user = value;
    },
    updateUserID: (state, action) => {
      const value = action.payload;
      state.user._idUser = value;
    },
    updateGender: (state, action) => {
      const value = action.payload
      state.user.gender = value;
    },
    updatePhone: (state, action) => {
      const value = action.payload
      state.user.phone = value;
    },
    updateBirthDay: (state, action) => {
      const value = action.payload
      state.user.birthDay = value;
    },
    updateEmail: (state, action) => {
      const value = action.payload
      state.user.email = value;
    },
    updateName: (state, action) => {
      const value = action.payload
      state.user.userName = value;
    },
    updatePass: (state, action) => {
      const value = action.payload
      state.user.password = value;
    },
    cartEmpty: (state, action) => {
      state.user.cartItem = action.payload;
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.user.cartItem = state.user.cartItem.filter((item: any) => item.key !== action.payload);
    },
    addItem: (state, action) => {
      state.user.cartItem.push(action.payload as never);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const quantityToUpdate: any = state.user.cartItem.find((item: any) => item.productID._id === id);
      if (quantityToUpdate) {
        quantityToUpdate.quantity = quantity;
      }
    },
    addAddress: (state, action) => {
      state.user.address.push(action.payload as never);
    },
    deleteAddress: (state, action) => {
      state.user.address = state.user.address.filter((item: any) => item.position !== action.payload);
    },
    isLogin: (state, action) => {
      const value = action.payload;
      state.isLogin = value;
    },
    isLoading: (state, action) => {
      const value = action.payload;
      state.isLoading = value;
    },
    LoginGoogle: (state, action) => {
      console.log('login gg', action.payload);
      const value = action.payload;
      state.LoginGoogle = value;
    },
    LoginFacebook: (state, action) => {
      console.log('login fb', action.payload);
      const value = action.payload;
      state.LoginFaceBook = value;
    },
  },


  extraReducers: builder => {
    builder
      .addCase(fetchInitialListProductRecommend.fulfilled, (state, action) => {
        state.listProductRecommend = action.payload;
      }),
      builder
        .addCase(fetchInitialListProductFilter.fulfilled, (state: any, action: any) => {
          state.listProductFilter = action.payload;
        })
  },

});
export const { cartEmpty, updateUser, isLogin, isLoading, LoginFacebook, LoginGoogle, removeItem, updateQuantity, updateGender, updatePhone, updateBirthDay, updateEmail, updateName, deleteAddress, addItem, addAddress, updatePass } = Slice.actions
export default Slice.reducer;
