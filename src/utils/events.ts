import {EventProps} from '../components/EventRow';

export function isOwnEvent(
  event: EventProps,
  address: string | undefined,
): boolean {
  const {type, data} = event;
  return (
    (type === 'LevelUp' && data.account === address) ||
    (type === 'Miaowed' &&
      (data.victim === address || data.attacker === address))
  );
}

export function getImageUrl(type: EventProps['type'], level: number) {
  if (type === 'LevelUp') {
    switch (level) {
      case 1:
        return require('../assets/LevelUp_1.png');
      case 2:
        return require('../assets/LevelUp_2.png');
      case 3:
        return require('../assets/LevelUp_3.png');
    }
  } else {
    return require('../assets/Miaowed.png');
  }
}
