import moment from "moment";
import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import { surficial_data_styles } from '../../../assets/styles/surficial_data_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';

export default class CurrentMeasurement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      time: null,
      crack_sets: null,
      spinner: true
    };
  }

  navigateSurficialData(tab) {
    switch (tab) {
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

  formatDateTime(date = null) {
    let timestamp = date
    let current_timestamp = ""
    let text_format_timestamp = ""
    if (timestamp == null) {
      current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
      date = moment(new Date()).format("MMMM D, YYYY")
      time = moment(new Date()).format("h:mm A")
      text_format_timestamp = moment(new Date()).format("MMMM D, YYYY h:mm:ss A")
    } else {
      current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS")
      date = moment(date).format("MMMM D, YYYY")
      time = moment(date).format("h:mm A")
      text_format_timestamp = moment(date).format("MMMM D, YYYY h:mm:ss A")
    }


    return {
      current_timestamp: current_timestamp,
      date: date,
      time: time,
      text_format_timestamp: text_format_timestamp
    }
  }

  getSurficialCurrentMeasurement() {
    Notification.endOfValidity();
    fetch('http://192.168.8.101:5000/api/surficial_data/get_current_measurement').then((response) => response.json())
      .then((responseJson) => {
        let formmated_timestamp = this.formatDateTime(date = responseJson.current_measurement_date)
        let crack_sets = []
        this.setState({ date: formmated_timestamp["date"] })
        this.setState({ time: formmated_timestamp["time"] })

        for (const [index, value] of responseJson.cracks.entries()) {
          crack_sets.push(<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Crack {value.crack}: {value.measurement} cm</Text>)
        }
        Storage.removeItem("SurficialDataCurrentMeasurement")
        Storage.setItem("SurficialDataCurrentMeasurement", responseJson)
        this.setState({ crack_sets: crack_sets, spinner: false })
      })
      .catch((error) => {
        let data_container = Storage.getItem('SurficialDataCurrentMeasurement')
        let crack_sets = []
        data_container.then(response => {
          let formmated_timestamp = this.formatDateTime(date = response.current_measurement_date)
          this.setState({ date: formmated_timestamp["date"] })
          this.setState({ time: formmated_timestamp["time"] })
          for (const [index, value] of response.cracks.entries()) {
            crack_sets.push(<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Crack {value.crack}: {value.measurement} cm</Text>)
          }
          this.setState({ crack_sets: crack_sets, spinner: false })
        });
      });
  }

  render() {
    return (
      <ScrollView style={surficial_data_styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Fetching data...'}
          textStyle={spinner_styles.spinnerTextStyle}
        />
        <NavigationEvents onDidFocus={() => this.getSurficialCurrentMeasurement()} />
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
          <View style={{ padding: 10, marginTop: 20, marginBottom: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>DATE: {this.state.date}</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>TIME: {this.state.time}</Text>
          </View>
          <View style={{ padding: 10 }}>
            {this.state.crack_sets}
          </View>
        </View>
      </ScrollView>

    );
  }
}
