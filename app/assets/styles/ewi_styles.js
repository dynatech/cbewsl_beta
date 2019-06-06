import { StyleSheet } from 'react-native'
import { Dimensions } from 'react-native';

let { width } = Dimensions.get('window');
let { height } = Dimensions.get('window');

const ewi_styles = StyleSheet.create({ 
    container: {
        flex: 1
    },
    menuContainer: {
        flex: 1,
        margin: 20,
        textAlign: 'center',
        justifyContent: 'center'
    },
    menuSection: {
        marginLeft: 10,
        marginRight: 10,
        flex: 1
    },
    buttonSection: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    menuButton: {
        padding: 10,
        backgroundColor: '#083451',
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderColor: '#083451',
        marginLeft: 1,
        marginRight: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        width: (width/2)-10,
    },
    activeButton: {
        padding: 10,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderColor: '#083451',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        width: (width/2)-10,
    },
    buttonText: {
        textAlign: 'center',
        alignContent: 'center',
        color: 'white',
        fontSize: width*0.035
    },
    buttonActiveText: {
        textAlign: 'center',
        alignContent: 'center',
        color: '#083451',
        fontSize: width*0.035
    }

})

export { ewi_styles }         
 