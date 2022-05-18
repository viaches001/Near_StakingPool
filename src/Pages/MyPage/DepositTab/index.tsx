import React, { FunctionComponent, useState } from 'react';
import { VStack, HStack} from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react';
import Tab from './Tab';

interface Props{
  depositTab: string,
  setDepositTab: Dispatch<SetStateAction<string>>,
}

const DepositTab: FunctionComponent<Props> = ({depositTab, setDepositTab}) => {

  return (
    <HStack 
      w={'100%'}
      rounded={'25px'} 
      background={'#212121'} 
      align={'center'}
      spacing={'-10px'}
      height={'52px'}
    >
      <Tab id='all' depositTab={depositTab} setDepositTab={setDepositTab}>ALL</Tab>
      <Tab id='ust' depositTab={depositTab} setDepositTab={setDepositTab}>STABLE</Tab>
      <Tab id='luna' depositTab={depositTab} setDepositTab={setDepositTab}>VOLATILE</Tab>
    </HStack>
  );
}
export default DepositTab;