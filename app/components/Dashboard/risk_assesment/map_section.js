import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Dimensions } from 'react-native';

export default class MapSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModelVisible: false,
    };
  }

  ShowModalFunction() {
    this.setState({isModelVisible: true})
  }

  HideModalFunction() {
    this.setState({isModelVisible: false})
  }

  render() {
    const images = [{
      props: {
          source: require('../../../assets/images/umi_map.jpg')
      }
    }];

    let { width } = Dimensions.get('window');
    let { height } = Dimensions.get('window');

    return (
      <View>
        <TouchableOpacity onPress={() => {this.ShowModalFunction()}}>
          <Image style={{width: width * 0.94, height: width * 0.94}} source={require('../../../assets/images/umi_map.jpg')}
          ></Image>
        </TouchableOpacity>
        <Modal visible={this.state.isModelVisible} 
          transparent={true}>
            <ImageViewer imageUrls={images} enableSwipeDown={true} onSwipeDown={() => {this.HideModalFunction()}}/>
        </Modal>
      </View>
    );
  }
}