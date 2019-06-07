import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { surficial_data_styles } from '../../../assets/styles/surficial_data_styles'
import { ScrollView } from 'react-native-gesture-handler';
import PureChart from 'react-native-pure-chart';
import { defaults } from '../../../assets/styles/default_styles'
import Storage from '../../utils/storage'
import { NavigationEvents } from 'react-navigation';
import moment from "moment"
import ChartView from 'react-native-highcharts';

export default class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surficial_data: null,
      surficial_summary: "",
      moms_summary: ""
    };
  }

  // Refactor this
  navigateSurficialData(tab) {
    switch (tab) {
      case "current_measurement":
        this.props.navigation.navigate('current_measurement')
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
      text_format_timestamp = moment(new Date()).format("MMMM D, YYYY h:mm A")
    } else {
      current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS")
      date = moment(date).format("MMMM D, YYYY")
      time = moment(date).format("h:mm A")
      text_format_timestamp = moment(date).format("MMMM D, YYYY h:mm A")
    }


    return {
      current_timestamp: current_timestamp,
      date: date,
      time: time,
      text_format_timestamp: text_format_timestamp
    }
  }

  analyzeSurficialSummary(surficial_data) {
    let data_timestamp = surficial_data[0].data[0].x
    let formatted_timestamp = this.formatDateTime(data_timestamp)
    this.setState({ surficial_summary: "Last surficial data received is on " + formatted_timestamp["text_format_timestamp"] })
  }

  getSurficialData() {

    let line_colors = ['#7cb5ec', '#000000', '#8ce77d']
    fetch('http://192.168.150.191:5000/api/surficial_data/get_surficial_data').then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        let surficial_data = []
        let to_local_data = []
        let counter = 0
        for (const [index, value] of responseJson.entries()) {
          let data = {
            seriesName: value.series_name,
            data: value.data,
            color: line_colors[index]
          }
          surficial_data.push(data)

          counter += 1
          to_local_data.push({
            local_storage_id: counter,
            data: value
          })
        }
        Storage.removeItem("SurficialDataMeasurements")
        Storage.setItem("SurficialDataMeasurements", to_local_data)
        let data_container = Storage.getItem('SurficialDataMeasurements')
        data_container.then(response => {
          console.log(response)
        });
        this.analyzeSurficialSummary(surficial_data)
        this.setState({ surficial_data: surficial_data })
      })
      .catch((error) => {
        let data_container = Storage.getItem('SurficialDataMeasurements')
        let surficial_data = [];
        data_container.then(response => {
          console.log(response.length)
          // for (const [index, value] of response.data.entries()) {
          //   let data = {
          //     seriesName: value.series_name,
          //     data: value.data,
          //     color: line_colors[index]
          //   }
          //   surficial_data.push(data)
          // }
          // this.analyzeSurficialSummary(surficial_data)
          // this.setState({ surficial_data: surficial_data })

        });
      });
  }

  render() {
    return (
      <ScrollView style={surficial_data_styles.container}>
        <NavigationEvents onDidFocus={() => this.getSurficialData()} />
        <View style={surficial_data_styles.menuSection}>
          <View style={surficial_data_styles.buttonSection}>
            <TouchableOpacity style={surficial_data_styles.activeButton} >
              <Text style={surficial_data_styles.buttonActiveText}>Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={surficial_data_styles.menuButton} onPress={() => this.navigateSurficialData("current_measurement")}>
              <Text style={surficial_data_styles.buttonText}>Current Measurement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={surficial_data_styles.menuButton} onPress={() => this.navigateSurficialData("monitoring_logs")}>
              <Text style={surficial_data_styles.buttonText}>Monitoring Logs</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={surficial_data_styles.contentContainer}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SURFICIAL MEASUREMENT</Text>
          <View style={surficial_data_styles.subContainer}>
            <Text>{this.state.surficial_summary}</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>MANIFESTATIONS OF MOVEMENT</Text>
          <View style={surficial_data_styles.subContainer}>
            <Text> SAMPLE DATA</Text>
          </View>
          <View style={{ padding: 10, marginTop: 20, marginBottom: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Surficial Measurement Graph</Text>
          </View>
          <PureChart data={this.state.surficial_data} type='line' />
        </View>
      </ScrollView>
    );
  }
}
