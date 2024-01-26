import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BG_COLOR } from '../../utilities/utility';

const TimeCountDown = ({ item }: any) => {
    const [hideCountDown, setHideCountDown] = useState<boolean>(false);
    const [day, setDay] = useState<number>(21);
    const [hour, setHour] = useState<number>(12);
    const [minute, setMinute] = useState<number>(21);
    const [seconds, setSeconds] = useState<number>(21);
    let endDate = new Date(item.soNgayGiamgia).getTime();
    useEffect(() => {
        console.log('render');
        let setTimeCountDown = setInterval(function () {
            let now = new Date().getTime();
            let distance = endDate - now;
            let day = Math.floor(distance / (24 * 60 * 60 * 1000));
            let hour = Math.floor((distance % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            let minute = Math.floor((distance % (60 * 60 * 1000)) / (60 * 1000));
            let seconds = Math.floor((distance % (60 * 1000)) / 1000);
            setDay(day);
            setHour(hour)
            setMinute(minute);
            setSeconds(seconds);
            if (distance <= 0) {
                clearInterval(setTimeCountDown);
                setHideCountDown(true);
            }
            return () => clearInterval(setTimeCountDown);
        }, 1000);
    }, []);
    return (
        <View style={{ backgroundColor: BG_COLOR }}>
            {!hideCountDown ?
                <View style={{ flexDirection: 'row', gap: 5, marginTop: 10, marginBottom: 10 }}>
                    <View style={styles.timeCountDown}>
                        <Text style={styles.textTimeCountDown}>{(day < 10) ? '0' + day : day}</Text>
                    </View>
                    <Text style={styles.spaceViewTimeCountDown}>:</Text>
                    <View style={styles.timeCountDown}><Text style={styles.textTimeCountDown}>{(hour < 10) ? '0' + hour : hour}</Text></View>
                    <Text style={styles.spaceViewTimeCountDown}>:</Text>
                    <View style={styles.timeCountDown}><Text style={styles.textTimeCountDown}>{(minute < 10) ? '0' + minute : minute}</Text></View>
                    <Text style={styles.spaceViewTimeCountDown}>:</Text>
                    <View style={styles.timeCountDown}><Text style={styles.textTimeCountDown}>{(seconds < 10) ? '0' + seconds : seconds}</Text></View>
                    <Text style={styles.textUpto}>Sale {item.levelGiamgia}% </Text>
                </View> : <></>}
        </View>
    )
}

export default TimeCountDown

const styles = StyleSheet.create({
    textUpto: {
        color: '#223263',
        fontSize: 22,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 24,
        letterSpacing: 0.50,
        alignSelf: 'center',
        marginLeft: 10
    },
    spaceViewTimeCountDown: {
        alignSelf: 'center',
        color: '#223263',
        fontSize: 20,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 21,
        letterSpacing: 0.07
    },
    textTimeCountDown: {
        color: '#223263',
        fontSize: 20,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 24,
        letterSpacing: 0.50,
    },
    timeCountDown: {
        width: 40,
        height: 40,
        backgroundColor: '#4464C4',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
})