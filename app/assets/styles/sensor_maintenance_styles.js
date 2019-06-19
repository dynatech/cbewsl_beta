import { StyleSheet } from 'react-native'
import { Dimensions } from 'react-native';

let { width } = Dimensions.get('window');
let { height } = Dimensions.get('window');

const sensor_maintenance_styles = StyleSheet.create({
    container: {
        flex: 1
    },
    menuSection: {
        marginLeft: 10,
        marginRight: 10,
        flex: 1
    },
    graphSection: {
        marginLeft: 10,
        marginRight: 10
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
        width: (width / 3) - 10,
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
        width: (width / 3) - 10,
    },
    buttonText: {
        textAlign: 'center',
        alignContent: 'center',
        color: 'white',
        fontSize: width * 0.035
    },
    buttonActiveText: {
        textAlign: 'center',
        alignContent: 'center',
        color: '#083451',
        fontSize: width * 0.035
    },
    contentContainer: {
        padding: 20
    },
    graphContainer: {
        padding: 20
    },
    subContainer: {
        padding: 10
    },
    rainfallGraphContainer: {
        borderTopWidth: 1,
        borderColor: '#083451',
        margin: 10,
        paddingTop: 10
    },
    datetimeContainer: {
        flexDirection: 'row',
        margin: width * 0.05
    },
    datetimeLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 5,
        marginRight: 10
    },
    button: {
        backgroundColor: '#083451',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#083451',
        marginTop: 10,
        marginBottom: 10,
        marginRight: 5,
        marginLeft: 5,
        width: 250
    }
})

export { sensor_maintenance_styles }
