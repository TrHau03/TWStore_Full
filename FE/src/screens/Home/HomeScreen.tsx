import { StyleSheet, Text, View, TextInput, Image, Pressable, ScrollView, FlatList, SectionList, TouchableOpacity, Animated } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { CompositeNavigationProp, NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { RootStackParamListHome, RootStackScreenEnumHome } from '../../component/Root/RootStackHome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BG_COLOR, PADDING_HORIZONTAL, PADDING_TOP, WIDTH } from '../../utilities/utility';
import { RootStackParamListExplore, RootStackScreenEnumExplore } from '../../component/Root/RootStackExplore';
import { COLORS } from '../../utilities';
import { useDispatch, useSelector } from 'react-redux';
import AxiosInstance from '../../Axios/Axios';
import { RootStackScreenEnumOffer } from '../../component/Root/RootStackOffer';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { listProductRecommend, searchProduct } from '../../redux/silces/HomeSelector';
import { fetchInitialListProductRecommend } from '../../redux/silces/Silces';
import { RefreshControl } from 'react-native';
import { NumericFormat } from 'react-number-format';



const HomeScreen = ({ navigation }: NativeStackHeaderProps | any) => {
    const isFocused = useIsFocused();

    const [refreshing, setRefreshing] = useState<boolean>(false);

    const [imgActive, setimgActive] = useState(0);

    const [textInputStatus, setTextInputStatus] = useState<boolean>(false);

    const [textInputSearch, setTextInputSearch] = useState<string>('');

    const [images, setImages] = useState<[]>([]);
    const [brand, setBrand] = useState<[]>([]);
    const [productFilter, setProductFilter] = useState<[]>([]);
    const [textInputSearchOnChange, setTextInputSearchOnChange] = useState<string>('');
    const inputRef = useRef<any>(null);
    const listProduct = useSelector(listProductRecommend);

    const unfocusInputSearch = () => {
        if (inputRef.current) {
            inputRef.current.blur();
        }
    }

    const dispatch = useDispatch();

    const fetchBanner = async () => {
        const response = await AxiosInstance().get(`banner/getAllBanner`);
        setImages(response.data.banner);
    }
    const fetchBrand = async () => {
        const response = await AxiosInstance().get(`brand/getAllBrand`);
        setBrand(response.data)
    }
    const fetchListProductsFilter = async () => {
        const response = await AxiosInstance().get('product/getAllProduct');
        setProductFilter(response.data);
    }

    useEffect(() => {
        if (isFocused) {
            dispatch(fetchInitialListProductRecommend('product/getRecommendProduct'));
            fetchBrand();
            fetchBanner();
            fetchListProductsFilter();
        }
    }, [isFocused])
    const onChange = (nativeEvent: any) => {
        if (nativeEvent) {
            const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
            if (slide >= 0) {
                setimgActive(slide);
            }
        }
    }


    const renderItem = ({ item }: { item: { _id: string, name: string, linkIcon: string } }) => (
        <Pressable style={styles.item} onPress={() => navigation.navigate('Explore', { screen: RootStackScreenEnumExplore.Category_Detail_Screen, params: { brandID: item._id } })}>
            <View style={styles.bodericon}>
                <Image style={{ width: 50, height: 50 }} source={{ uri: item.linkIcon }} />
            </View>
            <Text style={styles.textname}>{item.name}</Text>
        </Pressable>
    );

    const renderItemSearch = ({ item }: any) => (
        <TouchableOpacity onPress={() => { setTextInputStatus(false), navigation.navigate('Explore', { screen: RootStackScreenEnumExplore.Productdetail, params: { id: item._id } }) }} style={{ marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: 'auto' }}>
            <Text style={{ fontSize: 15, marginLeft: 10, alignSelf: 'center', color: 'black' }}>{item.productName.length < 35 ? item.productName : item.productName.substring(0, 35) + "..."}</Text>
            <Image style={{ marginRight: 10, width: 50, height: 50, alignSelf: 'center' }} source={{ uri: item.image[0] }} />
        </TouchableOpacity>
    );


    const renderItem3 = ({ item }: any) => {
        return (
            <TouchableOpacity style={styles.itemsale2} onPress={() => navigation.navigate('Explore', { screen: RootStackScreenEnumExplore.Productdetail, params: { id: item._id } })}>
                <Image style={styles.imageproduct} source={{ uri: item.image[0] }} />
                <View style={{ rowGap: 15, alignSelf: 'center', width: '95%' }}>
                    <Text style={styles.nameproduct}>{item.productName.length < 20 ? item.productName : item.productName.substring(0, 20) + "..."}</Text>
                </View>
                <View style={styles.stylesaleoff}>
                    {item.offer > 0 ?
                        <NumericFormat displayType={'text'} value={Number(item.price - item.price * (item.offer / 100))} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.price}>{formattedValue + 'đ'} </Text>} />
                        : <></>}
                    <View style={{ flexDirection: "row", justifyContent: 'center', width: '100%' }}>
                        <NumericFormat displayType={'text'} value={Number(item.price)} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={item.offer > 0 ? styles.strikethrough : styles.price}>{formattedValue + 'đ'}</Text>} />
                        {item.offer > 0 && <Text style={styles.saleoff}>{item.offer}% Off</Text>}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(fetchInitialListProductRecommend('product/getRecommendProduct'));
        fetchBrand();
        fetchBanner();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <SafeAreaView style={{ width: WIDTH, paddingHorizontal: PADDING_HORIZONTAL, paddingTop: PADDING_TOP, backgroundColor: BG_COLOR }}>
            <View style={styles.top}>
                <View style={(!textInputStatus) ? styles.headerLeft : [styles.headerLeft, { borderColor: COLORS.gray }]}>
                    <Icon name='search' size={22} />
                    <TextInput
                        placeholder="Tìm kiếm"
                        style={[styles.TextSearch]}
                        onFocus={() => setTextInputStatus(true)}
                        onSubmitEditing={e => setTextInputSearch(e.nativeEvent.text)}
                        onChangeText={setTextInputSearchOnChange}
                        value={textInputSearchOnChange}
                        ref={inputRef}
                    />
                    {textInputStatus && <Pressable onPress={() => { setTextInputSearch(''), setTextInputStatus(false), setTextInputSearchOnChange(''), unfocusInputSearch() }} style={{ position: 'absolute', right: 10, borderRadius: 5 }}>
                        <Icon name='close' size={14} />
                    </Pressable>}

                </View>


                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => navigation.navigate(RootStackScreenEnumHome.NotificationScreen)}>
                        <Icon name="notifications-outline" size={25} />
                    </TouchableOpacity>
                </View>

            </View>
            {(textInputStatus) ?
                (
                    <View>
                        <FlatList
                            data={productFilter.filter((item: any) => item.productName.toLowerCase().includes(textInputSearch.toLowerCase()))}
                            renderItem={renderItemSearch}
                            keyExtractor={(item: any) => item?._id.toString()} />
                    </View>
                )
                : (
                    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} horizontal={false} scrollEnabled={true} showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]} scrollEventThrottle={16}>
                        <View style={styles.topslide}>
                            <ScrollView
                                nestedScrollEnabled={true}
                                onScroll={({ nativeEvent }) => onChange(nativeEvent)}
                                showsHorizontalScrollIndicator={false}
                                pagingEnabled
                                horizontal
                                style={styles.slide}
                            >
                                {
                                    images.map((e: any, index) =>
                                        <Pressable onPress={() => navigation.navigate('Offer', { screen: RootStackScreenEnumOffer.OfferHome })} key={e._id}>
                                            <Image
                                                resizeMode='stretch'
                                                style={styles.slide}
                                                source={{ uri: e.image }}
                                            />
                                        </Pressable>
                                    )
                                }
                            </ScrollView>

                            <View style={styles.warpdot}>
                                {
                                    images.map((e: any, index) =>
                                        <Text
                                            key={e._id}
                                            style={imgActive == index ? styles.dotactive : styles.dot}
                                        >●</Text>
                                    )
                                }
                            </View>
                        </View>

                        <View style={styles.category}>
                            <Text style={styles.textcategory}>Hãng</Text>
                            <View style={styles.listcategory}>
                                <FlatList
                                    data={brand}
                                    horizontal
                                    nestedScrollEnabled={true}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.name}
                                />
                            </View>
                        </View>
                        <View >
                            <Image style={styles.imgrecomended} source={require('../../asset/image/bannerRecomendedProduct.png')} />
                        </View>
                        <FlatList
                            scrollEnabled={false}
                            contentContainerStyle={{ alignItems: 'center' }}
                            style={{ maxWidth: WIDTH, marginBottom: 45, marginTop: 10 }}
                            showsVerticalScrollIndicator={false}
                            data={listProduct}
                            renderItem={renderItem3}
                            keyExtractor={(item: any) => item._id.toString()}
                            numColumns={2}
                            columnWrapperStyle={{ columnGap: 5 }}
                        />
                    </ScrollView>
                )}
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },

    favorite: {
        width: 24,
        height: 24,
    },

    notification: {
        width: 24,
        height: 24,
    },

    pressable: {
        width: 24,
        height: 24,
    },
    headerRight: {
        position: 'absolute',
        right: 0
    },
    TextSearch: {
        width: WIDTH / 2,
        justifyContent: 'center',
        marginLeft: 10,
        paddingVertical: 0,
    },
    headerLeft: {
        borderWidth: 1,
        padding: 5,
        borderRadius: 5,
        borderColor: '#e1dede',
        alignItems: 'center',
        flexDirection: 'row',
        width: '85%',
        height: '85%'
    },
    topslide: {
        width: '100%',
    },

    slide: {
        height: WIDTH * 0.5,
        width: WIDTH * 0.9,
        borderRadius: 6,
    },

    warpdot: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        alignSelf: 'center',
    },

    dotactive: {
        margin: 3,
        color: 'black'
    },

    dot: {
        margin: 3,
        color: 'white'
    },

    category: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
    },

    textcategory: {
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        fontSize: 15,
        color: '#223263'
    },

    listcategory: {
        marginTop: 10,
        height: 100,
    },

    item: {
        marginRight: 22,
        alignItems: 'center',
    },

    Icon: {
        width: 26,
        height: 26,
    },

    textname: {
        fontSize: 16
    },

    bodericon: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderRadius: 90,
        borderColor: '#EBF0FF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    flashsale: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    textflashsale: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#BF0202'
    },

    textflashsale2: {
        fontWeight: 'bold',
        fontSize: 15,
        color: 'black'
    },

    listflastsale: {
        height: WIDTH * 0.7,
        marginTop: 5,
        marginBottom: 5
    },

    itemsale: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: 240,
        width: 140,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: '#EBF0FF',
    },

    imageproduct: {
        alignSelf: 'center',
        width: 92,
        height: 92,
    },
    nameproduct: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#223263',
        width: '100%',
        textAlign: 'center'
    },

    price: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#4464C4',
    },

    stylesaleoff: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        alignItems: 'center',
        rowGap: 10,
        width: '100%'
    },

    strikethrough: {
        textDecorationLine: 'line-through',
        fontSize: 15,
        marginRight: 12,
        marginLeft: 15
    },

    saleoff: {
        fontWeight: 'bold',
        fontSize: 13,
        color: '#FB7181'
    },

    megasale: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },

    imgrecomended: {
        width: '100%',
        borderRadius: 5,
    },

    itemsale2: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        height: 240,
        width: WIDTH / 2.3,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: 'black',
        marginBottom: 5,
    }

})
