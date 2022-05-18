import React, { FunctionComponent } from 'react';
import { HStack, Stack, Flex, Text, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { coins } from '../../../../constants';
import { COINTYPE } from '../../../../store';

import { useStore, useExchangeRate} from '../../../../store';
import { floorNormalize, floor } from '../../../../Util';
const CircularView: FunctionComponent = (props) => {
  const { state, dispatch } = useStore();

  const history = state.amountHistory;
  const last = history.length - 1;

  let stableAmount = 0;
  let volatileAmount = 0;
  const coinPrices = useExchangeRate();
  
  coins.forEach(coin => {
    const rate = coinPrices[coin.name];
    const amount = (last >= 0 ? floor(history[last][`${coin.name}_amount`] * rate) : 0)+
      + floorNormalize(state.coin_total_rewards[coin.name] * rate);
    if(coin.stable) {
      stableAmount += amount;
    }
    else volatileAmount += amount;
  })

  const percent = stableAmount/volatileAmount * 100;

  return (
    <Flex transform={'rotate(90deg)'}>
      <CircularProgress
        value={percent}
        size={'172px'}
        capIsRound={true}
        color={'#F9D85E'}
        trackColor={'black'}
        thickness='14'
      >
      </CircularProgress>
    </Flex>
  );
}
export default CircularView;