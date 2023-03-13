import {Image, StyleSheet} from 'react-native';
import React from 'react';
import {ConnectWallet} from '@thirdweb-dev/react-native';

export const Welcome = () => {
  return (
    <>
      <Image
        style={styles.welcomeIcon}
        resizeMode="contain"
        source={require('../assets/welcome.png')}
      />
      <Image
        style={styles.catsIntro}
        resizeMode="contain"
        source={require('../assets/catsintro.png')}
      />
      <ConnectWallet />
    </>
  );
};

const styles = StyleSheet.create({
  welcomeIcon: {
    height: 55,
    width: '80%',
  },
  catsIntro: {
    height: 250,
    width: 250,
  },
});
