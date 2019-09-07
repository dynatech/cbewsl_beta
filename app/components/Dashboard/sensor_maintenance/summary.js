import moment from 'moment';
import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { sensor_maintenance_styles } from '../../../assets/styles/sensor_maintenance_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';
import RainfallGraph from './rainfall_graph';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      one_day_rain: 'Loading...',
      three_day_rain: 'Loading...',
      site_code: "umi",
      date: moment(new Date()).format("YYYY-MM-DD HH:MM:00"),
      spinner: true
    };
  }

  // Refactor this
  navigateSensorMaintenace(tab) {
    switch (tab) {
      case "sensor_status":
        this.props.navigation.navigate('sensor_status')
        break;
      case "maintenance_logs":
        this.props.navigation.navigate('maintenance_logs')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }

  componentDidMount() {
    Notification.endOfValidity();
    fetch('http://192.168.1.10:5000/api/rainfall/get_rainfall_plot_data/umi', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        site_code: this.state.site_code,
        date: this.state.date
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        responseJson[0].date = this.state.date
        Storage.setItem("RainfallSummary", responseJson)
        let online = responseJson[0]
        if (online["1D cml"] == null || online["1D cml"] == undefined || online["1D cml"] == "NO DATA") {
          online["1D cml"] = "NO DATA"
          this.setState({ one_day_rain: "NO DATA", spinner: false })
        } else {
          this.setState({ one_day_rain: Math.round((online["1D cml"] / online["half of 2yr max"]) * 100).toString() + "%" })
        }

        if (online["3D cml"] == null || online["3D cml"] == undefined || online["3D cml"] == "NO DATA") {
          online["3D cml"] = "NO DATA"
          this.setState({ three_day_rain: "NO DATA", spinner: false })
        } else {
          this.setState({ three_day_rain: Math.round((online["3D cml"] / online["2yr max"]) * 100).toString() + "%", spinner: false })
        }
      })
      .catch((error) => {
        let offline_data = Storage.getItem("RainfallSummary");
        offline_data.then(response => {
          let offline = response[0]
          if (offline["1D cml"] == null || offline["1D cml"] == undefined || offline["1D cml"] == "NO DATA") {
            offline["1D cml"] = "NO DATA"
            this.setState({ one_day_rain: "NO DATA", spinner: false })
          } else {
            this.setState({ one_day_rain: Math.round((offline["1D cml"] / offline["half of 2yr max"]) * 100).toString() + "%" })
          }

          if (offline["3D cml"] == null || offline["3D cml"] == undefined || offline["3D cml"] == "NO DATA") {
            offline["3D cml"] = "NO DATA"
            this.setState({ three_day_rain: "NO DATA", spinner: false })
          } else {
            this.setState({ three_day_rain: Math.round((offline["3D cml"] / offline["2yr max"]) * 100).toString() + "%", spinner: false })
          }
        });
      });
  }

  render() {
    return (
      <ScrollView style={sensor_maintenance_styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Fetching data...'}
          textStyle={spinner_styles.spinnerTextStyle}
        />
        <View style={sensor_maintenance_styles.menuSection}>
          <View style={sensor_maintenance_styles.buttonSection}>
            <TouchableOpacity style={sensor_maintenance_styles.activeButton} >
              <Text style={sensor_maintenance_styles.buttonActiveText}>Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={sensor_maintenance_styles.menuButton} onPress={() => this.navigateSensorMaintenace("sensor_status")}>
              <Text style={sensor_maintenance_styles.buttonText}>Sensor Status</Text>
            </TouchableOpacity>
            <TouchableOpacity style={sensor_maintenance_styles.menuButton} onPress={() => this.navigateSensorMaintenace("maintenance_logs")}>
              <Text style={sensor_maintenance_styles.buttonText}>Maintenance Logs</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={sensor_maintenance_styles.contentContainer}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Rainfall</Text>
          <View style={sensor_maintenance_styles.subContainer}>
            <Text>1-day threshold: {this.state.one_day_rain}</Text>
            <Text>3-day threshold: {this.state.three_day_rain}</Text>
          </View>
        </View>
        <View style={sensor_maintenance_styles.graphContainer}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Subsurface</Text>
          <View style={sensor_maintenance_styles.subContainer}>
            <Text>No available data.</Text>
          </View>
        </View>
        <RainfallGraph />
      </ScrollView>

    );
  }
}
