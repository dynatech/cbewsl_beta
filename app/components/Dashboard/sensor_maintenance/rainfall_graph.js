import React, { Component } from 'react';
import { Alert, Text, View } from 'react-native';
import ChartView from 'react-native-highcharts';
import { sensor_maintenance_styles } from '../../../assets/styles/sensor_maintenance_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';

export default class RainfallGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      time: null,
      modalVisible: false,
      render_rainfall_graphs: [],
      data_availablity_graph: {},
      data_ts: [],
      hr24: [],
      hr72: []

    };
  }

  setModalVisible(visible) {
    if (this.state.date != null || this.state.time != null) {
      this.setState({ modalVisible: visible });
    } else {
      Alert.alert(
        'Rainfall Graph',
        'Please enter a valid time and date'
      );
    }
  }

  renderAvailabilityGraph(data) {
    let graph = []
    let series_a = []
    let series_b = []
    let dataset_a, dataset_b = []
    let data_availability = []
    let peak = this.getHighestPoint(data)

    data.forEach(element => {
      if (element.rain != null) {
        last_data = element.rain
      }
      if (element.rain == null) {
        data_availability.push({ seriesName: element.ts, data: [peak], color: 'blue' })
      } else {
        data_availability.push({ seriesName: element.ts, data: [element.rain], color: 'black' })
      }
    });

    console.log(data_availability)
    return data_availability
    // console.log(dataset_a)
    // console.log(dataset_b)
  }

  renderTrendGraph(data, one_day, three_day) {
    let temp_a = []
    let temp_b = []
    let return_values = []
    let previous_one_day = 0
    let previous_three_day = 0
    let ts_container = []

    data.forEach(element => {
      if (element['24hr cumulative rainfall'] == null) {
        element['24hr cumulative rainfall'] = previous_one_day
      } else {
        previous_one_day = element['24hr cumulative rainfall']
      }

      if (element['72hr cumulative rainfall'] == null) {
        element['72hr cumulative rainfall'] = previous_three_day
      } else {
        previous_three_day = element['72hr cumulative rainfall']
      }

      temp_a.push([element['24hr cumulative rainfall']])
      temp_b.push([element['72hr cumulative rainfall']])
      ts_container.push(element.ts)
    });

    this.setState({
      hr24: temp_a,
      hr74: temp_b,
      data_ts: ts_container
    })

    var Highcharts = 'Highcharts';
    var conf = {
      chart: {
        type: 'line',
        animation: Highcharts.svg, // don't animate in old IE
        panning: true,
        height: 200,
      },
      title: {
        text: ""
      },
      xAxis: {
        categories: ts_container,
        visible: false,
      },
      yAxis: {
        title: {
          text: 'Value (mm)'
        },
        max: Math.max(0, three_day) + parseFloat(Math.max(three_day)),
        min: 0,
        plotBands: [{
          value: Math.round(parseFloat(one_day)),
          color: '#5c77fc',
          dashStyle: "shortdash",
          width: 2,
          zIndex: 0,
          label: {
            text: `24-hr threshold (${one_day})`
          }
        }, {
          value: Math.round(parseFloat(three_day)),
          color: '#f0594a',
          dashStyle: "shortdash",
          width: 2,
          zIndex: 0,
          label: {
            text: `72-hr threshold (${three_day})`
          }
        }]
      },
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      plotOptions: {
        series: {
          marker: {
            radius: 3
          },
          cursor: "pointer"
        }
      },
      series: [{
        name: '24hr',
        data: temp_a,
        color: '#5c77fc'
      }, {
        name: '72hr',
        data: temp_b,
        color: '#f0594a'
      }]
    };

    return conf
  }

  getHighestPoint(data) {
    let hp = 0
    data.forEach(element => {
      if (element.rain > hp) {
        hp = element.rain
      }
    });
    if (hp == 0) {
      hp = 100 // Set 99999 for visualization
    }
    return hp
  }

  componentDidMount() {
    Notification.endOfValidity();
    let offline_data = Storage.getItem("RainfallSummary");
    offline_data.then(response => {
      let offline = response[0]
      let rainfall_container = []

      console.log(offline)

      offline.plot.forEach(element => {
        rainfall_container.push(<View style={sensor_maintenance_styles.graphContainer}>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}> Gauge name: {element.gauge_name.toUpperCase()} ({element.distance} KM away)</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}> Date: {offline.date} </Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}> Data window: 7 days</Text>
          <View style={{ width: '100%' }}>
            <ChartView style={{ height: 200 }} config={this.renderTrendGraph(element.data, offline['half of 2yr max'], offline['2yr max'])}></ChartView>
          </View>
        </View>)
      });
      this.setState({ render_rainfall_graphs: rainfall_container })
    });
  }
  render() {
    return (
      <View style={sensor_maintenance_styles.rainfallGraphContainer}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Rainfall Graph</Text>
        {this.state.render_rainfall_graphs}
      </View>
    );
  }
}
