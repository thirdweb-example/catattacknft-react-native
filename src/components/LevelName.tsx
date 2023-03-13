import {StyleSheet, Text} from 'react-native';
import React from 'react';

type LevelNameProps = {
  level: 1 | 2 | 3;
};

const LevelName = ({level}: LevelNameProps) => {
  switch (level) {
    case 1:
      return <Text style={styles.eventText}>🐱 Small Kitten</Text>;
    case 2:
      return <Text style={styles.eventText}>😾 Grumpy Cat</Text>;
    case 3:
      return <Text style={styles.eventText}>🥷 Ninja Cat</Text>;
  }
};

const styles = StyleSheet.create({
  eventText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default LevelName;
