import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { COLORS, ROUTES } from '../../component/constants';
import { AirbnbRating } from 'react-native-ratings';
import Icon from 'react-native-vector-icons/Ionicons';
import { PropsExplore } from '../../component/Navigation/Props';
import { RootStackParamListExplore, RootStackScreenEnumExplore } from '../../component/Root/RootStackExplore';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts, todoRemainingProducts } from '../../redux/silces/HomeSelector';
import HomeScreenSlice from '../../redux/silces/HomeScreenSlice';
import ButtonBottom from '../../component/Button/Button';
import * as Animatable from 'react-native-animatable';
import FilterScreen from './Filter';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import Octicons from 'react-native-vector-icons/Octicons';
import { fetchInitialListProductFilter } from '../../redux/silces/Silces';
import { HEIGHT, PADDING_HORIZONTAL, PADDING_TOP, WIDTH } from '../../utilities/utility';
import { NumericFormat } from 'react-number-format';
interface Product {
  id: number;
  img: any;
  name: string;
  price: number;
  category: string;
}
interface ArrayProduct {
  category: string;
}
type NavigationProps = StackNavigationProp<RootStackParamListExplore, RootStackScreenEnumExplore>
const Category_Detail_Screen = (props: NativeStackHeaderProps) => {
  const { categoryID, brandID }: any = props.route.params;

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    if (isFocused) {
      dispatch(fetchInitialListProductFilter({ categoryID, brandID }));
    }
  }, [isFocused])
  const [refresh, setRefresh] = useState<boolean>(false);
  const [textInputStatus, setTextInputStatus] = useState<boolean>(false);
  const [dataFilter, setdataFilter] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [highLightBrand, setHighLightBrand] = useState<string>('');
  const [unEnableBrand, setUnEnableBrand] = useState<boolean>(false);
  const [highLightColor, setHighLightColor] = useState<string>('');
  const [unEnableColor, setUnEnableColor] = useState<boolean>(false);
  const [highLightSize, setHighLightSize] = useState<string>('');
  const [unEnableSize, setUnEnableSize] = useState<boolean>(false);
  const [sort, setSort] = useState<boolean>(false);
  const [color, setColor] = useState<string>('All');
  const [brand, setBrand] = useState<string>('All');
  const [size, setSize] = useState<string>('All');
  const [priceMin, setpriceMin] = useState<string>('0')
  const [priceMax, setpriceMax] = useState<string>('5000000');

  //redux
  const [textInputSearch, setTextInputSearch] = useState<string>('');
  const todoListProducts = useSelector(todoRemainingProducts);

  const handleSearch = (e: any) => {
    setTextInputSearch(e);
    dispatch(
      HomeScreenSlice.actions.searchFilterChange(e)
    )
  }

  useEffect(() => {
    if (sort) {
      const newArray = todoListProducts.sort(function (a: { price: string; }, b: { price: string; }) {
        return parseFloat(a.price) - parseFloat(b.price);
      });
      setdataFilter(newArray);
    } else {
      const newArray = todoListProducts.sort(function (a: { price: string; }, b: { price: string; }) {
        return parseFloat(b.price) - parseFloat(a.price);
      });
      setdataFilter(newArray);
    }
  });

  const renderItem = ({ item }: any): React.JSX.Element => {
    const { image, productName, price, strikeThrough, offer, brand } = item;

    return (
      <TouchableOpacity onPress={() => navigation.navigate(RootStackScreenEnumExplore.Productdetail, { id: item._id })} style={styles.containerItemPD}>
        <View style={styles.content}>
          <View style={styles.ImgContainerPD}>
            <Image style={{ width: '100%', height: '100%' }} source={{ uri: image[0] }} />
          </View>
          <View style={styles.in4PD}>
            <View style={styles.in4Text}>
              <Text style={styles.NamePD}>{productName.length < 25 ? productName : productName.substring(0, 25) + "..."}</Text>
            </View>
            {(offer > 0) ?
            <NumericFormat displayType={'text'} value={Number(price - price * (offer / 100))} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.PricePD}>{formattedValue + 'đ'} </Text>} />
            : <></>}
            <View style={styles.sale}>
              <NumericFormat displayType={'text'} value={Number(price)} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={offer > 0 ? styles.txtOldPrice : styles.PricePD}>{formattedValue + 'đ'}</Text>} />
              {offer > 0 && <Text style={styles.txtSale}>{offer}% Off</Text>}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const onRefresh = React.useCallback(() => {
    setRefresh(true);
    dispatch(fetchInitialListProductFilter({ categoryID, brandID }));
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  }, []);
  return (
    <View style={styles.container}>
      <Modal
        transparent={false}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => true} >
        <View style={{ height: '100%' }}>
          <FilterScreen action={{ setModalVisible, setHighLightBrand, setUnEnableBrand, setHighLightColor, setUnEnableColor, setHighLightSize, setUnEnableSize, setBrand, setColor, setSize, setpriceMin, setpriceMax }} state={{ highLightBrand, modalVisible, unEnableBrand, highLightColor, unEnableColor, highLightSize, unEnableSize, brand, color, size, priceMin, priceMax }} />
          <Animatable.View animation={'bounceIn'} style={{ paddingHorizontal: 20, position: 'relative', bottom: 20 }}>
            <Pressable onPress={() => { setModalVisible(false) }}>
              <ButtonBottom title='Hủy' />
            </Pressable>
          </Animatable.View>
        </View>
      </Modal>
      <View style={styles.group}>
        <Pressable onPress={() => navigation.navigate(RootStackScreenEnumExplore.ExploreScreen)}>
          <Icon name='chevron-back-outline' size={25} color={'#696969'} />
        </Pressable>
        <View style={(!textInputStatus) ? styles.headerLeft : [styles.headerLeft, { borderColor: COLORS.gray }]}>
          <Icon name='search' size={22} />
          <TextInput
            placeholder="Tìm kiếm"
            style={[styles.TextSearch]}
            onFocus={() => setTextInputStatus(true)}
            onBlur={() => setTextInputStatus(false)}
            onChangeText={handleSearch}
            value={textInputSearch}
          />
          {(textInputStatus) ?
            <Pressable style={{ position: 'absolute', right: 5, backgroundColor: '#dbd9d9', borderRadius: 5 }}
              onPress={() => { setTextInputSearch('') }}
            >
              <Icon name='close' size={14} />
            </Pressable>
            : null}
        </View>
        <View style={styles.left}>
          <TouchableOpacity onPress={() => setSort(!sort)}>
            <Octicons name={!sort ? 'sort-asc' : 'sort-desc'} size={24} />
          </TouchableOpacity >
          <TouchableOpacity onPress={() => { setModalVisible(true) }}>
            <Icon name='filter' size={24} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.product}>
        <View style={styles.product_Item}>
          <View>
            <Text
              style={{
                color: '#223263',
                fontSize: 18,
                fontFamily: 'Poppins',
                fontWeight: '700',
                lineHeight: 21.6,
                letterSpacing: 0.5,
                marginTop: 15,
                marginLeft: 10,
              }}>
              {dataFilter.length} sản phẩm
            </Text>
          </View>
        </View>
        <FlatList
          style={{ maxWidth: WIDTH, marginBottom: 45, marginTop: 10 }}
          showsVerticalScrollIndicator={false}
          data={dataFilter}
          renderItem={renderItem}
          keyExtractor={(item: any) => item._id.toString()}
          numColumns={2}
          columnWrapperStyle={{ columnGap: 10, justifyContent: 'center' }}
          refreshing={refresh}
          onRefresh={onRefresh}
        />
      </View>
    </View >
  );
};

