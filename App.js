import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import * as SecureStore from 'expo-secure-store';

import NewNoteScreen from './components/NewNoteScreen';
import NotesScreen from "./components/NotesScreen";
import EditNoteScreen from './components/EditNoteScreen'
import NewCategoryScreen from './components/NewCategoryScreen';
import PreferencesScreen from './components/PreferencesScreen';
import { Alert, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import opachki from "./components/opachki_gfx.jpg";
import Pencil from "./components/pencil.png";
import Img0 from "./components/notes.png";
import Img1 from "./components/new.png";
import Img2 from "./components/newCategory.png";
import Img3 from "./components/info.png";
import Img4 from "./components/kebab.png";


const Drawer = createDrawerNavigator();


const icons = {
  "opachki": opachki,
  "pencil": Pencil,
  "notatki": Img0,
  "dodaj": Img1,
  "dodajKategorie": Img2,
  "info": Img3,
  "kebab": Img4
};

// MGMT lol
const LittleDarkTheme = {
  dark: true,
  colors: {
    primary: 'rgb(245, 219, 90)', // yellow yay!
    background: '#202124', // dark theme chrome ¯\_(ツ)_/¯
    card: '#202124',
    // card: 'rgb(245, 219, 90)',
    text: 'whitesmoke',
    border: 'rgb(28, 28, 30)',
    notification: 'rgb(255, 69, 58)',
  }
};


class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  async saveItem(key, value){
    // console.log( "key: %s, value: %s", key, value );
    await SecureStore.setItemAsync(key, value);
    // console.log("davai mochi")
  }
  
  async getItem(key){
    return await SecureStore.getItemAsync(key);
  }
  
  async deleteItem(key){
     await SecureStore.deleteItemAsync(key);
  }


  CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image source={icons.pencil} style={{ width: 112, height: 112, marginVertical: 30 }} />
            </View>
  
            {/*<DrawerItemList {...props} />*/}
  
            <DrawerItem
                label="Notatki"
                icon={() => <Image source={ icons.notatki } style={ss.drawerIconStyle} />}
                onPress={() => props.navigation.navigate( "Notatki" )}
            />

            <DrawerItem
                label="Dodaj notatkę"
                icon={() => <Image source={ icons.dodaj } style={ss.drawerIconStyle} />}
                onPress={() => props.navigation.navigate( "Dodaj notatkę" )}
            />

            <DrawerItem
                label="Dodaj kategorię"
                icon={() => <Image source={ icons.dodajKategorie } style={ss.drawerIconStyle} />}
                onPress={() => props.navigation.navigate( "Dodaj kategorię" )}
            />

            <DrawerItem
                label="Info"
                icon={() => <Image source={ icons.info } style={ss.drawerIconStyle} />}
                onPress={() => Alert.alert("Informacje", "Notatnik ver 2.0.0", [ { text: "OK" } ])}
            />
            
        </DrawerContentScrollView>
    );
  }

  render()
  {
    return (
      <NavigationContainer theme={LittleDarkTheme}>
        <Drawer.Navigator screenOptions={ ({navigation})=>({
          headerRight: ()=>{
            return (<TouchableOpacity style={ss.kebab} onPress={ ()=> navigation.navigate( "Preferencje" ) }>
              <Image source={icons.kebab} style={{
                flex: 1, aspectRatio: 1
              }}/>
            </TouchableOpacity>)
          }
        }) }
        drawerContent={(props) => this.CustomDrawerContent({...props}) } >
          
          <Drawer.Screen name="Notatki" options={{
            drawerIcon: ({ focused, size }) => (
              <Image source={ icons.notatki } style={ss.drawerIconStyle} />
            ),
            headerStyle: { backgroundColor: "rgb(245, 219, 90)" },
            headerTitleStyle: { color: "rgb(28, 28, 30)" },
          }} 
          component={NotesScreen} />
  
          <Drawer.Screen name="Dodaj notatkę" options={{
            drawerIcon: ({ focused, size }) => (
              <Image source={ icons.dodaj } style={ss.drawerIconStyle} />
            ),
            headerStyle: { backgroundColor: "rgb(255, 170, 50)" },
            headerTitleStyle: { color: "rgb(28, 28, 30)" }
          }} 
          component={NewNoteScreen} />

          <Drawer.Screen name="Dodaj kategorię" options={{
            drawerIcon: ({ focused, size }) => (
              <Image source={ icons.dodaj } style={ss.drawerIconStyle} />
            ),
            headerStyle: { backgroundColor: "rgb(255, 120, 20)" },
            headerTitleStyle: { color: "rgb(28, 28, 30)" }
          }} 
          component={NewCategoryScreen} />  


          <Drawer.Screen name="Edytuj notatkę" options={{
            headerStyle: { backgroundColor: "#92ed7b" },
            headerTitleStyle: { color: "rgb(28, 28, 30)" }
          }} 
          component={EditNoteScreen} />



          <Drawer.Screen name="Preferencje" options={{
            headerStyle: { backgroundColor: "#92ed7b" },
            headerTitleStyle: { color: "rgb(28, 28, 30)" }
          }} 
          component={PreferencesScreen} />

  
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
}


const ss = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerIconStyle: {
    height: 40,
    width: 40
  },
  kebab:
  {
    height: "100%",
    aspectRatio: 1
  }
});


export default App;