import React, { FunctionComponent } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Link, Center, Tooltip, Button } from '@chakra-ui/react'

import { MdSwapHoriz } from 'react-icons/md'
import { useUSTBalance, useUSTDeposited, useLUNADeposited, useStore, useExchangeRate } from '../../../../store';
import Warning from "./../../../../assets/Warning.svg"
import AnimationNumber from '../../../Components/AnimationNumber';
import { useNavigate } from 'react-router-dom';
import { floorNormalize, floor } from '../../../../Util';

const Total: FunctionComponent = (props) => {
  const { state, dispatch } = useStore();
  const ustBalance = useUSTBalance();
  const rate = useExchangeRate();

  const ustDeposited = useUSTDeposited() + floorNormalize(state.userInfoUst.reward_amount);
  const lunaDeposited = useLUNADeposited() * rate + floorNormalize(state.userInfoLuna.reward_amount * rate);
  const total = ustBalance + ustDeposited + lunaDeposited;

  return (
    <HStack justify={"space-between"} w={'100%'} align={'baseline'}>
      <VStack align={'baseline'} w={'100%'}>
        <HStack align={'baseline'} w={'100%'}>
          <Text
            fontSize={'20px'}
            fontWeight={'860'}
            lineHeight={'24px'}
          >
            TOTAL VALUE
          </Text>
          <Tooltip
            label="Total value of UST/Luna deposits, payed interest, and UST Wallet Balance"
            background={'#C4C4C4'}
            color={'black'} hasArrow
            placement='top-start'
          >
            <Image src={Warning} w={13} />
          </Tooltip>
        </HStack>
        <HStack align={'baseline'} w={'100%'}>
          <Text
            fontSize={'35px'}
            fontWeight={'860'}
            lineHeight={'36px'}
          >
            {total == 0? '000,000.00': <AnimationNumber value={total}/>}
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
      <a href="https://app.terraswap.io/swap?to=&type=swap&from=uluna" target={'_blank'} rel="noreferrer">
        <Button w={'92px'} h={'25px'} background={'none'} rounded={'25px'} borderColor={'white'} variant='outline'>
          <MdSwapHoriz />
          <Text
            fontSize={'9px'}
            fontWeight={'860'}
            lineHeight={'10px'}
          >
            Swap
          </Text>
        </Button>
      </a>
    </HStack>
  );
}
export default Total;