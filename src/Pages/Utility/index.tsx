import React, { FunctionComponent, useMemo } from 'react';
import { Stack, VStack, Flex, Button } from '@chakra-ui/react'
import Title from './Title';
import Price from './Price';
import Farmed from './Farmed';
import Allocation from './Allocation';
import Earn from './Earn';
import Plus from './Plus';

const MyPage: FunctionComponent = (props) => {
  return (
    <VStack 
      mt={'15px'} 
      px={{sm:'10px', md:'20px', lg:'110px'}}
      w={'100%'}
      spacing={'56px'}
    >
      <Title />
      <Price />
      <Farmed />
      <Allocation />
      <Earn />
      <Plus />
    </VStack>
  );
}
export default MyPage;

