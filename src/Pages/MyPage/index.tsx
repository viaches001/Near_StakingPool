import React, { FunctionComponent, useMemo, useState } from 'react';
import { Stack, VStack, Flex, Button, Grid, GridItem } from '@chakra-ui/react'

import Title from './Title'
import TotalValue from './TotalValue';
import TotalPayed from './TotalPayed';
import DepositTab from './DepositTab';
import DepositPanel from './DepositPanel';
import TransactionHistory from './TransactionHistory';
import { coins } from '../../constants';

const MyPage: FunctionComponent = (props) => {
  const [depositTab, setDepositTab] = useState('all');

  return (
    <VStack 
      mt={'15px'} 
      px={{sm:'10px', md:'20px', lg:'110px'}}
      w={'100%'}
      spacing={'53px'}
    >
      <Title />
      <Stack 
        mt={'53px'} 
        direction={{sm: 'column', md:'column', lg:'row'}}
        spacing={'55px'}
        w={'100%'}
      >
        <TotalValue />
        <TotalPayed />
      </Stack>
      <DepositTab depositTab={depositTab} setDepositTab={setDepositTab}/>
      <Grid
        templateColumns={{sm: 'repeat(1, 1fr)' , md:'repeat(1, 1fr)' , lg:'repeat(2, 1fr)' }}
        gap={6}
        w={'100%'}
      >
        {coins.filter(coin => {
          if((depositTab === 'all' || depositTab === 'stable') && (coin.stable)) {
            return true;
          }

          if((depositTab === 'all' || depositTab === 'volatile') && (!coin.stable)) {
            return true;
          }
        })
        .map(coin => <GridItem key={coin.blockchain}>
          <DepositPanel coin={coin}/>
        </GridItem>)}
      </Grid>
      <TransactionHistory />
    </VStack>
  );
}
export default MyPage;

