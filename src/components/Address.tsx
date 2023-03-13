import {shortenAddress} from '../utils/addresses';
import React, {useCallback} from 'react';
import {TextStyle, TouchableOpacity} from 'react-native';
import {StyleSheet, Text} from 'react-native/';
import {useAddress} from '@thirdweb-dev/react-core';

export const Address = ({
  address,
  style,
  onPress = () => {},
}: {
  address: string;
  style?: TextStyle;
  onPress?: (address: string) => void;
}) => {
  const currentAddress = useAddress();

  const onPress_ = useCallback(() => {
    onPress(address);
  }, [address, onPress]);

  return (
    <TouchableOpacity onPress={onPress_}>
      <Text style={{...styles.text, ...style}}>
        {currentAddress === address ? 'You' : shortenAddress(address)}
      </Text>
    </TouchableOpacity>
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
