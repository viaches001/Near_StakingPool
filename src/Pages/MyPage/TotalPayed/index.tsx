import React, { FunctionComponent } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Link, Center, Tooltip, Button } from '@chakra-ui/react'
import Warning from "./../../../assets/Warning.svg"

import AnimationNumber from '../../Components/AnimationNumber';
import { OpenDepositModal, useStore, useExchangeRate } from '../../../store';
import { floorNormalize, floor } from '../../../Util';
import { coins } from '../../../constants';

const TotalPayed: FunctionComponent = (props) => {
  const { state, dispatch } = useStore();
  const exchangeRates = useExchangeRate();
  let rewards = 0;
  coins.forEach(coin => {
    const coinRewards = state.userInfoCoin[coin.name].reward_amount;
    rewards += floorNormalize(coinRewards * exchangeRates[coin.name]);
  })
  const usd = floor(rewards);

  let deposit_times = coins.map(coin => state.userInfoCoin[coin.name].deposit_time);

  const depositTime_max = Math.max(...deposit_times);
  const depositTime_min = Math.min(...deposit_times);
  const depositTime = depositTime_min === 0 ? depositTime_max : depositTime_min
  const period = depositTime > 0 ? Date.now() - depositTime * 1000 : 0;
  const day = Math.floor((period > 0 ? period : 0) / 1000 / 60 / 60 / 24);

  return (
    <Flex
      direction={'column'}
      w={'100%'}
      rounded={'25px'}
      background={'#212121'}
      align={'baseline'}
      px={{ sm: '10px', md: '20px', lg: '50px' }}
      py={{ sm: '10px', md: '20px', lg: '60px' }}
    >
      <Tooltip
        label="Total payed interest of your UST/Luna Deposits calculated in UST"
        background={'#C4C4C4'}
        color={'black'} hasArrow
        placement='top-start'
      >
        <Text
          fontSize={'20px'}
          fontWeight={'860'}
          lineHeight={'24px'}
        >
          TOTAL PAYED INTEREST
        </Text>
      </Tooltip>
      <HStack mt={'6px'} spacing={'10px'} align={'baseline'}>
        <Text
          fontSize={'35px'}
          fontWeight={'860'}
          lineHeight={'36px'}
        >
          {rewards == 0? '000,000.00': <AnimationNumber value={rewards}/>}
        </Text>
        <Text
          fontSize={'20px'}
          fontWeight={'860'}
          lineHeight={'36px'}
        >
          USD
        </Text>
      </HStack>
      <Text
        fontSize={'14px'}
        fontWeight={'400'}
        lineHeight={'36px'}
        fontStyle={'italic'}
      >
        USD ${usd == 0? '000,000.00': <AnimationNumber value={usd}/>}
      </Text>
      <HStack mt={'31px'} spacing={'20px'} align={'baseline'}>
        <Text
          fontSize={'20px'}
          fontWeight={'860'}
          lineHeight={'24px'}
        >
          TOTAL DAYS STAKED
        </Text>
        <Tooltip
          label="Total days staked with no withdraw"
          background={'#C4C4C4'} hasArrow
          placement='top-start'
          color={'black'}
        >
          <Image src={Warning} w={'13px'} />
        </Tooltip>
      </HStack>
      <HStack mt={'10px'} spacing={'10px'} align={'baseline'}>
        <Text
          fontSize={'35px'}
          fontWeight={'860'}
          lineHeight={'36px'}
        >
          {day == 0? '000': <AnimationNumber value={day}/>}
        </Text>
        <Text
          fontSize={'20px'}
          fontWeight={'860'}
          lineHeight={'36px'}
        >
          DAYS
        </Text>
      </HStack>
      <Button
        w={'100%'}
        mt={'75px'}
        h={'45px'}
        background={'#493C3C'}
        rounded={'25px'}
        onClick={() => OpenDepositModal(state, dispatch, "usdc")}
      >
        <Text
          fontSize={'13px'}
          fontWeight={'860'}
          lineHeight={'15px'}
        >
          STAKE MORE
        </Text>
      </Button>
    </Flex>
  );
}
export default TotalPayed;