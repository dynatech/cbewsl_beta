import { StyleSheet } from 'react-native'
  
const dashboard = StyleSheet.create({
    menu: {
        flex: 3,
    },
    heading: {
        flex: 1,
        padding: 15,
    },
    menulogo: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center'
    },
    logo: {
        height: 80,
        width: 80,
        marginTop: 30
    },
    title: {
        alignItems: 'center'
    },
    titleText: {
        fontSize: 20,
        color: '#083451',
        textAlign: 'center',
        fontWeight: '100',
        paddingTop: 130,
    },
    menuContainer: {
        flex: 1
    },
    rowMenu: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    menuIcons: {
        width: 100,
        height: 100
    },
    menuButtons: {
        flexWrap: 'wrap',
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