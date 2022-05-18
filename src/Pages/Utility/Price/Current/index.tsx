import React, { FunctionComponent } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Link, Center, Tooltip, Button } from '@chakra-ui/react'
import { MdInfoOutline } from 'react-icons/md';
import AnimationNumber from '../../../Components/AnimationNumber';
import Warning from '../../../../assets/Warning.svg'
import { OpenDepositModal, useStore } from '../../../../store';

const CurrentPrice: FunctionComponent = (props) => {
  const {state, dispatch} = useStore();
  const price = state.farmPrice/100;

  return (
    <Flex w={'100%'} direction="column">
      <HStack>
        <Text
          fontSize={'20px'}
          fontWeight={'860'}
          lineHeight={'24px'}
        >
          CURRENT NearT PRICE 
        </Text>
        <Tooltip 
          label="The price is recalculated once a day" 
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
          <AnimationNumber value={price} />
        </Text>
        <Text
          fontSize={'25px'}
          fontWeight={'860'}
          lineHeight={'36px'}
        >
          USD
        </Text>
      </HStack>
      <Button 
        w={'350px'} 
        mt={'40px'} 
        h={'45px'} 
        background={'#493C3C'} 
        rounded={'25px'}
        onClick = {() => OpenDepositModal(state, dispatch, "usdc")}
      >
        <Text
          fontSize={'13px'}
          fontWeight={'860'}
          lineHeight={'15px'}
        >
          STAKE NOW & GET FREE NearT 
        </Text>
      </Button>
    </Flex>
);
}
export default CurrentPrice;