import React, { FunctionComponent } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Tooltip, Center, Divider, Button } from '@chakra-ui/react'
import Warning from '../../../../assets/Warning.svg'
import AnimationNumber from '../../../Components/AnimationNumber';
import { OpenDepositModal, useStore } from '../../../../store';

const YourFarmed: FunctionComponent = (props) => {
  const {state, dispatch} = useStore();
  const farmInfo = state.farmInfo;
  const amount = farmInfo.amount/10 ** 4;

  return (
    <VStack w={'100%'} spacing={'12px'}>
      <HStack w={'100%'}>
        <Text
          fontSize={'20px'}
          fontWeight={'860'}
          lineHeight={'24px'}
        >
          YOUR FARMED NearT TOKENS
        </Text>
        <Tooltip 
          label="Recalculated once a day" 
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
         <AnimationNumber value={amount} />
        </Text>
        <Text
          fontSize={'25px'}
          fontWeight={'860'}
          lineHeight={'36px'}
        >
          NearT
        </Text>
      </HStack>
    </VStack>
);
}
export default YourFarmed;