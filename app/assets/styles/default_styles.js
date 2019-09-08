import { StyleSheet, Dimensions } from 'react-native'

let { width } = Dimensions.get('window');
let { height } = Dimensions.get('window');

const defaults = StyleSheet.create({
  inputs: {
    borderWidth: 3,
    borderBottomColor: '#083451',
    borderTopColor: '#083451',
    borderLeftColor: '#083451',
    borderRightColor: '#083451',
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 3,
    marginBottom: 3,
    paddingLeft: 15,
    paddingRight: 15,
    color: '#000'
  },
  datetimepicker: {
    borderBottomWidth: 3,
    borderBottomColor: '#083451',
    marginLeft: 10,
    marginRight: 10,
  },
  touchableButtons: {
    backgroundColor: '#083451',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#083451',
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25
  },
  touchableTexts: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10
  },
  heading: {
    flex: 1,
    padding: 10,
    color: '#083451'
  },
  container: {
    flex: 1
  },
  isScreenActive: {
    backgroundColor: 'white',
    color: '#083451'
  },
  accounts: {
    marginRight: width * 0.3,
    marginLeft: width * 0.3
  },
  accountsText: {
    textAlign: 'center',
    color: '#083451'
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
    width: width * 0.4
  },
  button_error: {
    backgroundColor: 'red',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#083451',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 5,
    marginLeft: 5,
    width: width * 0.4
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    padding: 5
  }
})
export { defaults }
