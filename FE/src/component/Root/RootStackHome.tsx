
import { uid } from 'uid';


import HomeScreen from '../../screens/Home/HomeScreen';
import NotificationScreen from '../../screens/Home/Notification';
import ActivityScreen from '../../screens/Home/Activity';
import OfferNorifiScreen from '../../screens/Home/Offer';
import { Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { JSX } from 'react';
import React from 'react';
import { FadeHomeScreen } from '../BottomNavigation/AniScreenBottomTab';

export enum RootStackScreenEnumHome {
    HomeScreen = 'HomeScreen',
    NotificationScreen = 'NotificationScreen',
    ActivityScreen = 'ActivityScreen',
    OfferNorifiScreen = 'OfferNorifiScreen',
}

export type RootStackParamListHome = {
    HomeScreen: undefined,
    FavoriteScreen: undefined,
    NotificationScreen: undefined,
    ActivityScreen: undefined,
    OfferNorifiScreen: undefined,
}


export const RootStackScreenHome = () => {
    const Screen: any = [
        { id: uid(), name: RootStackScreenEnumHome.HomeScreen, component: FadeHomeScreen, options: {} },
        { id: uid(), name: RootStackScreenEnumHome.NotificationScreen, component: NotificationScreen, options: {} },
        { id: uid(), name: RootStackScreenEnumHome.ActivityScreen, component: ActivityScreen, options: {} },
        { id: uid(), name: RootStackScreenEnumHome.OfferNorifiScreen, component: OfferNorifiScreen, options: {} },
    ]
    return Screen;
}
