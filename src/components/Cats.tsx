import React, {useContext, useMemo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {GameContext} from '../contexts/game-context';
import {Cat} from './Cat';
import {ClaimKittenButton} from './ClaimKittenButton';
import {ThirdwebNftMedia} from './ThirdwebNftMedia';

export const Cats = () => {
  const {nfts, playerScore} = useContext(GameContext);

  const {cats, badges} = useMemo(() => {
    return {
      cats: nfts.filter(nft => Number(nft.metadata.id) < 3),
      badges: nfts.filter(nft => Number(nft.metadata.id) > 2),
    };
  }, [nfts]);

  return (
    <>
      <Text style={styles.yourCats}>Your cats</Text>
      <View>
        <View style={styles.totalPointsContainer}>
          <Text style={styles.totalPoints}>Total points: </Text>
          <Text style={styles.totalPointsScore}>{playerScore}</Text>
        </View>
        <View style={styles.kills}>
          <Text style={styles.totalPoints}>Cats Destroyed: </Text>
          <Text style={styles.totalPointsScore}>{badges[0].quantityOwned}</Text>
        </View>
        {badges.length > 0 && (
          <View style={styles.kills}>
            {Array.apply(
              null,
              Array(Math.min(parseInt(badges[0].quantityOwned || '0', 10), 8)),
            ).map((v, i) => (
              <ThirdwebNftMedia
                key={badges[0].metadata.id + String(i)}
                metadata={badges[0].metadata}
                style={styles.nftRendererBadge}
              />
            ))}
          </View>
        )}
      </View>
      {cats.length > 0 ? (
        <ScrollView
          style={styles.scrollStyle}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainerStyle}>
          {cats?.map(cat => (
            <Cat key={cat.metadata.id} cat={cat} />
          ))}
        </ScrollView>
      ) : (
        <>
          <View style={styles.allDestroyed}>
            <Text style={styles.totalPoints}>
              All your cats have been destroyed!
            </Text>
            <Text style={styles.totalPointsScore}>
              Claim a new kitten to keep playing
            </Text>
          </View>
          <ClaimKittenButton />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  allDestroyed: {
    marginBottom: 5,
  },
  kills: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  scrollStyle: {width: '100%'},
  scrollContainerStyle: {
    flexGrow: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  nftRendererBadge: {
    width: 30,
    height: 30,
    marginLeft: 5,
  },
  totalPointsContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  yourCats: {
    fontSize: 40,
    lineHeight: 56,
    color: '#ECECEC',
    fontWeight: 'bold',
  },
  totalPoints: {
    fontWeight: '600',
    fontSize: 16,
    color: '#646D7A',
  },
  totalPointsScore: {
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
