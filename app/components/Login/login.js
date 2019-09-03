import React, { Component } from 'react';
import { Image, ImageBackground, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { defaults } from '../../assets/styles/default_styles';
import { login_styles } from '../../assets/styles/login_styles';
import Storage from "../utils/storage";

export default class Login extends Component {
  state = {
    username: "",
    password: ""
  }


  componentWillMount() {
    let credentials = Storage.getItem("loginCredentials")
    credentials.then(response => {
      if (response != null) {
        this.props.navigation.navigate('dashboard');
        ToastAndroid.show('Session restored.', ToastAndroid.SHORT);
      }
    })
  }

  validateCredentials() {
    const { username, password } = this.state
    fetch('http://192.168.8.100:5000/api/login/validate_credentials', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == true) {
          this.props.navigation.navigate('dashboard');
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
          Storage.setItem("loginCredentials", responseJson);
          console.log(responseJson)

        } else {
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }


  register() {
    this.props.navigation.navigate('register');
  }

  forgotPassword() {
    this.props.navigation.navigate('forgot_password');
  }

  render() {
    return (
      <ImageBackground style={login_styles.background} source={require('../../assets/images/login_backdrop.png')}>
        <View style={login_styles.container}>
          <View style={login_styles.heading}>
            <View style={login_styles.menulogo}>
              <Image style={login_styles.logo} source={require('../../assets/images/mdrrmo_logo.png')}></Image>
              <Image style={login_styles.logo} source={require('../../assets/images/dost-phivolcs-logo.png')}></Image>
              <Image style={login_styles.logo} source={require('../../assets/images/dews-l-logo.png')}></Image>
            </View>
            <Text style={login_styles.headingText}> Early Warning Information for Deep-seated Landslides </Text>
          </View>
          <View style={login_styles.inputContainer}>
            <View style={login_styles.inputBackDrop}></View>
            <TextInput style={[defaults.inputs, login_styles.inputs]} placeholder="Username" onChangeText={text => this.setState({ username: text })} />
            <TextInput style={[defaults.inputs, login_styles.inputs]} secureTextEntry={true} placeholder="Password" onChangeText={text => this.setState({ password: text })} />
            <TouchableOpacity onPress={() => this.validateCredentials()} style={defaults.touchableButtons}>
              <Text style={defaults.touchableTexts}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.accounts} onPress={() => this.register()}>
              <Text style={defaults.accountsText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.accounts} onPress={() => this.forgotPassword()}>
              <Text style={defaults.accountsText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
