import { StyleSheet } from 'react-native'
  
const login_styles = StyleSheet.create({ 
    heading: {
        fontSize: 25,
        textAlign: 'center',
        color: '#fff',
        zIndex: 2,
        marginBottom: 150,
    },
    inputs: {
        marginLeft: 50,
        marginRight: 50
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    background: {
        width: '100%', height: '100%'
    },
    inputBackDrop: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 40,
        paddingRight: 150,
        paddingBottom: 150,
        paddingTop: 75,
        paddingLeft: 250,
        marginLeft: 10,
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 0,
        opacity: 0.5
    }
})

export { login_styles }         
 