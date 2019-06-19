import { StyleSheet } from 'react-native'
import { Dimensions } from 'react-native';

let { width } = Dimensions.get('window');
let { height } = Dimensions.get('window');

const login_styles = StyleSheet.create({ 
    heading: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
    },
    headingText: {
        fontSize: 23,
        textAlign: 'center',
        color: '#fff'
    },
    inputs: {
        marginLeft: 50,
        marginRight: 50
    },
    container: {
        flex: 1
    },
    background: {
        width: '100%', height: '100%'
    },
    inputBackDrop: {
        backgroundColor: '#fff',
        borderWidth: 3,
        borderRadius: 30,
        paddingTop: height * 0.2,
        paddingBottom: height * 0.2,
        paddingRight: width * 0.45,
        paddingLeft: width * 0.45,
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 0,
        opacity: 0.5
    },
    inputContainer: {
        flex: 1,
        paddingTop: height * 0.05,
        position: 'relative'
    },
    menulogo: {
        flexDirection: 'row',
        margin: (-1 *(height * 0.09)) ,
        justifyContent: 'center',
        paddingBottom: height * 0.15,   
    },
    logo: {
        height: height * 0.15,
        width: height * 0.15,
        maxWidth: 100,
        maxHeight: 100,
        marginTop: height * 0.1
    }
})

export { login_styles }         
 