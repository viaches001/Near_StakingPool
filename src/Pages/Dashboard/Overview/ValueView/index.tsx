import React, { FunctionComponent } from 'react';
import { HStack, VStack, Flex, Text, Image, Link, Tooltip } from '@chakra-ui/react'

import BlackPanel from '../../../../assets/BlackPanel.svg'
import YellowPanel from '../../../../assets/YellowPanel.svg'
import { useStore, useExchangeRate } from '../../../../store';
import AnimationNumber from '../../../Components/AnimationNumber';
import { floor, floorNormalize } from '../../../../Util';
import { coins } from '../../../../constants';

const ValueView: FunctionComponent = (props) => {
  const { state, dispatch } = useStore();
  const history = state.amountHistory;
  const last = history.length - 1;

  let stableAmount = 0;
  let volatileAmount = 0;
  const rates = useExchangeRate();
  
  coins.forEach(coin => {
    const rate = rates[coin.name];
    const amount = (last >= 0 ? floor(history[last][`${coin.name}_amount`] * rate) : 0)+
      + floorNormalize(state.coin_total_rewards[coin.name] * rate);
    if(coin.stable) {
      stableAmount += (amount || 0);
    }
    else volatileAmount += amount;
  })

  return (
    <VStack mt='28px' spacing={'26px'}  alignItems={'baseline'}>
      <VStack alignItems={'baseline'}>
        <HStack spacing={'10px'} alignItems={'center'}>
          <Image src={YellowPanel} w={'15px'} />
          <Tooltip 
            label="Total deposited Stable & compounded interest Calculated in USD" 
            background={'#C4C4C4'} 
            color={'black'} hasArrow 
            placement='top-start'
          > 
            <Text
              fontSize={'19px'}
              fontWeight={'800'}
              lineHeight={'24px'}
            >
              {/* STABLE */}
              STABLE COINS
            </Text>
          </Tooltip>
        </HStack>
        <Text
          fontSize={'14px'}
          fontWeight={'400'}
          lineHeight={'15px'}
          fontStyle={'italic'}
        >
          $&nbsp;<AnimationNumber value={stableAmount} />
        </Text>
      </VStack>
      <VStack alignItems={'baseline'}>
        <HStack spacing={'10px'} alignItems={'center'}>
          <Image src={BlackPanel} w={'15px'} />
          <Tooltip 
            label="Total deposited Volatile & compounded interest Calculated in USD" 
            background={'#C4C4C4'} hasArrow 
            placement='top-start' 
            color={'black'}
          > 
            <Text
              fontSize={'19px'}
              fontWeight={'800'}
              lineHeight={'24px'}
            >
              {/* VOLATILE */}
              VOLATILE COINS
            </Text>
          </Tooltip>
        </HStack>
        <Text
          fontSize={'14px'}
          fontWeight={'400'}
          lineHeight={'15px'}
          fontStyle={'italic'}
        >
          $&nbsp;<AnimationNumber value={volatileAmount} />
        </Text>
      </VStack>
    </VStack>
  );
}
export default ValueView;