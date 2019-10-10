import { createAppContainer, createStackNavigator } from 'react-navigation';
import CurrentMeasurement from './current_measurement';
import MonitoringLogs from './monitoring_logs.js';
import SaveSurficialData from './save_surficial_data';
import Summary from './summary';
import RaiseMoms from './raise_moms';

const SensorMaintenance = createStackNavigator({
  summary: {
    screen: Summary,
    navigationOptions: {
      header: null
    }
  },
  current_measurement: {
    screen: CurrentMeasurement,
    navigationOptions: {
      header: null
    }
  },
  monitoring_logs: {
    screen: MonitoringLogs,
    navigationOptions: {
      header: null
    }
  },
  save_surficial_data: {
    screen: SaveSurficialData,
    navigationOptions: {
      header: null
    }
  },
  raise_moms: {
    screen: RaiseMoms,
    navigationOptions: {
      header: null
    }
  }
}, {
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0
      }
    })
  });
const Container = createAppContainer(SensorMaintenance);

export default Container
