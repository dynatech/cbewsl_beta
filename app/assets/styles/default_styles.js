import { StyleSheet } from 'react-native'
  
const defaults = StyleSheet.create({ 
  inputs: {
    borderBottomWidth: 3,
    borderBottomColor: '#083451',
    marginLeft: 10,
    marginRight: 10,
    color: '#000'
  },
  touchableButtons: {
    backgroundColor: '#083451',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#083451',
    margin: 25
  },
  touchableTexts: {
    color: 'white',
    textAlign:'center',
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
  }
})
export { defaults }         
 