/**
 * @format
 */

import {BaseGoerli} from '@thirdweb-dev/chains';
import {
  metamaskWallet,
  ThirdwebProvider,
  useAddress,
  useConnectionStatus,
  useContract,
  useContractEvents,
  useContractRead,
  useOwnedNFTs,
  Web3Button,
} from '@thirdweb-dev/react-native';
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Cats} from './src/components/Cats';
import {Events} from './src/components/Events';
import {Header} from './src/components/Header';
import {Welcome} from './src/components/Welcome';
import {EventContext} from './src/contexts/event-context';
import {GameContext} from './src/contexts/game-context';
import {CONTRACT_ADDR} from './src/utils/constants';

const activeChain = BaseGoerli;

const App = () => {
  return (
    <ThirdwebProvider
      theme="dark"
      autoConnect={true}
      dAppMeta={{
        name: 'Cat Attack',
        description: 'A simple game built with Thirdweb',
        url: 'https://github.com/thirdweb-example/catattacknft-react-native',
        logoUrl: 'https://thirdweb.com/favicon.ico',
      }}
      supportedWallets={[metamaskWallet()]}
      supportedChains={[activeChain]}
      activeChain={activeChain}>
      <AppInner />
    </ThirdwebProvider>
  );
};

const AppInner = () => {
  const [refreshing, setRefreshing] = useState(false);
  const address = useAddress();
  const connectionStatus = useConnectionStatus();

  const {contract} = useContract(CONTRACT_ADDR);

  const {data: nfts, refetch: refetchNFT} = useOwnedNFTs(contract, address);
  const {data: playerScore, refetch: refetchScore} = useContractRead(
    contract,
    'getScore',
    [address],
  );
  const eventsQuery = useContractEvents(contract, undefined, {
    queryFilter: {
      fromBlock: -50,
    },
  });
  const events = eventsQuery.data
    ?.filter(e => ['LevelUp', 'Miaowed'].includes(e.eventName))
    .slice(0, 20);

  const refetch = useCallback(async () => {
    refetchScore();
    refetchNFT();
  }, [refetchNFT, refetchScore]);

  const [targetAddress, setTargetAddress] = useState<string>('');

  // context
  const gameContext = {
    refetch: refetch,
    targetAddress,
    setTargetAddress,
    nfts: nfts || [],
    playerScore: playerScore?.toNumber() || 0,
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <GameContext.Provider value={gameContext}>
      <EventContext.Provider
        value={{
          events: events || [],
          isLoading: eventsQuery.isLoading,
        }}>
        <SafeAreaView style={styles.backgroundStyle}>
          <Header onRefresh={onRefresh} />
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                progressBackgroundColor={'#E173C7'}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mainScroll}>
            {!address && <Welcome />}
            {(connectionStatus === 'connecting' ||
              connectionStatus === 'unknown') && <ActivityIndicator />}
            {address ? (
              <>
                {nfts?.length ? (
                  <Cats />
                ) : (
                  <Web3Button
                    contractAddress={CONTRACT_ADDR}
                    action={contract_ => contract_?.call('claimKitten')}>
                    Claim Kitten
                  </Web3Button>
                )}
              </>
            ) : null}
            <Events />
          </ScrollView>
        </SafeAreaView>
      </EventContext.Provider>
    </GameContext.Provider>
  );
};

const styles = StyleSheet.create({
  mainScroll: {
    alignContent: 'center',
    alignItems: 'center',
  },
  backgroundStyle: {
    display: 'flex',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
});

export default App;
