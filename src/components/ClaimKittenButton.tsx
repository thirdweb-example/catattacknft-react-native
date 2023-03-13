import {useContract, useSDK} from '@thirdweb-dev/react-core';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {CONTRACT_ADDR} from '../utils/constants';

export const ClaimKittenButton = () => {
  const sdk = useSDK();

  const onConnectPress = async () => {
    const contract = await sdk?.getContract(CONTRACT_ADDR);
    contract?.call('claimKitten');
  };
  return (
    <TouchableOpacity
      style={styles.connectWalletButton}
      onPress={onConnectPress}>
      <Text style={styles.darkText}>Claim Kitten</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  connectWalletView: {
    height: '50',
    minWidth: '200px',
    width: '100%',
  },
  darkText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  connectWalletButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
});
