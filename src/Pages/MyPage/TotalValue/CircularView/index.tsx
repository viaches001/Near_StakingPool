import React, { FunctionComponent } from 'react';
import { HStack, Stack, Flex, Text, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { useUSTBalance, useUSTDeposited, useLUNADeposited, useStore, useExchangeRate } from '../../../../store';
import { floor, floorNormalize } from '../../../../Util';

const CircularView: FunctionComponent = (props) => {
  const { state, dispatch } = useStore();
  const rate = useExchangeRate();

  const ustBalance = useUSTBalance();
  const ustDeposited = useUSTDeposited() + floorNormalize(state.userInfoUst.reward_amount);
  const lunaDeposited = floor(useLUNADeposited() * rate) + floorNormalize(state.userInfoLuna.reward_amount * rate);
  const total = ustBalance + ustDeposited + lunaDeposited;

  const percent1 = Math.floor(ustBalance * 100 / total);
  const percent2 = Math.floor(ustDeposited * 100 / total);
  const percent3 = Math.floor(lunaDeposited * 100 / total);

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
      <CircularProgress
        position={'absolute'}
        value={percent3}
        size={'110px'}
        capIsRound={true}
        color={'#F9D85E'}
        trackColor={'black'}
        thickness='15px'
      />
    </Flex>
  );
}
export default CircularView;