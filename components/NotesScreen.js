import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Dimensions } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Note from './Note';

class NotesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: [],
      notes: [],
      notesComponents: [],
      preferences: { textSize: 12, order: "ASC" }
    };
    this._idk = null;

    this.setIds = this.setIds.bind(this);
    this.setStuff = this.setStuff.bind(this);
    this.updateIds = this.updateIds.bind(this);
    this.setNotes = this.setNotes.bind(this);
    this.setNotesComponents = this.getNoteComponent.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.removeId = this.removeId.bind(this);
    this.goToEditing = this.goToEditing.bind(this);
    this.searchNotes = this.searchNotes.bind(this);
    this.setPreferences = this.setPreferences.bind(this);
  }

  componentDidMount = async ()=>
  {
    this._idk = this.props.navigation.addListener('focus', async () => {
      await this.setPreferences();
      await this.setStuff();
    });
    await this.setPreferences();
    await this.setStuff();
  }

  componentWillUnmount() {
    this._idk();
  }


  async setStuff()
  {
    await this.setIds();
    await this.setNotes();
    // await this.setCategories();
  }
  
  async setIds()
  {
    let arr = JSON.parse( await this.getItem( "ids" ) );
    if( arr )
    {
      arr.sort();
      this.setState({
        ids: this.state.preferences.order == "ASC" ? [...arr] : [...arr.reverse()]
      });
    }
  }

  async searchNotes( needle )
  {
    await this.setNotes();
    if( needle.length < 1 )
      return;
    else
      needle = needle.toLowerCase();

    const arr = this.state.notes.filter( ( note )=>{
      if( note.title.toLowerCase().includes( needle ) || note.text.toLowerCase().includes( needle ) || note.category.toLowerCase().includes( needle ) )
        return true;
    } );

    this.setState(
      {
        notes: [...arr]
      }
    );
  }

  
  updateIds()
  {
    this.saveItem( "ids", JSON.stringify( this.state.ids ) );
  }

  removeId( id )
  {
    let arr = this.state.ids.filter(
      (el) => {
        return !(el == id);
      }
    );

    this.setState(
      {
        ids: [...arr]
      }
    );
  }
  
  async setNotes()
  {
    let tmp = await Promise.all(
        this.state.ids.map(async (key) => {
        const data = await this.getItem(key);
        let note = JSON.parse(data);
        if (!note)
          return;
    
        return {...note};
      })
    );
    
    this.setState(
      {
        notes: [...tmp]
      },
    );
  
  }

  async setPreferences()
  {
    let prefs = {...this.state.preferences};
    const raw = await this.getItem("preferences");
    if( raw )
    {
      prefs = JSON.parse(raw);
    }

    this.setState( { preferences: {...prefs} } )
  }


  getNoteComponent(noteObj)
  {
    if( !noteObj )
      return;

    noteObj = noteObj.item;
    return <Note id={noteObj.id} textSize={this.state.preferences.textSize} deleteSelf={ this.removeNote } toEditing={ this.goToEditing } title={noteObj.title} text={noteObj.text} category={noteObj.category} colour={noteObj.colour} />
  }

  async removeNote( id )
  {
    await this.deleteItem( id );
    this.removeId( id );
    this.updateIds();
    await this.setNotes();
  }


  goToEditing( noteObj )
  {
    this.props.navigation.navigate( "Edytuj notatkę", { noteObj: noteObj } )
  }
  

  async saveItem(key, value){
    await SecureStore.setItemAsync(key, value);
  }
  
  async getItem(key){
    return await SecureStore.getItemAsync(key);
  }
  
  async deleteItem(key){
    console.log("deleting '%s'", key);
     await SecureStore.deleteItemAsync(key);
  }


  render() {
    return (
      <View style={ss.main}>
        <TextInput style={ss.searchBar}
          onChangeText={ (text) => this.searchNotes( text ) }
        />
        <FlatList style={ss.row}
         numColumns={2} data={ [...this.state.notes] } 

          renderItem={ (item) => this.getNoteComponent(item) }
          keyExtractor={(item)=>{
            return(item.id.toString());
          }}
         />
      </View>
    );
  }
}

const ss = StyleSheet.create(
    {
        main:
        {
            flex: 1,
            alignItems: "center"
        },
        row: {
          // flex: 1,
          // justifyContent: 'space-around',
          width: "100%",
        },
        searchBar:
        {
          width: "90%",
          height: 50,
          backgroundColor: "#323338",
          borderRadius: 12,
          margin: 5,
          padding: 5,
          fontSize: 16,
          color: "whitesmoke"
        }
    }
);



export default NotesScreen;
