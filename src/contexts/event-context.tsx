import {ContractEvent} from '@thirdweb-dev/sdk';
import {createContext} from 'react';

type EventContextType = {
  events: ContractEvent[];
  isLoading: boolean;
};

export const EventContext = createContext<EventContextType>({
  events: [],
  isLoading: true,
});