export default Category_Detail_Screen;

const styles = StyleSheet.create({
  dropdown1BtnStyle: {
    borderColor: '#444',
    width: 100,
    backgroundColor: 'transparent',
  },
  dropdown1BtnTxtStyle: {
    color: '#223263',
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 21.6,
    letterSpacing: 0.5,
    textAlign: 'left',
  },
  dropdown1DropdownStyle: { borderRadius: 5, backgroundColor: '#E6E6E6' },
  dropdown1RowStyle: { borderBottomColor: '#C5C5C5' },
  dropdown1RowTxtStyle: {
    color: '#223263',
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 21.6,
    letterSpacing: 0.5,
    textAlign: 'left',
  },
  headerLeft: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    borderColor: '#e1dede',
    alignItems: 'center',
    flexDirection: 'row',
    width: '70%',
    height: '85%'
  },
  product_Item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  product: {
    width: '100%',
    height: '100%',
  },
  txtSale: {
    color: 'red',
    fontSize: 15,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  txtOldPrice: {
    textDecorationLine: 'line-through', // Gạch ngang văn bản
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  sale: {
    width: '80%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent:'center',
    
  },
  star: {
    width: '75%',
    marginTop: 5,
  },

  content: {
    width: '100%',
    padding: 5,
  },
  NamePD: {
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    fontFamily: 'Helvetica Neue',
    color: 'black',
    margin: 1,
    textAlign: 'center',
    paddingHorizontal: 10
  },
  PricePD: {
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    fontFamily: 'Helvetica Neue',
    lineHeight: 24,
    color: '#4464C4',
    alignSelf: 'center',
    paddingBottom: 10,
  },
  in4Text: {
    marginTop: 5,
    width: '100%',
  },
  ImgContainerPD: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '50%',
    borderRadius: 20,
  },

  in4PD: {
    justifyContent: 'space-between',
    width: '100%',
    height: '50%',
    borderRadius: 5,
  },
  containerItemPD: {
    borderWidth: 0.5,
    width: '48%',
    height: 270,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    shadowColor: '#C4C4C4',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10
  },

  TextSearch: {
    width: WIDTH / 2,
    justifyContent: 'center',
    marginLeft: 10,
    paddingVertical: 2,

  },
  imageSearch: {
    width: 20,
    height: 20,
  },
  left: {
    flexDirection: 'row',
    marginLeft: 5,
    gap: 10,
    width: '20%',
    height: '100%',
    alignItems: 'center',
  },

  right: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    borderColor: '#EBF0FF',
    alignItems: 'center',
    flexDirection: 'row',
    width: '80%',
    height: '100%',
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    columnGap: 10
  },
  container: {
    height: '100%',
    paddingTop: PADDING_TOP,
    paddingHorizontal: PADDING_HORIZONTAL,
    backgroundColor: '#fff',
  },
});


