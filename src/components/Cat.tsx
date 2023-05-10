import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useContext, useMemo, useState} from 'react';
import {NFT, TransactionError} from '@thirdweb-dev/sdk';
import {CONTRACT_ADDR} from '../utils/constants';
import {ThirdwebNftMedia} from './ThirdwebNftMedia';
import Modal from 'react-native-modal';
import {Events} from './Events';
import {ModalHeaderTextClose} from './ModalHeaderTextClose';
import {GameContext} from '../contexts/game-context';
import {Web3Button} from '@thirdweb-dev/react-native';

type CatProps = {
  cat: NFT;
};

const DEVICE_WIDTH = Dimensions.get('window').width;
const MODAL_HEIGHT = Dimensions.get('window').height * 0.7;

const modalText = {
  1: {
    title: 'Send your cat to someone',
    description:
      'Enter their wallet address or select a current player to transfer your ',
    button: 'Send Kitten',
  },
  2: {
    title: 'Burn your cat!',
    description: 'Burn your Grumpy Cat',
    button: 'Burn Cat',
  },
  3: {
    title: 'Attack another cat!',
    description:
      'Enter their wallet address or select a current player to attack.',
    button: 'Attack Cat',
  },
};

export const Cat = ({cat}: CatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>();
  const [error, setError] = useState<Error | undefined>();

  const {refetch} = useContext(GameContext);

  const level = useMemo(() => {
    return (Number(cat.metadata.id) + 1) as 1 | 2 | 3;
  }, [cat.metadata.id]);

  const quantity = useMemo(() => {
    return cat.quantityOwned;
  }, [cat.quantityOwned]);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setError(undefined);
  }, [setIsOpen]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onAddressSelected = (address: string) => {
    setSelectedAddress(address);
    setError(undefined);
  };

  const text = useMemo(() => {
    return modalText[level];
  }, [level]);

  return (
    <>
      <Modal
        useNativeDriver
        hideModalContentWhileAnimating={true}
        isVisible={isOpen}
        backdropOpacity={0.9}>
        <View style={styles.modal}>
          <ModalHeaderTextClose
            onClose={closeModal}
            headerText={text.title}
            subHeaderText={text.description}
          />

          {(level === 1 || level === 3) && (
            <>
              <Text style={styles.walletAddrText}>Enter Wallet Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0x0..."
                value={selectedAddress}
              />

              <Text style={styles.walletAddrText}>
                Or select a current player
              </Text>
              <Text style={styles.subHeader}>
                Click on address to set it as your target
              </Text>
              <View style={styles.eventsContainer}>
                <Events
                  showHeader={false}
                  onAddressSelected={onAddressSelected}
                />
              </View>
            </>
          )}

          <Web3Button
            contractAddress={CONTRACT_ADDR}
            action={contract => {
              if (level === 1) {
                if (!selectedAddress) {
                  Alert.alert(
                    'Please enter a wallet address before taking an action.',
                  );
                  return Promise.reject();
                }
                return contract.erc1155.transfer(selectedAddress, 0, 1);
              }
              if (level === 2) {
                return contract.erc1155.burn(1, 1);
              }
              if (level === 3) {
                if (!selectedAddress) {
                  Alert.alert(
                    'Please enter a wallet address before taking an action.',
                  );
                  return Promise.reject();
                }
                return contract.call('attack', [selectedAddress]);
              }

              return Promise.resolve();
            }}
            onError={e => {
              console.log('error', e);
              setError(e);
            }}
            onSubmit={() => {
              setError(undefined);
            }}
            onSuccess={() => {
              closeModal();
              refetch();
              setError(undefined);
            }}>
            {level === 1
              ? 'Transfer'
              : level === 2
              ? 'Burn'
              : level === 3
              ? 'Attack'
              : null}
          </Web3Button>

          {error && (
            <Text style={styles.errorText}>
              {(error as TransactionError).reason
                ? (error as TransactionError).reason
                : (error as Error).message}
            </Text>
          )}
        </View>
      </Modal>

      <View style={styles.catContainer}>
        <View style={styles.nftRenderer}>
          {quantity && <Text style={styles.quantity}>x{quantity}</Text>}
          <ThirdwebNftMedia
            // eslint-disable-next-line react-native/no-inline-styles
            style={{width: 200, height: 170}}
            metadata={cat.metadata}
          />
        </View>
        <View style={styles.catData}>
          <Text style={styles.catLevel}>Level {level}</Text>
          <Text style={styles.catName}>{cat.metadata.name}</Text>
          <Text style={styles.catDescription} numberOfLines={3}>
            {cat.metadata.description}
          </Text>
          <TouchableOpacity style={styles.button} onPress={openModal}>
            <Text style={styles.actionButtonText}>
              {level === 1 && 'Transfer'}
              {level === 2 && 'Burn it'}
              {level === 3 && 'Attack'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
  },
  catContainer: {
    marginHorizontal: 1,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,
    color: '#646D7A',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#2C3035',
    padding: 5,
    textAlign: 'left',
    color: '#FFFFFF',
  },
  walletAddrText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    color: '#F1F1F1',
    marginTop: 10,
  },
  eventsContainer: {
    display: 'flex',
    flex: 0.9,
    alignContent: 'center',
    alignItems: 'center',
  },
  modal: {
    display: 'flex',
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: DEVICE_WIDTH,
    height: MODAL_HEIGHT,
    padding: 10,
  },
  actionButtonText: {
    color: '#0F1318',
    fontWeight: '600',
    fontSize: 16,
  },
  catLevel: {
    fontWeight: '700',
    fontSize: 12,
  },
  catName: {
    fontWeight: '700',
    fontSize: 21,
    textAlign: 'center',
    color: '#ECECEC',
    marginTop: 5,
  },
  catDescription: {
    marginTop: 5,
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    color: '#646D7A',
    height: 50,
  },
  catData: {
    width: 230,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: '#C339AC',
    borderWidth: 1,
    padding: 10,
  },
  button: {
    marginTop: 10,
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
  quantity: {
    position: 'absolute',
    top: 5,
    right: 5,
    color: '#FFFFFF',
  },
  nftRenderer: {
    width: 230,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderColor: '#C339AC',
    borderWidth: 1.5,
    padding: 5,
  },
});
