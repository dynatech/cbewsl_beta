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
        marginLeft: 10,
        marginRight: 10,
        flex: 1
    },
    tableContainer: {
        marginBottom: 20
    },
    mapSection: {
        marginLeft: 10,
        marginRight: 10
    },
    buttonSection: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    menuButton: {
        padding: 6,
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
        width: (width/3)-10,
    },
    subMenuButton: {
        padding: 6,
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
        padding: 6,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderColor: '#083451',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        width: (width/3)-10,
    },
    subActiveButton: {
        padding: 6,
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

export { rassessment_styles }         
 