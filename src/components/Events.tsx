import {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import {EventContext} from '../contexts/event-context';
import React from 'react';
import {EventProps, EventRow} from './EventRow';

export const Events = ({
  showHeader = true,
  onAddressSelected = () => {},
}: {
  showHeader?: boolean;
  onAddressSelected?: (address: string) => void;
}) => {
  const {events, isLoading} = useContext(EventContext);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      onAddressSelected(address);
    }
  }, [address, onAddressSelected]);

  return (
    <>
      {showHeader && (
        <Image
          style={styles.gameEvents}
          resizeMode="contain"
          source={require('../assets/gameevents.png')}
        />
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator />
        ) : events?.length > 0 ? (
          events?.map(e => (
            <EventRow
              key={`${e.transaction.transactionHash}_${e.transaction.logIndex}`}
              type={e.eventName as EventProps['type']}
              data={e.data}
              onAddressPress={address_ => setAddress(address_)}
            />
          ))
        ) : (
          <Text>No Events</Text>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  gameEvents: {
    marginTop: 15,
    marginBottom: 15,
  },
});
