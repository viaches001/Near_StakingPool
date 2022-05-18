import React, { FunctionComponent } from 'react';
import {
  VStack,
  HStack,
  Text,
} from '@chakra-ui/react'

import { useStore, useExchangeRate } from '../../../store';

interface Props {
  amount: string
}
const Info: FunctionComponent<Props> = ({ amount }) => {
  const { state, dispatch } = useStore();
  const rate = useExchangeRate();
  const fee = 0.25;

  let _amount = parseFloat(amount) > 0? parseFloat(amount) : 0;
  const value = state.coinType == 'usdc' ? _amount + fee : _amount * rate + fee;

  return (
    <VStack
      w={'100%'}
      mt={'11px'}
      align={'center'}
      spacing={'13px'}
      color={'#CEC0C0'}
    >
      <HStack justify={'space-between'} w={'100%'}>
        <Text
          fontSize={'9px'}
          fontWeight={'400'}
          lineHeight={'10px'}
        >
          Tx Fee
        </Text>
        <Text
          fontSize={'9px'}
          fontWeight={'400'}
          lineHeight={'10px'}
        >
          0.25 UST
        </Text>
      </HStack>
      <HStack justify={'space-between'} w={'100%'}>
        <Text
          fontSize={'9px'}
          fontWeight={'400'}
          lineHeight={'10px'}
        >
          Send Amount
        </Text>
        <Text
          fontSize={'9px'}
          fontWeight={'400'}
          lineHeight={'10px'}
        >
          {value.toLocaleString()} UST
        </Text>
      </HStack>
    </VStack>
  );
}
export default Info;