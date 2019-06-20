import { createAppContainer, createStackNavigator } from 'react-navigation';
import AlertValidation from './alert_validation';
import CurrentAlert from './current_alert';

const Ewi = createStackNavigator({
  current_alert: {
    screen: CurrentAlert,
    navigationOptions: {
      header: null
    }
  },
  alert_validation: {
    screen: AlertValidation,
    navigationOptions: {
      header: null
    }
  }
},{
  transitionConfig: () => ({
    transitionSpec: {
      duration: 0
    }
  })
});
const Container = createAppContainer(Ewi);

export default Container
