import { StyleSheet, Text, View, TextInput, FlatList, ScrollView } from 'react-native'
import React from 'react'
import Header from '../../component/Header/Header'
import Button from '../../component/Button/Button'
import { SelectList } from 'react-native-dropdown-select-list'
import { PropsAccount } from '../../component/Navigation/Props'

interface Add {
    id: number;
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

const Edit_Address = ({ navigation }: PropsAccount) => {
    const provine = [
        { key: '1', value: 'Tp.HCM' },
        { key: '2', value: 'tỉnh Đồng Tháp' },
        { key: '3', value: 'tỉnh Lâm Đồng' },
    ]

    const city = [
        { key: '1', value: 'TP.Cao Lãnh' },
        { key: '2', value: 'TP.Đà Lạt' },
        { key: '3', value: 'TP.Cần Thơ' },
    ]

    const [selected, setSelected] = React.useState("");

    return (
        <View style={styles.container}>
            <Header title='Edit Address'  navigation={navigation}/>
            <View style={styles.line}></View>

                <Text style={styles.txtTitle}>Provine</Text>
                <SelectList
                    setSelected={setSelected}
                    data={provine}
                    save="value"
                    placeholder='tỉnh Đồng Tháp'
                    defaultOption={{ key: 1, value: 'tỉnh Đồng Tháp' }}
                    boxStyles={{ borderRadius: 5 }}
                />

                <Text style={styles.txtTitle}>City</Text>
                <SelectList
                    setSelected={setSelected}
                    data={city}
                    save="value"
                    placeholder='TP.Cao Lãnh'
                    defaultOption={{ key: 1, value: 'TP.Cao Lãnh' }}
                    boxStyles={{ borderRadius: 5 }}
                />

                <FlatList
                    scrollEnabled={false}
                    data={Data}
                    renderItem={renderItem}
                />

                <View style={{ paddingTop: 30 }}>
                    <Button title='Save Address' />
                </View>
        </View>
    )
}

export default Edit_Address

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: "#9098B1",
        borderRadius: 5,
    },

    txtInput: {
        color: '#9098B1',
        fontSize: 12,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 21.60,
        letterSpacing: 0.50,
        marginLeft: 15,
    },

    txtTitle: {
        color: '#223263',
        fontSize: 14,
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
        width: '100%',
        paddingTop: 20,
        paddingHorizontal: 20
    }
})

const Data: Add[] = [
    {
        id: 1,
        name: 'Street Address'
    },
    {
        id: 2,
        name: 'Street Address 2 (Optional)'
    },
    {
        id: 5,
        name: 'Phone Number'
    },
]