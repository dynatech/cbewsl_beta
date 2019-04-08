import { StyleSheet } from 'react-native'
  
const dashboard = StyleSheet.create({ 
    heading: {
        flex: 1,
        backgroundColor: 'blue'
    },
    menu: {
        flex: 7
    },
    menuContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    rowMenu: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    menuIcons: {
        width: 120,
        height: 120
    },
    iconText: {
        textAlign: 'center'
    },
    menuButtons: {
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center'
    }
})

export { dashboard }