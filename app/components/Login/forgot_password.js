import React, { Component } from 'react';
import { Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { defaults } from '../../assets/styles/default_styles';
import { forgot_password_styles } from '../../assets/styles/forgot_password_styles';

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reset_entry: ''
    };
  }

  submitResetCredentials() {
    const {reset_entry} = this.state

    let is_numeric = parseInt(reset_entry)
    if (isNaN(is_numeric) != true) {
      if (reset_entry.length == 11){
        temp = "63"+reset_entry.substring(2);
      } else if (reset_entry.length == 12) {
        temp = "63"+reset_entry.substring(3);
      } else {
        temp = "63"+reset_entry;
      }
      this.setState({reset_entry: parseInt(temp)})
    }

    fetch('http://192.168.150.10:5000/api/forgot_password', {
      method: 'POST',
      headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      reset_key: reset_entry
      }),
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      if (responseJson.status == true){
        this.props.navigation.navigate('login');
        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <View style={forgot_password_styles.container}>
        <Text style={forgot_password_styles.texts}>Please enter your username or phone number to reset the password for your account.</Text>
        <TextInput style={defaults.inputs} placeholder="E.g. 09123456789 or JuanDC" onChangeText={text => this.setState({reset_entry: text})}/>
        <TouchableOpacity onPress={() => this.submitResetCredentials()} style={defaults.touchableButtons}>
              <Text style={defaults.touchableTexts}>Reset</Text>
          </TouchableOpacity>
        <Text style={forgot_password_styles.texts}>A new password will be sent to your mobile number via SMS.</Text>
      </View>
    );
  }
}
