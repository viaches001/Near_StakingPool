import React, { FunctionComponent } from 'react';
import { VStack, Stack, Flex } from '@chakra-ui/react'

import CircularView from './CircularView';
import {MdInfo, MdSwapHoriz} from 'react-icons/md'
import Total from './Total';
import Seperator from './Seperator';

const TotalValue: FunctionComponent = (props) => {
  return (
    <VStack
      w={{sm: '100%', md: '100%', lg:'696px'}}
      minW={{sm: '100%', md: '100%', lg:'696px'}}
      rounded={'25px'} 
      background={'#212121'} 
      align={'center'}
      spacing={'34px'}
      px={{sm:'10px', md:'20px', lg:'50px'}}
      py={{sm:'10px', md:'20px', lg:'60px'}}
    >
      <Total />
      <Flex 
        w={'100%'}
        direction={{sm: 'column', md:'column', lg:'row'}}
        align={'center'}
        justify={'space-between'}
      >
        <Seperator />
        <CircularView />
      </Flex>
    </VStack>
  );
}
export default TotalValue;