import { Colors } from "@/app-example/constants/theme";
import { Stack } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function RootLayout() {
  return <NativeTabs tintColor={Colors.dark.tint} blurEffect="systemChromeMaterial" >
    <NativeTabs.Trigger name="home"  >
      <Label>Homee</Label>
      <Icon 
      sf={{default:'house',selected:'house.fill'}} drawable="home_drawable"/>  
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="save" >
      <Label>Savee</Label>
      <Icon  sf={{default:'heart',selected:'heart.fill'}} drawable="save_drawable"/>  
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="settings" >
      <Label>Settingss</Label>
      <Icon  sf={{default:'gearshape',selected:'gearshape.fill'}} drawable="settings_drawable"/>  
    </NativeTabs.Trigger>
  </NativeTabs>;
}
 