import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';




import { COLORS, ROUTES } from '../../constants';
import { NavigatorScreenParams } from '@react-navigation/native';
import { RootStackParamListExplore } from '../../Root/RootStackExplore';
import { RootStackParamListHome } from '../../Root/RootStackHome';
import { RootStackParamListCart } from '../../Root/RootStackCart';
import { RootStackParamListOffer } from '../../Root/RootStackOffer';
import { RootStackParamListAccount } from '../../Root/RootStackAccount';
import HomeNavigation from '../../Navigation/HomeNavigation';
import ExploreNavigation from '../../Navigation/ExploreNavigation';
import CartNavigation from '../../Navigation/CartNavigation';
import OfferNavigation from '../../Navigation/OfferNavigation';
import AccountNavigation from '../../Navigation/AccountNavigation';
import { Badge } from '@ant-design/react-native';
import React from 'react';
import { useSelector } from 'react-redux';

export enum RootTabScreenENum {
    StackHome = 'Home',
    StackExplore = 'Explore',
    StackCart = 'Cart',
    StackOffer = 'Offer',
    StackAccount = 'Account',
};

export type RootTabParamList = {
    StackHome: NavigatorScreenParams<RootStackParamListHome>,
    StackExplore: NavigatorScreenParams<RootStackParamListExplore>,
    StackCart: NavigatorScreenParams<RootStackParamListCart>,
    StackOffer: NavigatorScreenParams<RootStackParamListOffer>,
    StackAccount: NavigatorScreenParams<RootStackParamListAccount>,
};

export const RootBottomTab = () => {

    const Screens: any[] = [
        { id: 1, name: RootTabScreenENum.StackHome, component: HomeNavigation, option: {} },
        { id: 2, name: RootTabScreenENum.StackExplore, component: ExploreNavigation, option: {} },
        { id: 3, name: RootTabScreenENum.StackCart, component: CartNavigation, option: {} },
        { id: 4, name: RootTabScreenENum.StackOffer, component: OfferNavigation, option: {} },
        { id: 5, name: RootTabScreenENum.StackAccount, component: AccountNavigation, option: {} },

    ]
    return Screens;
}
export const configTab = (route: any) => {
    const data = useSelector((state: any) => {
        return state.SlicesReducer.user.cartItem;
    });
    return {
        tabBarIcon: ({ color, focused }: any) => {
            let iconName: any;
            if (route.name === ROUTES.HOME) {
                iconName = focused ? 'home-sharp' : 'home-outline';
            } else if (route.name === ROUTES.EXPLORE) {
                iconName = focused ? 'search-sharp' : 'search-outline';
            } else if (route.name === ROUTES.CART) {
                iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === ROUTES.OFFER) {
                iconName = focused ? 'ticket' : 'ticket-outline';
            } else if (route.name === ROUTES.ACCOUNT) {
                iconName = focused ? 'person' : 'person-outline';
            }
            return route.name === ROUTES.CART && data.length > 0 ?
                <Badge dot>
                    <Icon name={iconName} size={22} color={color} />
                </Badge> :
                <Icon name={iconName} size={22} color={color} />

        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: COLORS.dark,
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: COLORS.primary,
    }
}
const styles = StyleSheet.create({
    tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 55,
    }
});
