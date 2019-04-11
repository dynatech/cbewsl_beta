import React, { Component } from 'react';
import { Text, SafeAreaView, ScrollView, Dimensions} from 'react-native';
import { dashboard } from '../../assets/styles/dashboard_styles'
import { createDrawerNavigator , createAppContainer, DrawerItems} from 'react-navigation'
import Contacts from '../Dashboard/side_menu/contacts'
import Settings from '../Dashboard/side_menu/settings'
import AboutTheApp from '../Dashboard/side_menu/about_the_app'
import Logout from '../Dashboard/side_menu/logout'
import MainDashboard from './main_dashboard'

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
  Settings: Settings,
  about: {
    screen: AboutTheApp,
      navigationOptions: {
        drawerLabel: "About the app"
      }
  },
  logout: {
    screen: Logout,
      navigationOptions: {
        drawerLabel: "Logout"
      }
  }
}, {
  contentComponent: CustomDrawerComponent
})

const Landing = createAppContainer(AppDrawerNavigator);
export default Landing;