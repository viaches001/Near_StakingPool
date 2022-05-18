import React, { FunctionComponent } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Link, Center, Divider, Button } from '@chakra-ui/react'
import AnimationNumber from '../../../Components/AnimationNumber';
import {  useStore } from '../../../../store';

interface Props{
  amount: string,
}
const Expected: FunctionComponent<Props> = ({amount}) => {
  const {state, dispatch} = useStore();
  const total = parseInt(amount);
  const dayReward = total/1000*24;
  
  const remain = 60 - Math.floor((Date.now() / 1000 - state.farmStartTime) / 60 / 60 / 24);
  const expected = Math.floor(dayReward * remain);
  const expectedUSD = Math.floor(expected * 1.25);

  return (
    <Flex w={'100%'} h={'100%'} direction="column" align={'baseline'}>
      <Text
        fontSize={'20px'}
        fontWeight={'860'}
        lineHeight={'30px'}
      >
        <AnimationNumber value={expected} />
      </Text>
      <Divider orientation='horizontal' />
      <Text
        fontSize={'9px'}
        fontWeight={'860'}
        lineHeight={'20px'}
      >
        Your expected TerraT Allocation 
      </Text>
      <Text
        mt={'40px'}
        position={'absolute'}
        fontSize={'9px'}
        fontWeight={'860'}
        lineHeight={'36px'}
        fontStyle={'italic'}
        color={'#CEBFBF'}
      >
        The Projected Allocation Value: {expectedUSD.toLocaleString()}UST 
      </Text>
    </Flex>
  );
}
export default Expected;