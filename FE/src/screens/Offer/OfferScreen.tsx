import { Animated, FlatList, Image, TextInput, ScrollView, StyleSheet, Text, Keyboard, View, Pressable, NativeSyntheticEvent, TextInputSubmitEditingEventData, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import TimeCountDown from './TimeCountDown';
import { BG_COLOR, PADDING_HORIZONTAL, PADDING_TOP, WIDTH } from '../../utilities/utility';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { NumericFormat } from 'react-number-format';
import { RootStackScreenEnumExplore } from '../../component/Root/RootStackExplore';
import { useNavigation } from '@react-navigation/native';

interface Product {
  _id: string;
  image: any;
  productName: string;
  price: number;
}


const RenderItem = ({ item, offer, navigation }: { item: Product; offer: any, navigation: any }) => {
  
  return (
    <TouchableOpacity style={styles.containerItemPD} onPress={() => navigation.navigate('Explore', { screen: RootStackScreenEnumExplore.Productdetail, params: { id: item._id } })}>
      <View>
        <Image style={{ width: '100%', height: 120, borderRadius: 5 }} source={{ uri: item.image[0] }} />
      </View>
      <View style={{ width: '100%', height: 50, marginTop: 5 }}>
      <Text style={styles.NamePD}>{item.productName.length < 20 ? item.productName : item.productName.substring(0, 30) + "..."}</Text>
      </View>
      <View>
        <NumericFormat displayType={'text'} value={Number(item.price * (1 - (offer / 100)))} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.PricePD}>{formattedValue + 'đ'}</Text>} />

        <View style={styles.sale}>
          <NumericFormat displayType={'text'} value={Number(item.price)} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={offer > 0 ? styles.txtOldPrice : styles.PricePD}>{formattedValue + 'đ'}</Text>} />
          
          <Text style={styles.txtSale}>{offer}% Off</Text>
        </View>
      </View>
    </TouchableOpacity >
  )
}

const OfferScreen = (props: NativeStackHeaderProps) => {
  const { item }: any = props.route.params;
  const { navigation } = props
  const [search, setSearch] = useState<string>('');
  const [listProductSale, setListProductSale] = useState<[]>([])
  useEffect(() => {
    const listProduct = item.product.filter((item: any) => {
      return item.productName.toLowerCase().includes(search.toLowerCase());
    });
    setListProductSale(listProduct);
  }, [search])

  const translateAnimHeader = useRef(new Animated.Value(0)).current;
  const translateAnimSearch = useRef(new Animated.Value(0)).current;
  const animTextInput = useRef(new Animated.Value(0)).current;
  const PressableAnimated = Animated.createAnimatedComponent(Pressable);
  const TextInputAnimated = Animated.createAnimatedComponent(TextInput);
  const refInput = useRef<TextInput>(null);

  const animationFlex = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.parallel([
      Animated.timing(translateAnimHeader, {
        toValue: -200,
        duration: 200,
        useNativeDriver: true,
      }),
      // Will change fadeAnim value to 1 in 5 seconds
      Animated.timing(translateAnimSearch, {
        toValue: -295,
        duration: 500,
        useNativeDriver: true,
      }),
      // Will change fadeAnim value to 1 in 5 seconds
      Animated.timing(animTextInput, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      })
    ]).start();
  }

  const animationNone = () => {
    Animated.parallel([
      Animated.timing(translateAnimHeader, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      // Will change fadeAnim value to 1 in 5 seconds
      Animated.timing(translateAnimSearch, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      // Will change fadeAnim value to 1 in 5 seconds
      Animated.timing(animTextInput, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }
  const setTextSearch = (e: string) => {
    setTimeout(() => {
      setSearch(e);
    }, 1000);
  }

  return (
    <View style={{ paddingHorizontal: PADDING_HORIZONTAL, paddingTop: PADDING_TOP, backgroundColor: BG_COLOR }}>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <Animated.View style={[styles.header, { transform: [{ translateX: translateAnimHeader }] }]}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name='chevron-back-outline' size={25} />
          </Pressable>
          <Text style={styles.textTitlePage}>Thông tin khuyến mãi</Text>
        </Animated.View>
        <TextInputAnimated onSubmitEditing={(e) => {
          animationNone();
          setTextSearch(e.nativeEvent.text);
        }}
          ref={refInput}
          style={{ alignSelf: 'center', fontSize: 17, borderBottomWidth: 0.5, paddingVertical: 0, position: 'absolute', width: '80%', height: 35, marginLeft: '20%', transform: [{ scaleX: animTextInput }], opacity: animTextInput }}
          placeholder='Search'
        />
        <PressableAnimated style={{ position: 'absolute', right: 0, transform: [{ translateX: translateAnimSearch }] }} onPress={() => { animationFlex(); refInput?.current?.focus(); }} >
          <Icon name='search-outline' size={25} />
        </PressableAnimated>
      </View>

      <ScrollView style={{ marginBottom: 35, marginTop: 10 }} showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
        <TimeCountDown item={item} />
        <View>
          <Image source={{ uri: item.eventImage }} style={{ width: '100%', height: 180, borderRadius: 5, marginBottom: 5, opacity: 1 }} />
        </View>
        <FlatList
          scrollEnabled={false}
          renderItem={(object) => <RenderItem item={object.item} offer={item.levelGiamgia} navigation={navigation}/>}
          data={listProductSale}
          keyExtractor={(item: Product) => item._id}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          contentContainerStyle={{
          }}
        />
      </ScrollView>
    </View >

  )
}

export default OfferScreen

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
  },
  imgIc: {
    width: '20%',
    marginLeft: 10,
    justifyContent: 'center',
  },
  txtSale: {
    color: 'red',
    fontSize: 15,
    fontWeight: 'bold',
    position: 'absolute',
    right: 0,
  },
  txtOldPrice: {
    textDecorationLine: 'line-through', // Gạch ngang văn bản
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  sale: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  star: {
    width: '65%',
    marginTop: 5,
  },

  content: {
    padding: 15
  },
  NamePD: {
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    fontFamily: 'Helvetica Neue',
    color: 'black',
    margin: 1,
  },
  PricePD: {
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    fontFamily: 'Helvetica Neue',
    lineHeight: 24,
    color: '#4464C4',
    alignSelf: 'center'
  },
  ImgContainerPD: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '50%',
    borderRadius: 20,
  },
  in4Text: {
    marginTop: 5,
    width: '100%',
  },
  in4PD: {
    justifyContent: 'space-between',
    width: '100%',
    height: '50%',
    borderRadius: 5,
  },
  containerItemPD: {
    marginRight: 5,
    marginBottom: 5,
    height: 250,
    width: WIDTH * 0.43,
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#c2c2c2',
    borderRadius: 5,
    marginLeft: 5
  },
  textTitlePage: {
    color: '#223263',
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.50,
    marginLeft: 12
  }
})

