import { createAppContainer, createStackNavigator } from 'react-navigation';
import MaintenanceLogs from './maintenance_logs';
import SaveMaintenanceLogs from './save_maintenance_logs';
import SensorStatus from './sensor_status';
import Summary from './summary';

const SensorMaintenance = createStackNavigator({
  summary: {
    screen: Summary,
    navigationOptions: {
      header: null
    }
  },
  sensor_status: {
    screen: SensorStatus,
    navigationOptions: {
      header: null
    }
  },
  maintenance_logs: {
    screen: MaintenanceLogs,
    navigationOptions: {
      header: null
    }
  },
  save_maintenance_logs: {
    screen: SaveMaintenanceLogs,
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
