import React, { FunctionComponent, useEffect } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Link, Center, Divider, Tooltip } from '@chakra-ui/react'
import Warning from "./../../../../assets/Warning.svg"

import BlackPanel from './../../../../assets/BlackPanel.svg'
import YellowPanel from './../../../../assets/YellowPanel.svg'
import PinkPanel from './../../../../assets/PinkPanel.svg'
import BluePanel from './../../../../assets/BluePanel.svg'
import AnimationNumber from '../../../Components/AnimationNumber';
import { useCoinDeposited, useStore, useExchangeRate } from '../../../../store';
import { floor, floorNormalize } from '../../../../Util';
import { coins } from '../../../../constants';

const Seperator: FunctionComponent = (props) => {
  const {state, dispatch} = useStore();
  const rates = useExchangeRate();
  const coinDeposited = useCoinDeposited();

  let stableDeposited = 0;
  let volatileDeposited = 0;
  coins.forEach(coin => {
    const rate = rates[coin.name];
    const amount = floor(coinDeposited[coin.name] * rates[coin.name]) + floorNormalize(state.userInfoCoin[coin.name].reward_amount * rate);
    if(coin.stable) {
      stableDeposited += amount;
    }
    else volatileDeposited += amount;
  })
  const totalDeposited = stableDeposited + volatileDeposited;

  return (
    <VStack align={'baseline'} w={'240px'} spacing={'4px'}>
      {/* --------------------------------- */}
      <HStack spacing={'10px'}>
        <Image src={PinkPanel} w={'15px'} />
        <Text
          fontSize={'18px'}
          fontWeight={'860'}
          lineHeight={'24px'}
        >
          Total Balance
        </Text>
        <Tooltip 
          label="Total of all UST/Luna deposits, including earnings " 
          background={'#C4C4C4'} 
          color={'black'} hasArrow 
          placement='top-start'
        > 
          <Image src={Warning}/>
        </Tooltip>
      </HStack>
      <Text
        fontSize={'14px'}
        fontWeight={'400'}
        fontStyle={'italic'}
      >
        $&nbsp; {totalDeposited == 0? '000,000.00': <AnimationNumber value={totalDeposited}/>}
      </Text>
      {/* --------------------------------- */}
      <HStack spacing={'10px'}>
        <Image src={BlackPanel} w={'15px'} />
        <Text
          fontSize={'18px'}
          fontWeight={'860'}
          lineHeight={'24px'}
        >
          Stable Balance 
        </Text>
        <Tooltip 
          label="Your total UST deposit including earnings" 
          background={'#C4C4C4'} 
          color={'black'} hasArrow 
          placement='top-start'
        > 
          <Image src={Warning}/>
        </Tooltip>
      </HStack>
      <Text
        fontSize={'14px'}
        fontWeight={'400'}
        fontStyle={'italic'}
      >
        $&nbsp;{stableDeposited == 0? '000,000.00': <AnimationNumber value={stableDeposited}/>}
      </Text>
      {/* --------------------------------- */}
      <HStack spacing={'10px'}>
        <Image src={YellowPanel} w={'15px'} />
        <Text
          fontSize={'18px'}
          fontWeight={'860'}
          lineHeight={'24px'}
        >
           Volatile Asset Balance
        </Text>
        <Tooltip 
          label="Your total UST deposit \n including earnings" 
          background={'#C4C4C4'} 
          color={'black'} hasArrow 
          placement='top-start'
        > 
          <Image src={Warning}/>
        </Tooltip>
      </HStack>
      <Text
        fontSize={'14px'}
        fontWeight={'400'}
        fontStyle={'italic'}
      >
        $&nbsp;{volatileDeposited == 0? '000,000.00': <AnimationNumber value={volatileDeposited}/>}
      </Text>
    </VStack>
  );
}
export default Seperator;