import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, LogBox } from 'react-native';
import PropTypes from "prop-types";
import { TouchableOpacity } from 'react-native-gesture-handler';

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
        date: new Date( parseInt(this.props.id) )
    };

    this.selfDestruct = this.selfDestruct.bind(this);
    this.selfDestructAlert = this.selfDestructAlert.bind(this);
    this.getSelfObject = this.getSelfObject.bind(this);
  }

  async selfDestruct()
  {
    await this.props.deleteSelf( this.props.id );
  }

  selfDestructAlert()
  {
    Alert.alert(
      "Are you sure?",
      "Do you want to delete this note permanently?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: this.selfDestruct
        }
      ]
    );
  }

  getMonthName(date)
  {
    const months = [
        "Sty", "Luty", "Mar", "Kwi", "Maj", "Czer", "Lip", "Sier", "Wrz", "Paź", "List", "Gru"
    ];
    return months[ date.getMonth() ];
  }

  getSelfObject()
  {
    return (
      {
        id: this.props.id,
        title: this.props.title,
        text: this.props.text,
        colour: this.props.colour,
        category: this.props.category
      }
    )
  }

  render() {
    return (
      <TouchableOpacity style={ss.touch} onPress={ ()=> this.props.toEditing( this.getSelfObject() ) } onLongPress={ this.selfDestructAlert } >
        <View style={{ ...ss.note, backgroundColor: this.props.colour }}>
          <View style={ss.category}>
              <Text style={{color: this.props.colour, fontSize: this.props.textSize-2, fontWeight: "bold"}}>{ this.props.category.toUpperCase() }</Text>
          </View>
          <Text style={{ alignSelf: "flex-end" }}>{ this.state.date.getDate() } { this.getMonthName( this.state.date ).toUpperCase() }</Text>
          <Text style={{ width: "100%", fontSize: this.props.textSize }}>{ this.props.title }</Text>
          <Text style={{ width: "100%" }}>{ this.props.text }</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

Note.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    textSize: PropTypes.number.isRequired,
    colour: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    deleteSelf: PropTypes.func.isRequired
}


const ss = StyleSheet.create(
    {
        note:
        {
            flex: 1,
            // justifyContent: 'center',
            alignItems: 'center',
            // flexGrow: 0,
            // flexBasis: '45%',
            aspectRatio: 1,
            width: "90%",

            margin: 10,
            borderRadius: 12,
            padding: 20
        },
        touch:
        {
          width: Dimensions.get("screen").width / 2,
          alignItems: "center"
        },
        category:
        {
          backgroundColor: '#323338',
          padding: 12,
          borderRadius: 10,
          alignSelf: "flex-start"
        }

    }
);


export default Note;
