import { Picker } from '@react-native-picker/picker';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

class PreferencesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        textSize: 12,
        order: "ASC"
    };
    this._idk = null;

    this.savePreferences = this.savePreferences.bind(this);
    this.setPrefs = this.setPrefs.bind(this);
  }

  componentDidMount = async ()=>
  {
    this._idk = this.props.navigation.addListener('focus', async () => {
        // console.log( this.props.navigation )
      await this.getSavedPrefs();
    });
    await this.getSavedPrefs();    
  }

  componentWillUnmount() {
    this._idk();
  }


  async savePreferences( ts, o )
  {
    await this.setPrefs(ts, o);

    this.saveItem( "preferences", JSON.stringify({...this.state}) );
  }

  async setPrefs( ts, o )
  {
    this.setState({
        textSize: ts,
        order: o
    });
  }

  async getSavedPrefs()
  {
    let prefs = {...this.state};
    const raw = await this.getItem("preferences");
    if( raw )
    {
      prefs = JSON.parse(raw);
    }
    this.setState({
        textSize: prefs.textSize,
        order: prefs.order
    });
  }

  async saveItem(key, value){
    await SecureStore.setItemAsync(key, value);
  }

  async getItem(key){
    return await SecureStore.getItemAsync(key);
  }

  render() {
    return (
      <View style={ss.main}>
        <View style={{width: "80%"}}>
            <Text style={ss.label}>Rozmiar czcionki notatek:</Text>
            <Picker style={{ color: "whitesmoke", backgroundColor: "#343434"}}
                selectedValue={this.state.textSize} onValueChange={(val)=>{ this.savePreferences( val, this.state.order ) }}
            >
                <Picker.Item style={{ fontSize: this.state.textSize }} label="Mała czcionka" value={12} />
                <Picker.Item style={{ fontSize: this.state.textSize }} label="Średnia czcionka" value={16} />
                <Picker.Item style={{ fontSize: this.state.textSize }} label="Duża czcionka" value={20} />
            </Picker>

            <Text style={ss.label}>Kolejność sortowania notatek według daty:</Text>
            <Picker style={{ color: "whitesmoke", backgroundColor: "#343434"}}
                selectedValue={this.state.order} onValueChange={(val)=>{ this.savePreferences( this.state.textSize, val ) }}
            >
                <Picker.Item style={{ fontSize: 16 }} label="Od najstarszych" value="ASC" />
                <Picker.Item style={{ fontSize: 16 }} label="Od najnowszych" value="DESC" />
            </Picker>
            
        </View>
        <TouchableOpacity onPress={ ()=> this.props.navigation.goBack() }>
            <View>
              <Text style={ss.button}>POWRÓT</Text>
            </View>
          </TouchableOpacity>
      </View>
    );
  }
}


const ss = StyleSheet.create({
    main: {
      flex: 1,
      alignItems: 'center',
      justifyContent: "center"
    },
    label: {
        color: "whitesmoke",
        fontSize: 20
    },
    button:{
        color: "whitesmoke",
      fontWeight: "bold",
      fontSize: 30,
      paddingTop: "10%"
    }

  });

export default PreferencesScreen;
