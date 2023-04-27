import {shortenAddress} from '../utils/addresses';
import React from 'react';
import {TextStyle} from 'react-native';
import {StyleSheet, Text} from 'react-native/';
import {useAddress} from '@thirdweb-dev/react-core';

export const Address = ({
  address,
  style,
}: {
  address: string;
  style?: TextStyle;
}) => {
  const currentAddress = useAddress();

  return (
    <Text style={{...styles.text, ...style}}>
      {currentAddress === address ? 'You' : shortenAddress(address)}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#F1F1F1',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
  },
});
