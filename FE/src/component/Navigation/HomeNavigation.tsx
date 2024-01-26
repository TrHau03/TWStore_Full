
import { configStack } from '../Root/RootStack';
import { RootStackScreenHome } from '../Root/RootStackHome';
import { Stack } from './Props';
import React from 'react';


const HomeNavigation = () => {

    return <Stack.Navigator initialRouteName='HomeScreen' screenOptions={(props) => configStack(props)} >
        {RootStackScreenHome().map((item: any) => {
            return <Stack.Screen key={item.id} name={item.name} component={item.component} options={item.options} />
        })}
    </Stack.Navigator>
}


export default HomeNavigation
