import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { surficial_data_styles } from '../../../assets/styles/surficial_data_styles'
import { ScrollView } from 'react-native-gesture-handler';
import Storage from '../../utils/storage'
import { NavigationEvents } from 'react-navigation';
import moment from "moment"
import ChartView from 'react-native-highcharts';
// import SurficialComputation from '../../utils/surficial_computation'

export default class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surficial_data: null,
      surficial_summary: "",
      moms_summary: "",
      render_surficial_graph: []
    };
  }

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

  analyzeSurficialSummary(surficial_summary) {
    let data_timestamp = surficial_summary[surficial_summary.length-1]
    let formatted_timestamp = this.formatDateTime(data_timestamp)
    this.setState({ surficial_summary: "Last surficial data received is on " + formatted_timestamp["text_format_timestamp"] })
  }

  getSurficialData() {
    let line_colors = ['#7cb5ec', '#000000', '#8ce77d']
    fetch('http://192.168.150.191:5000/api/surficial_data/get_surficial_data').then((response) => response.json())
      .then((responseJson) => {
        Storage.removeItem("SurficialDataSummary")
        Storage.setItem("SurficialDataSummary", responseJson)

        let label_data = []
        let series_container = []

        for (const [index, value] of responseJson.entries()) {
          let marker = {
            name: value.crack_name,
            data: value.measurements,
            color: line_colors[index]
          }
          series_container.push(marker)
          label_data = value.ts
        }
        this.analyzeSurficialSummary(label_data)
        this.renderSurficialGraph(label_data, series_container)
      })
      .catch((error) => {
        let data_container = Storage.getItem('SurficialDataSummary')
        let label_data = []
        let series_data = []
        data_container.then(response => {
          for (const [index, value] of response.entries()) {
            let marker = {
              name: value.crack_name,
              data: value.measurements,
              color: line_colors[index]
            }
            series_container.push(marker)
            label_data = value.ts
          }
          this.analyzeSurficialSummary(label_data)
          this.renderSurficialGraph(label_data ,series_data)
        });
      });
  }

  renderSurficialGraph(label_data,series_data) {

    let surficial_container = []
    let Highcharts='Highcharts';

    let conf={
      chart: {
        type: 'line',
        animation: Highcharts.svg, // don't animate in old IE
        panning: true,
        height: 200,
        zoomType: 'xy'
      },
      title: {
        text: ""
      },
      // subtitle: {

      // },
      xAxis: {
        categories: label_data,
        visible: false,
      },
      yAxis: {
        title: {
          text: 'Displacement (mm)'
        }
      },
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        line: {
          marker: {
            enabled: true
          },
          dashStyle: "ShortDash"
        },
        series: {
          marker: {
              radius: 3
          },
          cursor: "pointer"
        }
      },
      series: series_data
    };

    surficial_container.push(<View style={{padding: 20}}>
      <View style={{width: '100%'}}>
        <ChartView style={{height: 200}} config={conf}></ChartView>
      </View>
    </View>)

    this.setState({render_surficial_graph: surficial_container})
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
          {this.state.render_surficial_graph}
        </View>
      </ScrollView>
    );
  }
}
