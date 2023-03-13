import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import {NFT, TransactionError} from '@thirdweb-dev/sdk';
import {CONTRACT_ADDR} from '../utils/constants';
import {ThirdwebNftMedia} from './ThirdwebNftMedia';
import Modal from 'react-native-modal';
import {Events} from './Events';
import {ModalHeaderTextClose} from './ModalHeaderTextClose';
import {useSDK} from '@thirdweb-dev/react-core';
import {GameContext} from '../contexts/game-context';

type CatProps = {
  cat: NFT;
};

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
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const {refetch} = useContext(GameContext);

  const sdk = useSDK();

  const level = (Number(cat.metadata.id) + 1) as 1 | 2 | 3;

  const quantity = cat.quantityOwned;

  const openModal = useCallback(() => {
    setIsOpen(true);
    setError(undefined);
  }, [setIsOpen]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onActionButtonPress = useCallback(async () => {
    console.log('level', level);

    const contract = await sdk?.getContract(CONTRACT_ADDR);

    let promise = null;

    setIsLoading(true);
    if (level === 1) {
      if (!selectedAddress) {
        Alert.alert('Please enter a wallet address before taking an action.');
        return;
      }
      promise = contract?.erc1155.transfer(selectedAddress, 0, 1);
    } else if (level === 2) {
      promise = contract?.erc1155.burn(1, 1);
    } else if (level === 3) {
      if (!selectedAddress) {
        Alert.alert('Please enter a wallet address before taking an action.');
        return;
      }
      promise = contract?.call('attack', selectedAddress);
    }

    if (promise) {
      promise
        .then(() => {
          closeModal();
        })
        .catch(error_ => {
          console.log('error', error_);
          setError(error_);
        })
        .finally(() => {
          refetch();
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [closeModal, level, refetch, sdk, selectedAddress]);

  const onAddressSelected = (address: string) => {
    setSelectedAddress(address);
    setError(undefined);
  };

  const text = modalText[level];

  return (
    <>
      <Modal useNativeDriver isVisible={isOpen} backdropOpacity={1}>
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

          <TouchableOpacity style={styles.button} onPress={onActionButtonPress}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.actionButtonText}>
                {level === 1 && 'Transfer'}
                {level === 2 && 'Burn'}
                {level === 3 && 'Attack'}
              </Text>
            )}
          </TouchableOpacity>
          {error && (
            <Text style={styles.errorText}>
              {(error as TransactionError).reason}
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
    textAlign: 'left',
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
    height: 350,
    alignContent: 'center',
    alignItems: 'center',
  },
  modal: {
    display: 'flex',
    height: 500,
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
