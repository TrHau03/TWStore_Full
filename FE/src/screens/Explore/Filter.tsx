import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  View,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Header from '../../component/Header/Header'
import { useDispatch, useSelector } from 'react-redux';
import HomeScreenSlice from '../../redux/silces/HomeScreenSlice';
import { COLORS } from '../../utilities';
import Button from '../../component/Button/Button';
import { useIsFocused } from '@react-navigation/native';
import AxiosInstance from '../../Axios/Axios';
import { HEIGHT } from '../../utilities/utility';
import { NumericFormat } from 'react-number-format';

interface Brand {
  _id: number;
  name: string;
  linkIcon: string;
}
interface Color {
  _id: number;
  name: string;
  code: string;
}
interface Size {
  _id: number;
  name: string;
}

const FilterScreen = (props: any) => {
  const isFocused = useIsFocused();

  const [dataBrand, setDataBrand] = useState<Brand[]>([]);
  const [dataColor, setDataColor] = useState<Color[]>([]);
  const [dataSize, setDataSize] = useState<Color[]>([]);

  useEffect(() => {
    const fetchBrand = async () => {
      const response = await AxiosInstance().get(`brand/getAllBrand`);
      setDataBrand(response.data)
    }
    const fetchColor = async () => {
      const response = await AxiosInstance().get(`color/getAllColor`);
      setDataColor(response.data)
    }
    const fetchSize = async () => {
      const response = await AxiosInstance().get(`Size/getAllSize`);
      setDataSize(response.data)
    }
    if (isFocused) {
      fetchBrand();
      fetchColor();
      fetchSize();
    }
  }, [isFocused])

  const [visibleBrand, setVisibleBrand] = useState<boolean>(false);
  const [visibleSize, setVisibleSize] = useState<boolean>(false);
  const [visibleColor, setVisibleColor] = useState<boolean>(false);

  const dispatch = useDispatch();

  const { unEnableBrand, highLightBrand, unEnableColor, highLightColor, unEnableSize, highLightSize, brand, color, size, priceMin, priceMax } = props.state;
  const { setModalVisible, setHighLightBrand, setUnEnableBrand, setHighLightColor, setUnEnableColor, setHighLightSize, setUnEnableSize, setBrand, setColor, setSize, setpriceMin, setpriceMax } = props.action;


  const handleFilter = (brand: string, color: string, size: string, minPrice: string, maxPrice: string) => {
    dispatch(HomeScreenSlice.actions.filterBrand(brand));
    dispatch(HomeScreenSlice.actions.filterColor(color));
    dispatch(HomeScreenSlice.actions.filterSize(size));
    dispatch(HomeScreenSlice.actions.filterPrice({ minPrice, maxPrice }))

  }


  const renderItemBrand = ({ item }: any) => {
    const { _id, name } = item;
    return (
      <TouchableOpacity style={{ width: '28%', borderWidth: 1, marginBottom: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: highLightBrand == _id && unEnableBrand ? COLORS.blue : COLORS.white }}
        onPress={() => { !unEnableBrand ? setBrand(name) : setBrand('All'); setHighLightBrand(_id), setUnEnableBrand(!unEnableBrand) }}>
        <Text style={{ fontSize: 18 }}>{name}</Text>
      </TouchableOpacity>
    )
  }
  const renderItemColor = ({ item }: any) => {
    const { _id, name, code } = item;
    return (
      <TouchableOpacity style={{ width: '28%', borderWidth: 1, marginBottom: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: highLightColor == _id && unEnableColor ? COLORS.blue : COLORS.white }}
        onPress={() => { !unEnableColor ? setColor(code) : setColor('All'); setHighLightColor(_id), setUnEnableColor(!unEnableColor) }}>
        <Text style={{ fontSize: 18 }}>{name}</Text>
      </TouchableOpacity>
    )
  }
  const renderItemSize = ({ item }: any) => {
    const { _id, name } = item;
    return (
      <TouchableOpacity style={{ width: '28%', borderWidth: 1, marginBottom: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: highLightSize == _id && unEnableSize ? COLORS.blue : COLORS.white }}
        onPress={() => { !unEnableSize ? setSize(name) : setSize('All'); setHighLightSize(_id), setUnEnableSize(!unEnableSize) }}>
        <Text style={{ fontSize: 18 }}>{name}</Text>
      </TouchableOpacity>
    )
  }


  return (
    <View>
      <View style={styles.container}>
        <View style={styles.filterPrice}>
          <Text
            style={{
              width: '100%',
              fontSize: 20,
              marginBottom: 20,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Lọc theo giá
          </Text>
          <View style={styles.input}>
            <View style={styles.Price}>
              <NumericFormat displayType={'text'} value={Number(priceMin)} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.textPrice}>{formattedValue + 'đ'} </Text>} />
            </View>
            <View style={styles.Price}>
              <NumericFormat displayType={'text'} value={Number(priceMax)} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.textPrice}>{formattedValue + 'đ'} </Text>} />
            </View>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',

          }}>
          <MultiSlider
            values={[0, 5000000]}
            sliderLength={300}
            min={0}
            max={5000000}
            step={100000}
            allowOverlap={false}
            snapped
            onValuesChangeFinish={(e) => { setpriceMin(e[0].toString()); setpriceMax(e[1].toString()) }}
          />
        </View>

        <View style={styles.BuyingFormat}>
          {/*brand */}
          <View style={styles.Format}>
            <Text style={styles.txtBuyingFormat}>Hãng</Text>
            <Pressable onPress={() => { setVisibleBrand(!visibleBrand), setVisibleColor(false), setVisibleSize(false) }}>
              <Icon name={!visibleBrand ? 'chevron-down-outline' : 'chevron-up-outline'} size={25} color={'#9098B1'} />
            </Pressable>
          </View>
          {visibleBrand &&
            <FlatList
              scrollEnabled={false}
              data={dataBrand}
              columnWrapperStyle={{ justifyContent: 'center', gap: 15 }}
              numColumns={3}
              renderItem={renderItemBrand}
              keyExtractor={(item: any) => item._id.toString()}
              style={{ top: 10 }}
            />}

          {/*Color */}
          <View style={styles.Format}>
            <Text style={styles.txtBuyingFormat}>Màu</Text>
            <Pressable onPress={() => { setVisibleColor(!visibleColor), setVisibleBrand(false), setVisibleSize(false) }}>
              <Icon name={!visibleColor ? 'chevron-down-outline' : 'chevron-up-outline'} size={25} color={'#9098B1'} />
            </Pressable>
          </View>
          {visibleColor &&
            <FlatList
              scrollEnabled={false}
              data={dataColor}
              columnWrapperStyle={{ justifyContent: 'center', gap: 15 }}
              numColumns={3}
              renderItem={renderItemColor}
              keyExtractor={(item) => item._id.toString()}
              style={{ top: 10 }}
            />}

          {/*Size */}
          <View style={styles.Format}>
            <Text style={styles.txtBuyingFormat}>Kích cỡ</Text>
            <Pressable onPress={() => { setVisibleSize(!visibleSize), setVisibleBrand(false), setVisibleColor(false) }}>
              <Icon name={!visibleSize ? 'chevron-down-outline' : 'chevron-up-outline'} size={25} color={'#9098B1'} />
            </Pressable>
          </View>
          {visibleSize &&
            <FlatList
              scrollEnabled={false}
              data={dataSize}
              columnWrapperStyle={{ justifyContent: 'center', gap: 15 }}
              numColumns={3}
              renderItem={renderItemSize}
              keyExtractor={(item) => item._id.toString()}
              style={{ top: 10 }}
            />}
        </View>
        <Pressable style={{ position: 'absolute', width: '100%', bottom: 30, alignSelf: 'center' }} onPress={() => { handleFilter(brand, color, size, priceMin, priceMax); setModalVisible(false), setVisibleBrand(false), setVisibleColor(false), setVisibleSize(false) }}>
          <Button title='Áp Dụng' />
        </Pressable>
      </View>
    </View>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  Price: {
    borderWidth: 0.7,
    width: 'auto',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },

  btnApply: {
    width: '100%',
    height: 50
  },

  Format: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  txtBuyingFormat: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  BuyingFormat: {
    width: '100%',
    marginTop: 25,
    height: "auto",
    gap: 10
  },
  btnNew: {
    padding: 15,
    borderWidth: 0.3,
    borderColor: '#EBF0FF',
    marginLeft: 15,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10
  },

  txtCondition: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  Condition: {
    marginTop: 10,
    width: '100%',
  },
  textPrice: {
    marginHorizontal: 14,
    color: '#9098B1',
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 21.60,
    letterSpacing: 0.50,
  },
  input: {
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
  },
  filterPrice: {
    width: '100%',
  },
  container: {
    width: '100%',
    marginTop: 20,
    height: HEIGHT * 0.85,
    paddingHorizontal: 20
  }
});
