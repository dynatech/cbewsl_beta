import { createAppContainer, createStackNavigator } from 'react-navigation';
import HazardData from './hazard_data';
import ModifyFamilyRisk from './modify_family_risk_profile';
import ModifyHazardData from './modify_hazard_data';
import ModifyResourceAndCapacities from './modify_rnc';
import ModifySummary from './modify_summary';
import ResourcesAndCapacities from './resources_and_capacities';
import SaveFamilyRiskProfile from './save_family_risk_profile';
import SaveHazardData from './save_hazard_data';
import SaveResourcesAndCapacities from './save_rnc';
import SaveSummary from './save_summary';
import Summary from './summary';

const RAssessmentStack = createStackNavigator({
  summary: {
    screen: Summary,
    navigationOptions: {
      header: null
    }
  },
  hazard_data: {
    screen: HazardData,
    navigationOptions: {
      header: null
    }
  },
  resources_and_capacities: {
    screen: ResourcesAndCapacities,
    navigationOptions: {
      header: null
    }
  },
  modify_summary: {
    screen: ModifySummary,
    navigationOptions: {
      header: null
    }
  },
  modify_family_risk: {
    screen: ModifyFamilyRisk,
    navigationOptions: {
      header: null
    }
  },
  modify_hazard_data: {
    screen: ModifyHazardData,
    navigationOptions: {
      header: null
    }
  },
  modify_rnc: {
    screen: ModifyResourceAndCapacities,
    navigationOptions: {
      header: null
    }
  },
  save_summary: {
    screen: SaveSummary,
    navigationOptions: {
      header: null
    }
  },
  save_family_risk_profile: {
    screen: SaveFamilyRiskProfile,
    navigationOptions: {
      header: null
    }
  },
  save_hazard_data: {
    screen: SaveHazardData,
    navigationOptions: {
      header: null
    }
  },
  save_rnc: {
    screen: SaveResourcesAndCapacities,
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
const Container = createAppContainer(RAssessmentStack);

export default Container
