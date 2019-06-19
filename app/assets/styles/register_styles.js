import { StyleSheet, Dimensions} from 'react-native'

let { width } = Dimensions.get('window');
let { height } = Dimensions.get('window');

const register_styles = StyleSheet.create({ 
    container: {
        flex: 1,
        // backgroundColor: 'red'
    }
})

export { register_styles }         
 