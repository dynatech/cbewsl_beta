import React, { Component } from 'react';
import { Text, View, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { dashboard } from '../../assets/styles/dashboard_styles'
import { createDrawerNavigator, createAppContainer, DrawerItems } from 'react-navigation'
import Contacts from '../Dashboard/side_menu/contacts'
import AboutTheApp from '../Dashboard/side_menu/about_the_app'
import Logout from '../Dashboard/side_menu/logout'
import MainDashboard from './main_dashboard'
import DataSyncer from '../Dashboard/side_menu/data_sync'
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
  // icon_index: {
  //   screen: SearchIcon,
  //   navigationOptions: {
  //     drawerLabel: "Icon referrence"
  //   }
  // },
  logout: {
    screen: Logout,
    navigationOptions: {
      drawerLabel: "Logout"
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