import { StyleSheet, Text, View, TextInput, FlatList, ScrollView, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../component/Header/Header'
import Button from '../../component/Button/Button'
import AxiosInstance from '../../Axios/Axios'
import { Picker } from '@react-native-picker/picker'
import { SelectList } from 'react-native-dropdown-select-list'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import SelectDropdown from 'react-native-select-dropdown'
import { useDispatch, useSelector } from 'react-redux'
import { addAddress } from '../../redux/silces/Silces'
import { HEIGHT, PADDING_HORIZONTAL, PADDING_TOP, WIDTH } from '../../utilities/utility'

interface TinhThanh {
    code: string;
    name: string;
}

const renderItem = ({ item }: any): React.JSX.Element => {
    const { id, name } = item;

    return <View>
        <Text style={styles.txtTitle}>{item.name}</Text>
        <View style={styles.input}>
            <TextInput style={styles.txtInput} />
        </View>
    </View>
};

const Add_Address = (props: any) => {

    const user = useSelector((state: any) => {
        return state.SlicesReducer.user;
    });
    const listAddress = useSelector((state: any) => {
        return state.SlicesReducer.user.address;
    });

    const { setModalVisible } = props.action;
    const dispatch = useDispatch();

    const [tinhThanhs, setTinhThanhs] = useState<TinhThanh[]>([]);

    // State để lưu trữ danh sách Quận/Huyện
    const [quans, setQuans] = useState<TinhThanh[]>([]);

    // State để lưu trữ danh sách Phường/Xã
    const [phuongs, setPhuongs] = useState<TinhThanh[]>([]);

    // State để lưu trữ Tỉnh/Thành phố được chọn
    const [tinhThanhSelected, setTinhThanhSelected] = useState<string>('');
    const [tenTinhThanhSelected, setTenTinhThanhSelected] = useState<string>('');

    // State để lưu trữ Quận/Huyện được chọn
    const [quanSelected, setQuanSelected] = useState<string>('');
    const [tenQuanSelected, setTenQuanSelected] = useState<string>('');

    // State để lưu trữ Phường/Xã được chọn
    const [phuongSelected, setPhuongSelected] = useState<string>('');
    const [tenPhuongSelected, setTenPhuongSelected] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const handleAddAddress = async () => {
        if (!tinhThanhSelected) {
            Alert.alert('Vui lòng chọn Tỉnh/Thành phố.');
        } else if (!tenQuanSelected) {
            Alert.alert('Vui lòng chọn Quận/Huyện.');
        } else if (!tenPhuongSelected) {
            Alert.alert('Vui lòng chọn Phường/xã.');
        }
        else if (!street) {
            Alert.alert('Vui lòng nhập địa chỉ.');
        } else {
            const response = await AxiosInstance().post(`users/updateAddressUser`, {
                _idUser: user._idUser,
                typeUpdate: 'insert',
                city: tenTinhThanhSelected,
                district: tenQuanSelected,
                ward: tenPhuongSelected,
                street: street
            });
            dispatch(addAddress({
                position: listAddress.length + 1,
                city: tenTinhThanhSelected,
                district: tenQuanSelected,
                ward: tenPhuongSelected,
                street: street
            }));
            setModalVisible(false);
        }
    }
    useEffect(() => {
        const layDuLieu = async () => {
            try {
                // Gọi API để lấy danh sách Tỉnh/Thành phố với mức độ chi tiết là 1
                const response = await AxiosInstance().get('https://provinces.open-api.vn/api/?depth=1');
                const data = response.data.map((item: any) => {
                    return { key: item.code + ' ' + item.name, value: item.name }
                })
                setTinhThanhs(data);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu Tỉnh/Thành phố:', error);
            }
        };

        layDuLieu();
    }, []);

    // useEffect sẽ chạy khi Tỉnh/Thành phố được chọn để lấy danh sách Quận/Huyện
    useEffect(() => {
        if (tinhThanhSelected) {
            const layQuanHuyen = async () => {
                try {
                    // Gọi API để lấy danh sách Quận/Huyện của Tỉnh/Thành phố đã chọn với mức độ chi tiết là 2
                    const response = await AxiosInstance().get(`https://provinces.open-api.vn/api/p/${tinhThanhSelected}?depth=2`);

                    const data = response.data.districts.map((item: any) => {
                        return { key: item.code + ' ' + item.name, value: item.name }
                    })

                    setQuans(data);
                } catch (error) {
                    console.error('Lỗi khi tải dữ liệu Quận/Huyện:', error);
                }
            };
            layQuanHuyen();
        }
    }, [tinhThanhSelected]);

    // useEffect sẽ chạy khi Quận/Huyện được chọn để lấy danh sách Phường/Xã
    useEffect(() => {
        if (quanSelected) {
            const layPhuongXa = async () => {
                try {
                    // Gọi API để lấy danh sách Phường/Xã của Quận/Huyện đã chọn với mức độ chi tiết là 2
                    const response = await AxiosInstance().get(`https://provinces.open-api.vn/api/d/${quanSelected}?depth=2`);
                    const data = response.data.wards.map((item: any) => {
                        return { key: item.code + ' ' + item.name, value: item.name }
                    })
                    setPhuongs(data);
                } catch (error) {
                    console.error('Lỗi khi tải dữ liệu Phường/Xã:', error);
                }
            };

            layPhuongXa();
        }
    }, [quanSelected]);
    useEffect(() => {
        if (tinhThanhSelected && quanSelected && phuongSelected) {
            // Kết quả sẽ được cập nhật khi cả ba mức độ đều đã được chọn
            console.log(`Địa chỉ: ${tenTinhThanhSelected} | ${tenQuanSelected} | ${tenPhuongSelected}`);
        }
    }, [tinhThanhSelected, quanSelected, phuongSelected]);

    return (
        <View style={styles.container}>
            <Header title='Thêm Địa Chỉ' hideBack />
            <View style={styles.line}></View>
            <Text style={styles.txtTitle}>Tỉnh</Text>
            <SelectList
                setSelected={(e: any) => {
                    const array = e.split(' ');
                    const code = array[0];
                    const name = array.slice(1).join(' ');
                    setTinhThanhSelected(code);
                    setTenTinhThanhSelected(name);
                }}
                save='key'
                data={tinhThanhs || null}
                placeholder='Chọn Tỉnh/Thành phố'
                boxStyles={{ borderRadius: 5 }}
                dropdownTextStyles={styles.txtInput}
                inputStyles={styles.txtInputSelect}
            />
            <Text style={styles.txtTitle}>Thành phố</Text>
            <SelectList
                setSelected={(e: any) => {
                    const array = e.split(' ');
                    const code = array[0];
                    const name = array.slice(1).join(' ');
                    setQuanSelected(code);
                    setTenQuanSelected(name);
                }}
                data={quans || null}
                save="key"
                placeholder='Quận/Huyện/Thành Phố'
                boxStyles={{ borderRadius: 5 }}
                dropdownTextStyles={styles.txtInput}
                inputStyles={styles.txtInputSelect}
            />
            <Text style={styles.txtTitle}>Phường/Xã</Text>
            <SelectList
                setSelected={(e: any) => {
                    const array = e.split(' ');
                    const code = array[0];
                    const name = array.slice(1).join(' ');
                    setPhuongSelected(code);
                    setTenPhuongSelected(name);
                }}
                data={phuongs || null}
                save="key"
                placeholder='Phường/Xã'
                boxStyles={{ borderRadius: 5 }}
                dropdownTextStyles={styles.txtInput}
                inputStyles={styles.txtInputSelect}
            />
            <Text style={styles.txtTitle}>Địa chỉ</Text>
            <View style={styles.input}>
                <TextInput style={styles.txtInput} placeholder='Đường' onChangeText={setStreet} />
            </View>
            <Pressable style={{ position: 'absolute', bottom: 20, width: '100%', alignSelf: 'center' }} onPress={handleAddAddress}>
                <Button title='Thêm Địa Chỉ' />
            </Pressable>
        </View>
    )
}

export default Add_Address

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: "#9098B1",
        borderRadius: 5,
        marginTop: 5
    },
    txtInputSelect: {
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 21.60,
        letterSpacing: 0.50,
    },
    txtInput: {
        color: '#9098B1',
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 21.60,
        letterSpacing: 0.50,
        marginLeft: 15,
    },

    txtTitle: {
        color: '#223263',
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 21,
        letterSpacing: 0.50,
        paddingVertical: 10,
    },

    line: {
        height: 0.5,
        backgroundColor: '#ADA8A8',
        width: '120%',
        marginTop: 20,
        position: 'relative',
        right: 20
    },
    container: {
        height: HEIGHT * 0.8,
        width: WIDTH,
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingTop: PADDING_TOP,
    }
})

