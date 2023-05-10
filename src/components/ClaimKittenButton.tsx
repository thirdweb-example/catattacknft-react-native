import {TransactionError, Web3Button} from '@thirdweb-dev/react-native';
import React, {useContext, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {CONTRACT_ADDR} from '../utils/constants';
import {GameContext} from '../contexts/game-context';

export const ClaimKittenButton = () => {
  const {refetch} = useContext(GameContext);
  const [error, setError] = useState<Error | null>(null);

  return (
    <>
      <Web3Button
        contractAddress={CONTRACT_ADDR}
        action={contract => {
          return contract?.call('claimKitten');
        }}
        onSuccess={() => {
          refetch();
        }}
        onError={err => {
          setError(err);
        }}
        onSubmit={() => setError(null)}>
        Claim Kitten
      </Web3Button>
      {error && (
        <Text style={styles.errorText}>
          {(error as TransactionError).reason
            ? (error as TransactionError).reason
            : error?.message}
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
