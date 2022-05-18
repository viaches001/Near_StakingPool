import React, { FunctionComponent } from 'react';
import { Stack, VStack, Flex, Button } from '@chakra-ui/react'

import Title from './Title'
import Overview from './Overview';
import How from './How';
import TVL from './TVL';
import CoinTable from './CoinTable';

const Dashboard: FunctionComponent = (props) => {
  return (
    <VStack 
      mt={'15px'} 
      px={{sm:'10px', md:'20px', lg:'110px'}}
      w={'100%'}
      spacing={'53px'}
    >
      <Title />
      <Overview/>
      <CoinTable />
      <How />
      <TVL />
    </VStack>
  );
}
export default Dashboard;