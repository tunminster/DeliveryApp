import React, {Component} from 'react';
import {View, ActivityIndicator, Modal} from 'react-native';
import vars from '../../utils/vars';
import styles from './styles';

class FullScreenLoader extends Component {
    
    render() {
        const { loading } = this.props;
        return (
            <Modal
              transparent={true}
              animationType={'none'}
              visible={loading}
              onRequestClose={() => { console.log('close modal') }}>
              <View style={styles.loaderBackground}>
                <ActivityIndicator
                  animating={loading} size="large" color='#000000' />
              </View>
            </Modal>
        )
    }
}

export default FullScreenLoader;