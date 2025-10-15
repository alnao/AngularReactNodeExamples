import {Stack} from "expo-router";

export default function SettingsLayout() {
    return <Stack screenOptions={{contentStyle:{backgroundColor:'white'}}}>
        <Stack.Screen name="settings" options={{title:'Settingsss',headerLargeTitle:true}}/>
    </Stack>;
}
