import React, { Component } from 'react';
import {Modal, View, Text, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-datepicker'
import { sensor_maintenance_styles } from '../../../assets/styles/sensor_maintenance_styles'
import { defaults } from '../../../assets/styles/default_styles'
import Storage from '../../utils/storage'
import PureChart from 'react-native-pure-chart';

export default class RainfallGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
        date: null,
        time: null,
        modalVisible: false,
        rainfall_data: [
          {
            seriesName: 'series1',
            data: [
              {x: '2018-02-01', y: 30},
              {x: '2018-02-02', y: 200},
              {x: '2018-02-03', y: 170},
              {x: '2018-02-04', y: 250},
              {x: '2018-02-05', y: 10}
            ],
            color: '#297AB1'
          },
          {
            seriesName: 'series2',
            data: [
              {x: '2018-02-01', y: 20},
              {x: '2018-02-02', y: 100},
              {x: '2018-02-03', y: 140},
              {x: '2018-02-04', y: 550},
              {x: '2018-02-05', y: 40}
            ],
            color: 'yellow'
          }
        ]
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style={sensor_maintenance_styles.rainfallGraphContainer}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          presentationStyle = "pageSheet"
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{textAlign: 'center', flex: 0.5, padding: "10%"}}>
            <Text style={{padding: 20, fontSize: 15, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Rainfall Data as of {this.state.date} {this.state.time}</Text>
            <View style={{width: "100%"}}>
              <PureChart data={this.state.rainfall_data} type='line' />
            </View>
            <View style={{justifyContent: 'center', flexDirection: 'row'}}>
              <TouchableOpacity style={defaults.button}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={defaults.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Text style={{fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Rainfall Graph</Text>
        <View style={sensor_maintenance_styles.datetimeContainer}>
            <View style={{flexDirection: 'row',flex: 1, paddingTop: 10}}>
              <View style={{flex: 0.4}}>
                <Text style={sensor_maintenance_styles.datetimeLabel}>Date</Text>
              </View>
              <View style={{flex: 1.7}}>
                <DatePicker
                    style={{width: '90%'}}
                    date={this.state.date}
                    mode="date"
                    placeholder="E.g. 1994-08-16"
                    format="YYYY-MM-DD"
                    showIcon = {false}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                    dateInput: {
                        width: '100%'
                    }
                    }}
                    onDateChange={(date) => {this.setState({date: date})}}
                    />
              </View>
            </View>
        </View>
        <View style={sensor_maintenance_styles.datetimeContainer}>
            <View style={{flexDirection: 'row',flex: 1, paddingTop: 10}}>
                <View style={{flex: 0.4}}>
                    <Text style={sensor_maintenance_styles.datetimeLabel}>Time</Text>
                </View>
                <View style={{flex: 1.7}}>
                    <DatePicker
                        style={{width: '90%'}}
                        date={this.state.time}
                        mode="time"
                        placeholder="E.g. 15:00"
                        showIcon = {false}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateInput: {
                            width: '100%'
                        }
                        }}
                        onDateChange={(date) => {this.setState({time: date})}}
                    />
              </View>
            </View>
        </View>
        <View style={{textAlign: 'center', flex: 0.5}}>
          <View style={{justifyContent: 'center', flexDirection: 'row'}}>
            <TouchableOpacity style={defaults.button} onPress={() => {this.setModalVisible(true);}}>
              <Text style={defaults.buttonText}>SHOW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
