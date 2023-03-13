import {ConnectWallet} from '@thirdweb-dev/react-native';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {ClaimKittenButton} from './ClaimKittenButton';

const ClaimKitten = () => {
  return (
    <View style={styles.claimKittenContainer}>
      <Image
        style={styles.claimKitten}
        resizeMode="stretch"
        source={require('../assets/claimkitten.png')}
      />
      <Image
        style={styles.catsIntro}
        resizeMode="contain"
        source={require('../assets/catsintro.png')}
      />
      <ClaimKittenButton />
    </View>
  );
};

const styles = StyleSheet.create({
  claimKittenContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  claimKitten: {
    height: 65,
    width: 250,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  catsIntro: {
    height: 250,
    width: 250,
  },
});

export default ClaimKitten;
