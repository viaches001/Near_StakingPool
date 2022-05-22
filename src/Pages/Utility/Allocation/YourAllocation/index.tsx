import React, { FunctionComponent } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Tooltip, Center, Divider, Button } from '@chakra-ui/react'

import AnimationNumber from '../../../Components/AnimationNumber';
import Warning from '../../../../assets/Warning.svg'
import { OpenDepositModal, useStore } from '../../../../store';

const YourAllocation: FunctionComponent = (props) => {
  const {state, dispatch} = useStore();
  const farmInfo = state.farmInfo;
  const farmPrice = state.farmPrice;

  const value = Math.floor(farmInfo.amount * farmPrice / 100);
  return (
    <VStack w={'100%'} spacing={'20px'}>
      <HStack w={'100%'}>
        <Text
          fontSize={'20px'}
          fontWeight={'860'}
          lineHeight={'24px'}
        >
          YOUR CURRENT ALLOCATION VALUE
        </Text>
        <Tooltip 
          label="Your farmed tokens (x) the current price" 
          background={'#C4C4C4'} hasArrow 
          placement='top-start' 
          color={'black'}
        > 
          <Image src={Warning} w={'13px'}/>
        </Tooltip>
      </HStack>
      <HStack w={'100%'} align={'baseline'}>
        <Text
          fontSize={'35px'}
          fontWeight={'860'}
          lineHeight={'36px'}
        >
         <AnimationNumber value={value} />
        </Text>
        <Text
          fontSize={'25px'}
          fontWeight={'860'}
          lineHeight={'36px'}
        >
          USD
        </Text>
      </HStack>
    </VStack>
);
}
export default YourAllocation;