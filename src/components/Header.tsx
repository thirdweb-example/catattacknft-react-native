import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ConnectWallet, useSDK} from '@thirdweb-dev/react-native';

export const Header = ({onRefresh}: {onRefresh: () => void}) => {
  const onTest = () => {
    onRefresh();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onTest}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require('../assets/logo.png')}
        />
      </TouchableOpacity>
      <ConnectWallet />
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 50,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
});
