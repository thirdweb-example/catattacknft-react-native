import {TransactionError, Web3Button} from '@thirdweb-dev/react-native';
import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {CONTRACT_ADDR} from '../utils/constants';

export const ClaimKittenButton = () => {
  const [error, setError] = useState<Error | null>(null);

  return (
    <>
      <Web3Button
        contractAddress={CONTRACT_ADDR}
        action={contract => {
          contract?.call('claimKitten');
        }}
        onError={err => {
          setError(err);
        }}
        onSubmit={() => setError(null)}>
        Claim Kitten
      </Web3Button>
      {error && (
        <Text style={styles.errorText}>
          {(error as TransactionError).reason}
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  errorText: {
    marginTop: 3,
    color: 'red',
  },
});
