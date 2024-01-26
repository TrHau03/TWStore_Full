import { createStackNavigator } from '@react-navigation/stack';
import { Stack } from './Props';
import { RootStackScreenSlide } from '../Root/RootStackLogin';
import { configStack } from '../Root/RootStack';
import * as React from 'react';




const SlideNavigation = () => {
    return <Stack.Navigator initialRouteName='SlideScreen' screenOptions={({ route }) => configStack(route)}>
        {RootStackScreenSlide().map((item: any) => {
            return <Stack.Screen key={item.id} name={item.name} component={item.component} options={item.options} />
        })}
    </Stack.Navigator>
}


export default SlideNavigation
