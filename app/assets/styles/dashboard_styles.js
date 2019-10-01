import { StyleSheet } from 'react-native'
import {Dimensions} from 'react-native';
  
let {width} = Dimensions.get('window');
let {height} = Dimensions.get('window');

const dashboard = StyleSheet.create({
    menu: {
        flex: 3,
    },
    menulogo: {
        flexDirection: 'row',
        flex: 1,
        margin: (-1 *(height * 0.09)) ,
        justifyContent: 'center',
        paddingBottom: 100,
    },
    logo: {
        height: height * 0.15,
        width: height * 0.15,
        maxWidth: 100,
        maxHeight: 100,
        marginTop: height * 0.1
    },
    title: {
        alignItems: 'center',
        flex: 0.1
    },
    titleText: {
        fontSize: height * 0.025,
        color: '#083451',
        textAlign: 'center',
        fontWeight: '100'
    },
    menuContainer: {
        flex: 1
    },
    rowMenu: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        paddingTop: 10,
    },
    menuIcons: {
        width: width * 0.25,
        height: width * 0.25
    },
    menuButtons: {
        flex: 1,
        alignItems: 'center'
    },
    menuTexts: {
        textAlign: 'center',
        color: '#083451',
        fontWeight: 'bold'
    }
})

export { dashboard }