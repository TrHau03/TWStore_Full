import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Spinner from 'react-native-loading-spinner-overlay'
import { useSelector } from 'react-redux';

const Loading = () => {
    const loading = useSelector((state: any) => state.SlicesReducer.isLoading);

    return (
        <View>
            <Spinner
                visible={loading}
                textContent={''}
            />
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({})