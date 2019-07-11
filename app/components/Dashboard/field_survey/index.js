import { createAppContainer, createStackNavigator } from 'react-navigation';
import FieldSurveyLogs from './field_survey_logs';
import LatestReportSummary from './latest_report_summary';
import SaveFieldSurveyLogs from './save_field_survey_logs';

const FieldSurveyStack = createStackNavigator({
  latest_report_summary: {
    screen: LatestReportSummary,
    navigationOptions: {
      header: null
    }
  },
  field_survery_logs: {
    screen: FieldSurveyLogs,
    navigationOptions: {
      header: null
    }
  },
  save_field_survey_logs: {
    screen: SaveFieldSurveyLogs,
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
const Container = createAppContainer(FieldSurveyStack);

export default Container
