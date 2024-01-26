import React from 'react';
import { configStack } from '../Root/RootStack';
import { RootStackScreenCart } from '../Root/RootStackCart';
import { Stack } from './Props';




const CartNavigation = () => {

    return <Stack.Navigator initialRouteName='CartScreen' screenOptions={({ route }) => configStack(route)}>
        {RootStackScreenCart().map((item: any) => {
            return <Stack.Screen key={item.id} name={item.name} component={item.component} options={item.options} />
        })}
    </Stack.Navigator>
}


export default CartNavigation
