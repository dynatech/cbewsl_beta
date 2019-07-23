import { StyleSheet, Dimensions} from 'react-native'

let { width } = Dimensions.get('window');
let { height } = Dimensions.get('window');

const forgot_password_styles = StyleSheet.create({ 
    container: {
        flex: 1,
        alignContent:'center',
        margin: 20
    },
    texts: {
        textAlign: 'center',
        fontSize: width*0.04,
        marginTop: height*0.03,
        color: '#083451'
    }
})

export { forgot_password_styles }         
 