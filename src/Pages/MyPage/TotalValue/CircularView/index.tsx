import React, { FunctionComponent } from 'react';
import { HStack, Stack, Flex, Text, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { useCoinDeposited, useStore, useExchangeRate } from '../../../../store';
import { floor, floorNormalize } from '../../../../Util';
import { coins } from '../../../../constants';

const CircularView: FunctionComponent = (props) => {
  const { state, dispatch } = useStore();
  const rates = useExchangeRate();
  const coinDeposited = useCoinDeposited();

  let stableDeposited = 0;
  let volatileDeposited = 0;
  coins.forEach(coin => {
    const rate = rates[coin.name];
    const amount = floor(coinDeposited[coin.name] * rates[coin.name]) + floorNormalize(state.userInfoCoin[coin.name].reward_amount * rate);
    if(coin.stable) {
      stableDeposited += amount;
    }
    else volatileDeposited += amount;
  })
  const total = stableDeposited + volatileDeposited;

  const percent1 = Math.floor(stableDeposited * 100 / total);
  const percent2 = Math.floor(volatileDeposited * 100 / total);

  return (
    <Flex align={'center'} minWidth={'220px'} h={'220px'} justify='center' transform={'rotate(-90deg)'} mr={'36px'}>
      <CircularProgress
        position={'absolute'}
        value={percent1}
        size={'220px'}
        capIsRound={true}
        color={'#F72585'}
        trackColor={'#493C3C'}
        thickness='8px'
      />
      <CircularProgress
        position={'absolute'}
        value={percent2}
        size={'165px'}
        capIsRound={true}
        color={'#6493F1'}
        trackColor={'black'}
        // thickness='12px'
      />
      {/* <CircularProgress
        position={'absolute'}
        value={percent3}
        size={'110px'}
        capIsRound={true}
        color={'#F9D85E'}
        trackColor={'black'}
        thickness='15px'
      /> */}
    </Flex>
  );
}
export default CircularView;