import React, { Component } from 'react';
import { Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { defaults } from '../../assets/styles/default_styles';
import { register_styles } from '../../assets/styles/register_styles';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirm_password: '',
      first_name: '',
      last_name: '',
      sex: '',
      birthday: '',
      mobile_number: ''
    };
  }

  validateFields() {
    const {username,
      password,
      confirm_password,
      first_name,
      last_name,
      sex,
      birthday,
      mobile_number} = this.state

      if (password == confirm_password) {
        fetch('http://192.168.150.10:5000/api/register/account', {
          method: 'POST',
          headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          username: username,
          password: password,
          first_name: first_name,
          last_name: last_name,
          sex: sex,
          birthday: birthday,
          mobile_number: mobile_number
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
      } else {
        ToastAndroid.show('Password does not match!', ToastAndroid.SHORT);
      }
  }

  render() {
    return (
      <View style={register_styles.container}>
        <View style={register_styles.inputContainer}>
          <TextInput style={defaults.inputs} placeholder="First name: E.g. Juan" onChangeText={text => this.setState({first_name: text})}/>
          <TextInput style={defaults.inputs} placeholder="Last name: E.g. Dela Cruz" onChangeText={text => this.setState({last_name: text})}/>
          <TextInput style={defaults.inputs} placeholder="Sex: Male" onChangeText={text => this.setState({sex: text})}/>
          <TextInput style={defaults.inputs} placeholder="Birthday: E.g. 1988-07-27" onChangeText={text => this.setState({birthday: text})}/>
          <TextInput style={defaults.inputs} placeholder="Mobile number: E.g. 09123456789" onChangeText={text => this.setState({mobile_number: text})}/>
          <TextInput style={defaults.inputs} placeholder="Username" onChangeText={text => this.setState({username: text})}/>
          <TextInput style={defaults.inputs} secureTextEntry={true} placeholder="Password" onChangeText={text => this.setState({password: text})}/>
          <TextInput style={defaults.inputs} secureTextEntry={true} placeholder="Confirm Password" onChangeText={text => this.setState({confirm_password: text})}/>
        </View>
        <View>
          <TouchableOpacity onPress={() => this.validateFields()} style={defaults.touchableButtons}>
              <Text style={defaults.touchableTexts}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
