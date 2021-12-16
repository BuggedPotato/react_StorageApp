import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';

class EditNoteScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            text: "",
            cats: [],
            selCat: ""
        };
        this._idk = null;

        this.setSelectedCategory = this.setSelectedCategory.bind(this);
        this.setCategories = this.setCategories.bind(this);
        this.setSelectedCategory = this.setSelectedCategory.bind(this);
        this.updateNote = this.updateNote.bind(this);
    }

    
    componentDidMount = async ()=>
    {
        this._idk = this.props.navigation.addListener('focus', async () => {
            await this.setCategories();
            this.setSelectedCategory( this.props.route.params.noteObj.category );
        });
        
    }

    componentWillUnmount() {
        this._idk();
    }

    async setCategories()
    {
        let str = await this.getItem( "categories" );
        if( str )
        this.setState(
            {
            cats: [ ...JSON.parse( str ) ],
            title: this.props.route.params.noteObj.title,
            text: this.props.route.params.noteObj.text,
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



    async updateNote( )
    {
        let noteObj = {...this.props.route.params.noteObj};
        noteObj.title = this.state.title;
        noteObj.text = this.state.text;
        noteObj.category = this.state.selCat;
      
        await this.saveItem( noteObj.id, JSON.stringify(noteObj) );
        this.props.navigation.navigate( "Notatki" );
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
                underlineColorAndroid="#92ed7b"
                defaultValue={ this.props.route.params.noteObj.title }
                placeholderTextColor="#5a5a5a"
                // value={this.state.title}
                onChangeText={(text) => { this.setState({
                    title: text
                }) }}
                style={ss.input}
            />
            <TextInput

                underlineColorAndroid="#92ed7b"
                defaultValue={ this.props.route.params.noteObj.text }
                placeholderTextColor="#5a5a5a"
                // value={this.state.text}
                multiline={true}
                onChangeText={(text) => { this.setState({
                    text: text
                }) }}
                style={ss.input}
            />
    
            <Picker style={{ color: "whitesmoke", fontSize: 18 }}
                selectedValue={ this.state.selCat }
                onValueChange={ this.setSelectedCategory }
                >
                    <Picker.Item label="AAA" value="a" />
                    <Picker.Item label="BBB" value="b" />
                    <Picker.Item label="CCC" value="c" />
                    {
                    this.state.cats.map( (cat, i)=>{
                        return (<Picker.Item key={i} label={cat} value={cat} />)
                    } )
                    }
            </Picker>
    
            </View>
            <TouchableOpacity onPress={this.updateNote}>
                <View>
                    <Text style={ss.button}>ZAPISZ</Text>
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


export default EditNoteScreen;
