
import { uid } from 'uid';


import PaymentScreen from '../../screens/Account/PaymentScreen';
import CreditCardScreen from '../../screens/Account/CreditCardScreen';
import PaypalScreen from '../../screens/Account/PaypalScreen';
import BankTransferScreen from '../../screens/Account/BankTransferScreen';
import ProfileScreen from '../../screens/Account/Profile';
import { FadeAccountScreen } from '../BottomNavigation/AniScreenBottomTab';
import OrderScreen from '../../screens/Account/OrderScreen';
import Order_Detail from '../../screens/Account/Order_Detail';
import AddressScreen from '../../screens/Account/AddressScreen';
import Add_Address from '../../screens/Account/Add_Address';

export enum RootStackScreenEnumAccount {
    AccountScreen = 'AccountScreen',
    ProfileScreen = 'ProfileScreen',
    PaymentScreen = 'PaymentScreen',
    AddressScreen = 'AddressScreen',
    PaypalScreen = 'PaypalScreen',
    OrderScreen = 'OrderScreen',
    Order_Detail = 'Order_Detail',
    Add_Address = 'Add_Address'
}

export type RootStackParamListAccount = {
    AccountScreen: undefined,
    ProfileScreen: undefined,
    PaymentScreen: undefined,
    AddressScreen: undefined,
    PaypalScreen: undefined,
    OrderScreen: undefined,
    Order_Detail: undefined,
    Add_Address: undefined,
}


export const RootStackScreenAccount = () => {
    const Screen: any = [
        { id: uid(), name: RootStackScreenEnumAccount.AccountScreen, component: FadeAccountScreen, options: {} },
        { id: uid(), name: RootStackScreenEnumAccount.ProfileScreen, component: ProfileScreen, options: {} },
        { id: uid(), name: RootStackScreenEnumAccount.PaymentScreen, component: PaymentScreen, options: {} },
        { id: uid(), name: RootStackScreenEnumAccount.AddressScreen, component: AddressScreen, options: {} },
        { id: uid(), name: RootStackScreenEnumAccount.PaypalScreen, component: PaypalScreen, options: {} },
        { id: uid(), name: RootStackScreenEnumAccount.OrderScreen, component: OrderScreen, options: {} },
        { id: uid(), name: RootStackScreenEnumAccount.Order_Detail, component: Order_Detail, options: {} },
        { id: uid(), name: RootStackScreenEnumAccount.Add_Address, component: Add_Address, options: {} },


    ]
    return Screen;
}
