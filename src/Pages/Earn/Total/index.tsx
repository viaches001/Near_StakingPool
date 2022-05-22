import React, { FunctionComponent } from 'react';
import { VStack, Stack, Text, Divider, HStack, Image, Flex, Button, Tooltip } from '@chakra-ui/react'

import Warning from "./../../../assets/Warning.svg"
import { 
  OpenDepositModal, 
  OpenWithdrawModal, 
  useStore, 
  useCoinDeposited, 
  useExchangeRate
} from '../../../store';
import AnimationNumber from '../../Components/AnimationNumber';
import { floorNormalize } from '../../../Util';
import { coins } from '../../../constants';

const Total: FunctionComponent = (props) => {
  const {state, dispatch} = useStore();
  const rates = useExchangeRate();
  const coinDeposited = useCoinDeposited();

  let total = 0;
  coins.forEach(coin => {
    const deposited = coinDeposited[coin.name] * rates[coin.name] + floorNormalize(state.userInfoCoin[coin.name].reward_amount * rates[coin.name]);
    total += deposited;
  })

  return (
    <VStack 
      w={'100%'}
      rounded={'25px'} 
      background={'#212121'} 
      align={'center'}
      spacing={'64px'}
      px={{sm:'10px', md:'20px', lg:'50px'}}
      py={{sm:'10px', md:'20px', lg:'56px'}}
    >
      <VStack w={'100%'} align={'baseline'}>
        <HStack spacing={'10px'}>
          <Text
            fontSize={'20px'}
            fontWeight={'860'}
            lineHeight={'24px'}
          >
            TOTAL BALANCE
          </Text>
          <Tooltip 
            label="Total value of your all deposits including earnings calculated in UST" 
            background={'#C4C4C4'} hasArrow 
            placement='top-start' 
            color={'black'}
          > 
            <Image src={Warning} w={'13px'}/>
          </Tooltip>
        </HStack>
        <HStack align={'baseline'}>
          <Text
            fontSize={'35px'}
            fontWeight={'860'}
            lineHeight={'36px'}
          >
            <AnimationNumber value={total} />
          </Text>
          <Text
            fontSize={'20px'}
            fontWeight={'860'}
            lineHeight={'36px'}
          >
            USD
          </Text>
        </HStack>
      </VStack>
      <HStack
        w={'100%'}
        spacing={'24px'}
        justify={'end'}
      >
        <Button w={'200px'} h={'45px'} background={'#493C3C'} rounded={'25px'}>
          <Text
            fontSize={'13px'}
            fontWeight={'860'}
            lineHeight={'15px'}
            onClick = {() => OpenDepositModal(state, dispatch, "usdc")}      
          >
            Deposit
          </Text>
        </Button>
        <Button 
          w={'200px'} 
          h={'45px'} 
          background={'#212121'} 
          border={'solid 1px'}
          borderColor={'#CEBFBF'} 
          rounded={'25px'}
          onClick = {() => OpenWithdrawModal(state, dispatch, "usdc")}
        >
          <Text
            fontSize={'13px'}
            fontWeight={'860'}
            lineHeight={'15px'}              
          >
            Withdraw
          </Text>
        </Button>
      </HStack>
    </VStack>

  );
}
export default Total;