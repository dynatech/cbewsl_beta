import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { surficial_data_styles } from '../../../assets/styles/surficial_data_styles'
import { ScrollView } from 'react-native-gesture-handler';
import Storage from '../../utils/storage'

export default class CurrentMeasurement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      time: null,
      crack_sets: null
    };
  }

  navigateSurficialData(tab) {
    switch(tab) {
        case "summary":
            this.props.navigation.navigate('summary')
            break;
        case "monitoring_logs":
            this.props.navigation.navigate('monitoring_logs')
            break;
        default:
            console.log("Same page...")
            break;
    }
  }

  componentDidMount(){
    let surficial_data_current_meas = Storage.getItem("SurficialDataCurrentMeasurement");
    surficial_data_current_meas.then(response => {
      if (response == null) {
        fetch('http://192.168.150.191:5000/api/surficial_data/get_current_measurement').then((response) => response.json())
        .then((responseJson) => {

          console.log("Initialize surficial data current measurement.")
          Storage.setItem("SurficialDataCurrentMeasurement", responseJson);
          
          let crack_sets = []
          this.setState({date: responseJson.date})
          this.setState({time: responseJson.time})
    
          for (const [index, value] of responseJson.cracks.entries()) {
            console.log(value)
            let key = Object.keys(value)
            let key_value = Object.values(value)
            crack_sets.push(<Text style={{fontSize: 20, fontWeight: 'bold'}}>Crack {key}: {key_value}</Text>)
          }
          this.setState({crack_sets: crack_sets})
        })
        .catch((error) => {
          console.error(error);
        });
      } else {
        let crack_sets = []
        this.setState({date: response.date})
        this.setState({time: response.time})
  
        for (const [index, value] of response.cracks.entries()) {
          let key = Object.keys(value)
          let key_value = Object.values(value)
          crack_sets.push(<Text style={{fontSize: 20, fontWeight: 'bold'}}>Crack {key}: {key_value}</Text>)
        }
        this.setState({crack_sets: crack_sets})
      }
    })
  }

  render() {
    return (
      <ScrollView style={surficial_data_styles.container}>
        <View style={surficial_data_styles.menuSection}>
            <View style={surficial_data_styles.buttonSection}>
                <TouchableOpacity style={surficial_data_styles.menuButton} onPress={() => this.navigateSurficialData("summary")}>
                    <Text style={surficial_data_styles.buttonText}>Summary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={surficial_data_styles.activeButton} >
                    <Text style={surficial_data_styles.buttonActiveText}>Current Measurement</Text>
                </TouchableOpacity>
                <TouchableOpacity style={surficial_data_styles.menuButton} onPress={() => this.navigateSurficialData("monitoring_logs")}>
                    <Text style={surficial_data_styles.buttonText}>Monitoring Logs</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={surficial_data_styles.contentContainer}>
          <View style={{padding: 10, marginTop: 20, marginBottom: 20}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>DATE: {this.state.date}</Text>
            <Text style={{fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>TIME: {this.state.time}</Text>
          </View>
          <View style={{padding: 10}}>
            {this.state.crack_sets}
          </View>
        </View>
      </ScrollView>
      
    );
  }
}
