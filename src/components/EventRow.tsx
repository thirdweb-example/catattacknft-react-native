import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Address} from './Address';
import LevelName from './LevelName';
import {getImageUrl} from '../utils/events';

export type EventProps = {
  type: 'LevelUp' | 'Miaowed';
  data: Record<string, any>;
  onAddressPress?: (address: string) => void;
};

export const EventRow = ({type, data, onAddressPress}: EventProps) => {
  const level = data.level.toNumber() as 1 | 2 | 3;

  const imageUrl = getImageUrl(type, level);

  return (
    <View style={styles.row}>
      <Image style={styles.image} source={imageUrl} />

      <View style={styles.textContent}>
        {type === 'LevelUp' && (
          <TouchableOpacity
            style={styles.textContent}
            onPress={() => onAddressPress?.(data.account)}>
            <Address style={styles.address} address={data.account} />
            <View style={styles.eventContainer}>
              <Text style={styles.eventText}>
                {level === 1 ? 'claimed a' : 'leveled up to'}{' '}
              </Text>
              <LevelName level={level} />
            </View>
          </TouchableOpacity>
        )}
        {type === 'Miaowed' && (
          <TouchableOpacity
            style={styles.textContent}
            onPress={() => onAddressPress?.(data.attacker)}>
            <Address style={styles.address} address={data.attacker} />

            <View style={styles.eventContainer}>
              <Text style={styles.eventText}>{'destroyed '} </Text>
              <Address style={styles.address} address={`${data.victim} `} />
              <LevelName level={level} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  eventText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  textContent: {
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  row: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#646D7A',
    maxWidth: 350,
    marginTop: 5,
  },
  address: {
    fontWeight: '600',
    fontSize: 16,
    color: '#646D7A',
  },
  image: {
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    width: 60,
    height: 60,
  },
});
