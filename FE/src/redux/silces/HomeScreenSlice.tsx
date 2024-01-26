import { createSlice } from '@reduxjs/toolkit';

interface Banner {
    id: number;
    image: string;
    nameScreen: string;
}
interface RecomnenProduct {
    id: number;
    image: string;
    name: string;
    price: number;
    strikeThrough: number;
    saleOff: number;
}

interface Filters {
    search: string,
    brand: string,
    color: string,
    size: string,
    loading: boolean,
}
interface FilterPrice {
    minPrice: string;
    maxPrice: string;
}

interface Offer {
    id: number;
    image: any;
    title: string;
    content: string;
    date: string;
    time: string;
}
interface Product {
    id: number;
    image: string;
    name: string;
    price: number;
    strikeThrough: number;
    saleOff: number;
    sex: string;
    brand: string;
    category: string;
    color: string;
    size: string;
}
interface Order {
    id: number;
    code: string;
    date: string;
    items: number;
    price: string;
    status: number;
}

interface InitialState {
    filters: Filters,
    offer: Array<Offer>,
    filterPrice: FilterPrice,
    order: Array<Order>,
}

const initialState: InitialState = {
    filterPrice: {
        minPrice: '0',
        maxPrice: '5000000',
    },

    filters: {
        search: '',
        brand: 'All',
        color: 'All',
        size: 'All',
        loading: false,
    },
    order: [
        {
            id: 1,
            code: 'FGHJYTN',
            date: 'August 11, 2023',
            items: 1,
            price: '299,43',
            status: 1,
        },
        {
            id: 2,
            code: 'KFGSSFSF',
            date: 'August 1, 2023',
            items: 2,
            price: '299,43',
            status: 2,
        },
        {
            id: 3,
            code: 'SFVWWQC',
            date: 'August 5, 2017',
            items: 3,
            price: '300,43',
            status: 3,
        },
        {
            id: 4,
            code: 'VEWFVWF',
            date: 'August 1, 2017',
            items: 2,
            price: '255,43',
            status: 4,
        },
    ],
    offer: [
        {
            id: 1,
            image: require('../../asset/image/Offer.png'),
            title: 'The Best Title',
            content: 'Culpa cillum consectetur labore nulla nulla magna irure. Id veniam culpa officia aute dolor',
            date: '21/07/2002',
            time: '9:00 PM',
        },
        {
            id: 2,
            image: require('../../asset/image/Offer.png'),
            title: 'SUMMER OFFER 98% Cashback',
            content:
                'Culpa cillum consectetur labore nulla nulla magna irure. Id veniam culpa officia aute dolor',
            date: '21/07/2002',
            time: '9:00 PM',
        },
        {
            id: 3,
            image: require('../../asset/image/Offer.png'),
            title: 'Special Offer 25% OFF',
            content:
                'Culpa cillum consectetur labore nulla nulla magna irure. Id veniam culpa officia aute dolor amet deserunt ex proident commodo',
            date: '21/07/2002',
            time: '9:00 PM',
        },
        {
            id: 4,
            image: require('../../asset/image/Offer.png'),
            title: 'SUMMER OFFER 98% Cashback',
            content:
                'Culpa cillum consectetur labore nulla nulla magna irure. Id veniam culpa officia aute dolor',
            date: '21/07/2002',
            time: '9:00 PM',
        },
    ],





};

const HomeScreenSlice = createSlice({
    name: 'HomeScreenSlice',
    initialState,
    reducers: {
        searchFilterChange: (state, action) => {
            state.filters.search = action.payload;
        },
        filterBrand: (state, action) => {
            state.filters.brand = action.payload;
        },
        filterColor: (state, action) => {
            console.log(action.payload);

            state.filters.color = action.payload;
        },
        filterSize: (state, action) => {
            state.filters.size = action.payload;
        },
        filterPrice: (state, action) => {
            state.filterPrice.minPrice = action.payload.minPrice;
            state.filterPrice.maxPrice = action.payload.maxPrice;
        },
    },
});



export default HomeScreenSlice;
