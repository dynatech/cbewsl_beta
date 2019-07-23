import { createAppContainer, createStackNavigator } from 'react-navigation';
import CurrentSituationReport from './current_situation_report';
import SaveSituationReport from './save_situation_report';
import SituationLogs from './situation_logs';

const SituationReport = createStackNavigator({
  current_situation_report: {
    screen: CurrentSituationReport,
    navigationOptions: {
      header: null
    }
  },
  situation_logs: {
    screen: SituationLogs,
    navigationOptions: {
      header: null
    }
  },
  save_situation_report: {
    screen: SaveSituationReport,
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
const Container = createAppContainer(SituationReport);

export default Container
