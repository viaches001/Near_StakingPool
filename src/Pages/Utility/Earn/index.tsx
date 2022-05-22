import React, { FunctionComponent, useState } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Link, Center, Divider, Button } from '@chakra-ui/react'

// import { OpenDepositModal, useStore } from '../../../store';
import HowMuch from './HowMuch';
import Deposited from './Deposited';
import { MdCached } from 'react-icons/md';
import Expected from './Expected';

const Earn: FunctionComponent = (props) => {
  // const { state, dispatch } = useStore();
  const [amount, setAmount] = useState('10000');
  return (
    <Stack
      direction={{ sm: 'column', md: 'column', lg: 'row' }}
      w={'100%'}
      rounded={'25px'}
      background={'#212121'}
      align={'center'}
      px={{ sm: '10px', md: '20px', lg: '59px' }}
      py={{ sm: '25px', md: '20px', lg: '59px' }}
      spacing={{sm:'10px', md: '20px', lg:'55px'}}
    >
      <HowMuch />
      <Deposited amount={amount} setAmount={setAmount}/>
      <Flex w={'18px'} >
        <MdCached size={18}/>
      </Flex>
      <Expected amount={amount}/>
    </Stack>
  );
}
export default Earn;