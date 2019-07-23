import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { createAppContainer, createDrawerNavigator, DrawerItems } from 'react-navigation';
import AboutTheApp from '../Dashboard/side_menu/about_the_app';
import Contacts from '../Dashboard/side_menu/contacts';
import DataSyncer from '../Dashboard/side_menu/data_sync';
import Logout from '../Dashboard/side_menu/logout';
import MainDashboard from './main_dashboard';
import SearchIcon from '../Dashboard/side_menu/search_icon'

const CustomDrawerComponent = (props) => (
  <SafeAreaView>
    <ScrollView>
      <DrawerItems {...props} />
    </ScrollView>
  </SafeAreaView>
)

const AppDrawerNavigator = createDrawerNavigator({
  Dashboard: MainDashboard,
  Contacts: Contacts,
  about: {
    screen: AboutTheApp,
    navigationOptions: {
      drawerLabel: "About the app",
      title: "About the App"
    }
  },
  data_sync: {
    screen: DataSyncer,
    navigationOptions: {
      drawerLabel: "Data Synchronization"
    }
  },
  logout: {
    screen: Logout,
    navigationOptions: {
      drawerLabel: "Logout"
    }
  },
  icon: {
    screen: SearchIcon,
    navigationOptions: {
      drawerLabel: "Icon"
    }
  }
}, {
    contentComponent: CustomDrawerComponent,
    drawerBackgroundColor: '#083451',
    contentOptions: {
      activeBackgroundColor: 'white',
      inactiveTintColor: 'white',
    }
  })

const Landing = createAppContainer(AppDrawerNavigator);
export default Landing;