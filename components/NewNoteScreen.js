import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';

class NewNoteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      text: "",
      cats: [],
      selCat: ""
    };
    this._idk = null;
    this.tbTitle = React.createRef();
    this.tbText = React.createRef();

    this.newNoteObj = this.newNoteObj.bind(this);
    this.setCategories = this.setCategories.bind(this);
    this.setSelectedCategory = this.setSelectedCategory.bind(this);
  }


  componentDidMount = async ()=>
  {
    this._idk = this.props.navigation.addListener('focus', async () => {
      await this.setCategories();
      this.setSelectedCategory( this.state.cats[0] ? this.state.cats[0] : "Ogólne" );
    });
    
  }

  componentWillUnmount() {
    this._idk();
  }


  async newNoteObj(){
    if( this.state.text == "" || this.state.title == "" )
      return;
    

    const noteObj = {
      id: Date.now().toString(),
      colour: this.randomColour(),
      title: this.state.title,
      text: this.state.text,
      category: this.state.selCat
    }

    this.setState(
      {
        title: "",
        text: ""
      }
    );

    await this.saveItem( noteObj.id, JSON.stringify(noteObj) )

    let tmp = await this.getItem("ids");
    let idArr = [];
    if( tmp )
      idArr = [...JSON.parse(tmp)];
    idArr.push( noteObj.id );

    await this.saveItem( "ids", JSON.stringify( idArr ) );
    console.log( "saved ids" );
    
    this.tbTitle.current.clear();
    this.tbText.current.clear();

    this.props.navigation.navigate("Notatki");
  }

  randomColour()
  {
      // return '#' + Math.floor(Math.random() * 16777216).toString(16); // fully random colour
      let colours = [
        "#DAF7A6", "#FFC300", "#FF5733", "#F37770", "#858379"
      ];
      return colours[Math.round(Math.random() * ( colours.length-1 ))];;
  }


  async setCategories()
  {
    let str = await this.getItem( "categories" );
    if( str )
      this.setState(
        {
          cats: [ ...JSON.parse( str ) ]
        }
      );
  }

  setSelectedCategory( val )
  {
    this.setState(
      {
        selCat: val
      }
    );
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
            ref={this.tbTitle}
            underlineColorAndroid="rgb(255, 170, 50)"
            placeholder="Tytuł"
            placeholderTextColor="#5a5a5a"
            onChangeText={(text) => { this.setState({
              title: text
            }) }}
            style={ss.input}
          />
          <TextInput
            ref={this.tbText}
            underlineColorAndroid="rgb(255, 170, 50)"
            placeholder="Treść"
            placeholderTextColor="#5a5a5a"
            onChangeText={(text) => { this.setState({
              text: text
            }) }}
            style={ss.input}
          />

          <Picker style={{ color: "whitesmoke", backgroundColor: "#343434" }}
            selectedValue={ this.state.selCat }
            onValueChange={ this.setSelectedCategory }
            >
              <Picker.Item style={{fontSize: 18}} label="Ogólne" value="Ogólne" />
              {
                this.state.cats.map( (cat, i)=>{
                  return (<Picker.Item key={i} label={cat} value={cat} />)
                } )
              }
          </Picker>

        </View>
        <TouchableOpacity onPress={this.newNoteObj}>
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

export default NewNoteScreen;
