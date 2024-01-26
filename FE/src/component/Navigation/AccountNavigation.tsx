
import React from 'react';
import { configStack } from '../Root/RootStack';
import { RootStackScreenAccount } from '../Root/RootStackAccount';
import { Stack } from './Props';




const AccountNavigation = () => {

    return <Stack.Navigator initialRouteName='LoginScreen' screenOptions={({ route }) => configStack(route)}>
        {RootStackScreenAccount().map((item: any) => {
            return <Stack.Screen key={item.id} name={item.name} component={item.component} options={item.options} />
        })}
    </Stack.Navigator>
}


export default AccountNavigation
