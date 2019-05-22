import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { surficial_data_styles } from '../../../assets/styles/surficial_data_styles'
import { ScrollView } from 'react-native-gesture-handler';
import PureChart from 'react-native-pure-chart';
import { defaults } from '../../../assets/styles/default_styles'
import Storage from '../../utils/storage'

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

  analyzeSurficialSummary(surficial_data) {
    let data_timestamp = surficial_data[0].data[0].x
    this.setState({ surficial_summary: "Last surficial data received is on " + data_timestamp })
  }

  componentDidMount() {
    let r_a_family_risk = Storage.getItem("SurficialDataMeasurements");
    r_a_family_risk.then(response => {
      let line_colors = ['#7cb5ec', '#000000', '#8ce77d']
      if (response == null) {
        fetch('http://192.168.150.191:5000/api/surficial_data/get_surficial_data').then((response) => response.json())
          .then((responseJson) => {
            console.log("Initialize surficial data measurements.")
            Storage.setItem("SurficialDataMeasurements", responseJson);
            let surficial_data = []
            for (const [index, value] of responseJson.entries()) {
              let data = {
                seriesName: value.series_name,
                data: value.data,
                color: line_colors[index]
              }
              surficial_data.push(data)
            }
            this.setState({ surficial_data: surficial_data })
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        let surficial_data = []
        for (const [index, value] of response.entries()) {
          let data = {
            seriesName: value.series_name,
            data: value.data,
            color: line_colors[index]
          }
          surficial_data.push(data)
        }
        this.setState({ surficial_data: surficial_data })
      }
      this.analyzeSurficialSummary(this.state.surficial_data)
    })
  }

  render() {
    return (
      <ScrollView style={surficial_data_styles.container}>
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
