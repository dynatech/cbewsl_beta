import { StyleSheet } from 'react-native'
import { Dimensions } from 'react-native';

let { width } = Dimensions.get('window');
let { height } = Dimensions.get('window');

console.info(height)
const rassessment_styles = StyleSheet.create({ 
    container: {
        flex: 1
    },
    menuSection: {
        height: (height/2) + 10,
        marginLeft: 10,
        marginRight: 10,
        flex: 1
    },
    mapSection: {
        height: (height/2) + 10,
        marginLeft: 10,
        marginRight: 10
    },
    buttonSection: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    menuButton: {
        padding: 5,
        backgroundColor: '#083451',
        borderWidth: 2,
        borderColor: '#083451',
        marginLeft: 1,
        marginRight: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        width: (width/3)-10,
    },
    activeButton: {
        padding: 5,
        borderWidth: 2,
        borderColor: '#083451',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        width: (width/3)-10,
    },
    buttonText: {
        textAlign: 'center',
        alignContent: 'center',
        color: 'white'
    },
    buttonActiveText: {
        textAlign: 'center',
        alignContent: 'center',
        color: '#083451'     
    }

})

export { rassessment_styles }         
 