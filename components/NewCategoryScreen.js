import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';


class NewCategoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name: ""
    };
    this.tbName = React.createRef();

    this.addCategory = this.addCategory.bind(this);
  }

  async addCategory()
  {
    if( this.state.name.length < 1 )
    {
        return;
    }

    let cats = [];
    let str = await this.getItem( "categories" );
    if( str )
        cats = [ ...JSON.parse( str ) ];
    cats.push( this.state.name );
    console.log( "cats:" );
    console.log( cats );

    this.setState({
        name: ""
    });

    await this.saveItem( "categories", JSON.stringify( cats ) );
    this.tbName.current.clear();
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
          <View style={{ width: "60%", paddingTop: "20%" }}>
            <TextInput
              ref={this.tbName}
              underlineColorAndroid="rgb(255, 120, 20)"
              placeholder="Nazwa"
              placeholderTextColor="#5a5a5a"
              onChangeText={(text) => { this.setState({
                name: text
              }) }}
              style={ss.input}
            />
          </View>
          <TouchableOpacity onPress={this.addCategory}>
            <View>
              <Text style={ss.button}>DODAJ</Text>
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
    },
    button: {
      color: "whitesmoke",
      fontWeight: "bold",
      fontSize: 30,
      paddingTop: "10%"
    },
    input: {
      fontSize: 24,
      padding: 10,
      color: "#eaeaea"
    }
  });

export default NewCategoryScreen;
