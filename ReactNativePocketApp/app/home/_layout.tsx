import {Stack} from "expo-router";

export default function HomeLayout() {
    return <Stack screenOptions={{contentStyle:{backgroundColor:'white'}}}>
        <Stack.Screen name="home" options={{title:'Homeee',headerLargeTitle:true}}/>
    </Stack>;
}
