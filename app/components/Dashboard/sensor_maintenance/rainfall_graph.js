import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-datepicker'
import { sensor_maintenance_styles } from '../../../assets/styles/sensor_maintenance_styles'
import { defaults } from '../../../assets/styles/default_styles'

export default class RainfallGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
        date: null,
        time: null
    };
  }

  render() {
    return (
      <View style={sensor_maintenance_styles.rainfallGraphContainer}>
        <Text style={{fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Rainfall Graph</Text>
        <View style={sensor_maintenance_styles.datetimeContainer}>
            <View style={{flexDirection: 'row',flex: 1, paddingTop: 10}}>
              <View style={{flex: 0.4}}>
                <Text style={sensor_maintenance_styles.datetimeLabel}>Date</Text>
              </View>
              <View style={{flex: 1.7}}>
                <DatePicker
                    style={{width: '90%'}}
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
            <TouchableOpacity style={defaults.button}>
              <Text style={defaults.buttonText}>SHOW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
