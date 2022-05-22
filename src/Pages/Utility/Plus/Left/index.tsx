import React, { FunctionComponent } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Tooltip, Center, Divider, Button } from '@chakra-ui/react'
import AnimationNumber from '../../../Components/AnimationNumber';
import { MdInfoOutline } from 'react-icons/md';
import Warning from '../../../../assets/Warning.svg'
import { floorNormalize } from '../../../../Util';
import { OpenDepositModal, useStore, useExchangeRate } from '../../../../store';

const Left: FunctionComponent = (props) => {
  const {state, dispatch} = useStore();
  const ustAmount = state.potInfo.qualified_ust_amount;
  const lunaAmount = state.potInfo.qualified_luna_amount;
  const rate = useExchangeRate();
  const amount = floorNormalize(parseFloat(ustAmount) + parseFloat(lunaAmount) * rate);

  return (
    <Flex w={'100%'} direction="column">
      <HStack>
        <Text
          fontSize={'20px'}
          fontWeight={'860'}
          lineHeight={'24px'}
        >
          NEAR TREASURY REWARDS PLUS PROGRAM 
        </Text>
        <a href="link: https://app.gitbook.com/s/kngrjQ3XHOHWXNeVNLmt/tt-protocol/rewards" target={"_blank"} rel="noreferrer">
        <MdInfoOutline />
        </a>
      </HStack>
      <HStack w={'100%'} align={'baseline'} mt={'88px'}>
        <Text
          fontSize={'20px'}
          fontWeight={'860'}
          lineHeight={'24px'}
        >
          YOUR QUALIFIED DEPOSIT VALUE
        </Text>
        <Tooltip 
          label="All of your qualified deposits" 
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
           USD
        </Text>
      </HStack>
      <Button 
        w={'350px'} 
        mt={'29px'} 
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
          STAKE NOW
        </Text>
      </Button>
    </Flex>
);
}
export default Left;