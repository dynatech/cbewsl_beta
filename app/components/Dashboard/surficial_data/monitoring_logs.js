import moment from "moment";
import { Icon } from 'native-base';
import React, { Component } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { DataTable } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';
import { defaults } from '../../../assets/styles/default_styles';
import { surficial_data_styles } from '../../../assets/styles/surficial_data_styles';
import Storage from '../../utils/storage';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';
import Sync from '../../utils/syncer';
import Notification from '../../utils/alert_notification';

export default class MonitoringLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monitoring_logs_data: [],
      monitoring_logs_data_paginate: [],
      page: 0,
      number_of_pages: 0,
      spinner: true,
      role_id: 0
    };
  }

  // Refactor this
  navigateSurficialData(tab) {
    switch (tab) {
      case "summary":
        this.props.navigation.navigate('summary')
        break;
      case "current_measurement":
        this.props.navigation.navigate('current_measurement')
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

  tablePaginate(monitoring_logs_data) {
    let temp = []
    let counter = 0
    let number_of_pages = monitoring_logs_data.length / 6
    this.setState({ number_of_pages: Math.ceil(number_of_pages) })
    monitoring_logs_data.forEach(element => {
      if (counter < 6) {
        temp.push(element)
      }
      counter++
    });
    this.setState({ monitoring_logs_data_paginate: temp })
  }

  changePage(page) {
    let start = (page * 6)
    let end = start + 7
    let temp = []

    if (end == 0) {
      end = 6
    }

    console.log(start)
    console.log(end)

    for (let counter = start; counter < end; counter++) {
      temp.push(this.state.monitoring_logs_data[counter])
    }
    this.setState({ monitoring_logs_data_paginate: temp })
    this.setState({ page: page })
  }



  updateLog(moms_data) {
    role_id = this.state.role_id;
    if (role_id == 1) {
      Alert.alert('Access denied', 'Unable to access this feature.');
    } else {
      this.props.navigation.navigate('save_surficial_data', {
        data: moms_data
      })
    }
  }

  removeConfirmation(id) {
    role_id = this.state.role_id;
    if (role_id == 1) {
      Alert.alert('Access denied', 'Unable to access this feature.');
    } else {
      Alert.alert(
        'Confirmation',
        'Are you sure do you want to delete ?',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => this.removeLog(id) },
        ],
        { cancelable: false },
      );
    }

  }

  removeLog(id) {
    fetch('http://192.168.1.10:5000/api/moms_data/delete_moms_data', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        moms_id: id
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if (responseJson.status == true) {
          this.props.navigation.navigate('monitoring_logs');
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
          this.getMonitoringLogs()
        } else {
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
        }
      })
      .catch((error) => {
        let offline_data = Storage.getItem("SurficialDataMomsSummary");
        offline_data.then(response => {
          let temp = response
          let updated_data = []
          let counter = 0
          temp.forEach((value) => {
            counter += 1
            if (id != value.local_storage_id) {
              updated_data.push({
                moms_id: value.moms_id,
                local_storage_id: counter,
                sync_status: value.sync_status,
                type_of_feature: value.type_of_feature,
                description: value.description,
                name_of_feature: value.name_of_feature,
                date: value.datetime
              })
            }
          });
          Storage.removeItem("SurficialDataMomsSummary")
          Storage.setItem("SurficialDataMomsSummary", updated_data)
        });

        this.getMonitoringLogs();
      });
  }

  raiseAlert(data) {
    role_id = this.state.role_id;
    if (role_id == 1) {
      Alert.alert('Access denied', 'Unable to access this feature.');
    } else {
      Alert.alert(
        'Raise Alert',
        'Are you sure you want raise to this alert?',
        [
          {
            text: 'Non-significant',
            style: 'cancel',
            onPress: () => this.setAlertForMoms(data, "0")
          },
          {
            text: 'Significant',
            onPress: () => this.setAlertForMoms(data, "2"),
          },
          {
            text: 'Critical',
            onPress: () => this.setAlertForMoms(data, "3"),
          },
        ],
        { cancelable: true },
      );
    }
  }

  addLog() {
    role_id = this.state.role_id;
    if (role_id == 1) {
      Alert.alert('Access denied', 'Unable to access this feature.');
    } else {
      this.props.navigation.navigate('save_surficial_data')
    }
  }

  setAlertForMoms(data, alert_level) {
    let current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
    let alert_validity = ""
    let int_sym = ""
    let offline_data = Storage.getItem("Pub&CandidAlert");
    offline_data.then(response => {
      response = JSON.parse(response.candidate_alert)[0]
      if (response == null || response == undefined) {
        if (alert_level == "2") {
          int_sym = "m2"
          alert_validity = moment(data.date).add(24, 'hours').format("YYYY-MM-DD HH:mm:00")
        } else if (alert_level == "3") {
          int_sym = "m3"
          alert_validity = moment(data.date).add(48, 'hours').format("YYYY-MM-DD HH:mm:00")
        } else if (alert_level == "0") {
          int_sym = "m0"
        }

        let hour = moment(alert_validity).hours()
        if (hour >= 0 && hour < 4) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 04:00:00")
        } else if (hour >= 4 && hour < 8) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 08:00:00")
        } else if (hour >= 8 && hour < 12) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 12:00:00")
        } else if (hour >= 12 && hour < 16) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 16:00:00")
        } else if (hour >= 16 && hour < 20) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 20:00:00")
        } else if (hour >= 20) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 00:00:00")
        }

        let cred = Storage.getItem("loginCredentials");
        cred.then(cred_response => {
          console.log(cred_response)
          let trigger_list = {
            alert_level: alert_level,
            alert_validity: alert_validity.toString(),
            data_ts: data.date.toString(),
            user_id: cred_response.user_data.account_id,
            trig_list: [
                {
                    int_sym: int_sym,
                    remarks: data.description,
                    f_name: data.name_of_feature,
                    f_type: data.type_of_feature
                }
            ]
        }
          let url = 'http://192.168.1.10:5000/api/monitoring/insert_cbewsl_moms_ewi_web';
          fetch(url, {
              method: 'POST',
              dataType: 'jsonp',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(trigger_list),
          }).then((responseJson) => {
              alert("Successfuly raise MOMs.");
          });
          // temp.trig_list.push(trig_list)
          // let raised_alerts = Storage.setItem("Pub&CandidAlert", temp);
        })
      } else {
        console.log(response)
        let hour_validity = 0
        if (alert_level == "2") {
          int_sym = "m2"
          hour_validity = 24
          alert_validity = moment(data.date).add(hour_validity, 'hours').format("YYYY-MM-DD HH:mm:00")
        } else if (alert_level == "3") {
          int_sym = "m3"
          hour_validity = 48
          alert_validity = moment(data.date).add(hour_validity, 'hours').format("YYYY-MM-DD HH:mm:00")
        } else if (alert_level == "0") {
          int_sym = "m0"
        }

        let hour = moment(alert_validity).hours()
        if (hour >= 0 && hour < 4) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 04:00:00")
        } else if (hour >= 4 && hour < 8) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 08:00:00")
        } else if (hour >= 8 && hour < 12) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 12:00:00")
        } else if (hour >= 12 && hour < 16) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 16:00:00")
        } else if (hour >= 16 && hour < 20) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 20:00:00")
        } else if (hour >= 20) {
          alert_validity = moment(alert_validity).add(24, 'hours').format("YYYY-MM-DD 00:00:00")
        }

        if (moment(moment(alert_validity) > response.validity)) {
          response.validty = alert_validity
        }


        let cred = Storage.getItem("loginCredentials");
        cred.then(cred_response => {
          let trigger_list = {
            alert_level: alert_level,
            alert_validity: alert_validity.toString(),
            data_ts: data.date.toString(),
            user_id: cred_response.user_data.account_id,
            trig_list: [
                {
                    int_sym: int_sym,
                    remarks: data.description,
                    f_name: data.name_of_feature,
                    f_type: data.type_of_feature
                }
            ]
        } 

          let url = 'http://192.168.1.10:5000/api/monitoring/insert_cbewsl_moms';
            fetch(url, {
                method: 'POST',
                dataType: 'jsonp',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trigger_list),
            }).then((responseJson) => {
                alert("Successfuly raise MOMs.");
            });
          // .then((response) => {
          //   console.log("HERE")
          //   console.log(response)
          //     let url = 'http://192.168.1.10:5000/api/monitoring/insert_cbewsl_moms';
          //     fetch(url, {
          //         method: 'POST',
          //         dataType: 'jsonp',
          //         headers: {
          //             Accept: 'application/json',
          //             'Content-Type': 'application/json',
          //         },
          //         body: JSON.stringify(trigger_list),
          //     }).then((responseJson) => {
          //         console.log(responseJson)
          //         // $("#raise_moms_modal").modal("hide");
          //         // publicAlert(response);
          //         // $("#confirm_release_ewi").trigger("click");
          //         // $("#confirm_send_ewi").trigger("click");
          //         alert("Successfuly raise MOMs.");
          //     });
          // })
          // temp.trig_list.push(trig_list)
          // let raised_alerts = Storage.setItem("Pub&CandidAlert", temp);
        })
        // response.alert_level = alert_level
        // console.log("HOW")
        // console.log(response.trigger_list_arr)
        // response.trigger_list_arr.push(trig_list)
        // let raised_alerts = Storage.setItem("Pub&CandidAlert", response);
      }
      // Notification.formatCandidateAlerts(response)
    })
  }


    async isOnSet(moms_alert_level) {
    let candidate_alerts = this.updateEwiData();
    console.log("here")
    candidate_alerts.then((json_data)=> {
      console.log(json_data)
      const { leo: { overdue, latest } } = json_data;
      const merged_arr = [...latest, ...overdue];
      console.log("----")
      console.log(leo)
      console.log(merged_arr)
      let public_alert_level = 0;
      if (merged_arr.length !== 0) {
        const [current_alert] = merged_arr;
        const { public_alert_symbol: { alert_level } } = current_alert;
        public_alert_level = alert_level;
      }
      if (moms_alert_level > public_alert_level) {
        console.log("T")
        return true;
      }
      else {
        console.log("F")
        return false;
      }
    })
}

 async updateEwiData() {
  const response = await fetch('http://192.168.1.10:5000/api/monitoring/get_candidate_and_current_alerts');
   return await response.json();
}

  getMonitoringLogs() {
    let credentials = Storage.getItem("loginCredentials");
    credentials.then(response => {
      let role_id = response.role_id;
      this.setState({ role_id: role_id });
    });

    Sync.clientToServer("SurficialDataMomsSummary").then(() => {
      setTimeout(() => {
        fetch('http://192.168.1.10:5000/api/surficial_data/get_moms_data').then((response) => response.json())
          .then((responseJson) => {

            let monitoring_logs_data = []
            let to_local_data = []
            let counter = 0
            if (responseJson.length != 0) {
              for (const [index, value] of responseJson.entries()) {
                let formatted_timestamp = this.formatDateTime(date = value.date)
                monitoring_logs_data.push(<DataTable.Row style={{ width: 600 }}>
                  <DataTable.Cell style={{ paddingRight: 10 }}>{value.type_of_feature}</DataTable.Cell>
                  <DataTable.Cell style={{ paddingRight: 10 }}>{value.description}</DataTable.Cell>
                  <DataTable.Cell style={{ paddingRight: 10 }}>{value.name_of_feature}</DataTable.Cell>
                  <DataTable.Cell style={{ paddingRight: 10 }}>{formatted_timestamp["text_format_timestamp"]}</DataTable.Cell>
                  <DataTable.Cell>
                    <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon><Text>   </Text>
                    <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.moms_id)}></Icon><Text>   </Text>
                    <Icon name="ios-share-alt" style={{ color: "#083451" }} onPress={() => this.raiseAlert(value)}><Text style={{ fontSize: 5 }}>Raise</Text></Icon>
                  </DataTable.Cell>
                </DataTable.Row>)

                counter += 1
                to_local_data.push({
                  moms_id: value.moms_id,
                  local_storage_id: counter,
                  sync_status: 3,
                  type_of_feature: value.type_of_feature,
                  description: value.description,
                  name_of_feature: value.name_of_feature,
                  date: value.date
                })
              }
              Storage.removeItem("SurficialDataMomsSummary")
              Storage.setItem("SurficialDataMomsSummary", to_local_data)
            } else {
              monitoring_logs_data.push(<DataTable.Row style={{ width: 600 }}>
                <DataTable.Cell style={{ marginRight: 10 }}>No data</DataTable.Cell>
              </DataTable.Row>)
            }
            this.setState({ monitoring_logs_data: monitoring_logs_data, spinner: false })
            this.tablePaginate(monitoring_logs_data)


          })
          .catch((error) => {
            let data_container = Storage.getItem('SurficialDataMomsSummary')
            let monitoring_logs_data = [];
            data_container.then(response => {
              console.log(response)
              let counter = 0
              if (response.length != 0) {
                for (const [index, value] of response.entries()) {
                  let formatted_timestamp = this.formatDateTime(date = value.date)
                  monitoring_logs_data.push(<DataTable.Row style={{ width: 600 }}>
                    <DataTable.Cell style={{ marginRight: 20 }}>{value.type_of_feature}</DataTable.Cell>
                    <DataTable.Cell style={{ marginRight: 20 }}>{value.description}</DataTable.Cell>
                    <DataTable.Cell style={{ marginRight: 20 }}>{value.name_of_feature}</DataTable.Cell>
                    <DataTable.Cell style={{ marginRight: 20 }}>{formatted_timestamp["text_format_timestamp"]}</DataTable.Cell>
                    <DataTable.Cell>
                      <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon><Text>   </Text>
                      <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.local_storage_id)}></Icon><Text>   </Text>
                      <Icon name="ios-share-alt" style={{ color: "#083451" }} onPress={() => this.raiseAlert(value)}><Text style={{ fontSize: 5 }}>Raise</Text></Icon>
                    </DataTable.Cell>
                  </DataTable.Row>)
                }
              } else {
                monitoring_logs_data.push(<DataTable.Row style={{ width: 600 }}>
                  <DataTable.Cell style={{ marginRight: 10 }}>No data</DataTable.Cell>
                </DataTable.Row>)
              }
              this.setState({ monitoring_logs_data: monitoring_logs_data, spinner: false })
              this.tablePaginate(monitoring_logs_data)
            });
          });
      }, 3000)
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
        <NavigationEvents onDidFocus={() => this.getMonitoringLogs()} />
        <View style={surficial_data_styles.menuSection}>
          <View style={surficial_data_styles.buttonSection}>
            <TouchableOpacity style={surficial_data_styles.menuButton} onPress={() => this.navigateSurficialData("summary")}>
              <Text style={surficial_data_styles.buttonText}>Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={surficial_data_styles.menuButton} onPress={() => this.navigateSurficialData("current_measurement")}>
              <Text style={surficial_data_styles.buttonText}>Current Measurement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={surficial_data_styles.activeButton} >
              <Text style={surficial_data_styles.buttonActiveText}>Monitoring Logs</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <ScrollView horizontal={true}>
            <DataTable>
              <DataTable.Header style={{ width: 600 }}>
                <DataTable.Title>Type of Feature</DataTable.Title>
                <DataTable.Title>Description</DataTable.Title>
                <DataTable.Title>Name of Feature</DataTable.Title>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Action</DataTable.Title>
              </DataTable.Header>
              {this.state.monitoring_logs_data_paginate}
              <DataTable.Pagination
                page={this.state.page}
                numberOfPages={this.state.number_of_pages}
                onPageChange={(page) => { this.changePage(page) }}
                label={`Page ${this.state.page} of ${this.state.number_of_pages - 1}`}
              />
            </DataTable>
          </ScrollView>
        </View>
        <View style={{ textAlign: 'center', flex: 0.5 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={defaults.button} onPress={() => this.addLog()}>
              <Text style={defaults.buttonText}>Add Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
