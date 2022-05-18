import React, { FunctionComponent } from 'react';
import { HStack, Stack, Flex, Text, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'

import { useStore, useExchangeRate} from '../../../../store';
import { floorNormalize, floor } from '../../../../Util';
const CircularView: FunctionComponent = (props) => {
  const { state, dispatch } = useStore();
  const rate = useExchangeRate();

  const history = state.amountHistory;
  const last = history.length - 1;
  // const ustAmount = (last >= 0 ? history[last].ust_amount : 0 )+
  //               + floorNormalize(state.ust_total_rewards);
  // const lunaAmount = (last >= 0 ? floor(history[last].luna_amount * rate) : 0)+
  //               + floorNormalize(state.luna_total_rewards * rate);
                
  // const percent = ustAmount + lunaAmount > 0 ? lunaAmount * 100 / (ustAmount + lunaAmount) : 0;

  const stableAmount = 40859532875;
  const volatileAmount = 80569902875;
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