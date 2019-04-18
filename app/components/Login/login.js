import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert, Image} from 'react-native';
import { defaults } from '../../assets/styles/default_styles'
import { login_styles } from '../../assets/styles/login_styles'

export default class Login extends Component {
  state = {
    username: "",
    password: ""
  }

  checkLogin() {
    // TODO: Segregate functionalities and add the APIs
    const {username, password} = this.state
    if (username == "admin" && password == "admin") {
        this.props.navigation.navigate('dashboard')
    } else {
        Alert.alert('Invalid login', 'Username / Password mismatch.')
    }
  }

  render() {
    return (
       <ImageBackground style={login_styles.background} source={require('../../assets/images/login_backdrop.png')}>
            <View style={login_styles.container}>
                <View style={login_styles.heading}>
                  <View style={login_styles.menulogo}>
                      <Image style={login_styles.logo} source={require('../../assets/images/alimodian.jpg')}></Image>
                      <Image style={login_styles.logo} source={require('../../assets/images/dost-phivolcs-logo.png')}></Image>
                      <Image style={login_styles.logo} source={require('../../assets/images/dews-l-logo.png')}></Image>
                  </View>
                  <Text style={login_styles.headingText}> Early Warning Information for Deep-seated Landslides </Text>
                </View>
                <View style={login_styles.inputContainer}>
                  <View style={login_styles.inputBackDrop}></View>
                  <TextInput style={[defaults.inputs, login_styles.inputs]} placeholder="Username" onChangeText={text => this.setState({username: text})}/>
                  <TextInput style={[defaults.inputs, login_styles.inputs]} secureTextEntry={true} placeholder="Password" onChangeText={text => this.setState({password: text})}/>
                  <TouchableOpacity onPress={() => this.checkLogin()} style={defaults.touchableButtons}>
                      <Text style={defaults.touchableTexts}>Login</Text>
                  </TouchableOpacity>
                </View>
            </View>
       </ImageBackground>
    );
  }
}
