import React, { FunctionComponent } from 'react';
import { Stack, VStack, HStack, Flex, Button, Grid, GridItem } from '@chakra-ui/react'

import Title from './Title'
import Total from './Total';
import DepositPanel from './DepositPanel';
import Expected from './Expected';

const MyPage: FunctionComponent = (props) => {
  const data = [
    {
      img: 'img/usdc.png',
      name: 'USDC',
      currency: 'usd',
      blockchain: 'USD Coin',
      apy: '14.87',
      balance: 0,
      available: true
    },
    {
      img: 'img/eth.png',
      name: 'ETH',
      currency: 'ETH',
      blockchain: 'Ethereum',
      apy: '14.87',
      balance: 0,
      available: true
    },
    {
      img: 'img/dai.png',
      name: 'DAI',
      currency: 'usd',
      blockchain: 'Dai',
      apy: '14.87',
      balance: 0,
      available: true
    },
    {
      img: 'img/wbtc.png',
      name: 'wBTC',
      currency: 'wBTC',
      blockchain: 'Wrapped Bitcoin',
      apy: '14.87',
      balance: 0,
      available: true
    },
    {
      img: 'img/usdt.png',
      name: 'USDT',
      currency: 'usd',
      blockchain: 'USD Tether',
      apy: '14.87',
      balance: 0,
      available: true
    },
    {
      img: 'img/NEARt.png',
      name: 'NEARt',
      currency: 'NEARt',
      blockchain: 'NEARt Treasury(Coming Soon)',
      apy: '14.87',
      balance: 0,
      available: false
    },
  ]
  
  return (
    <VStack 
      mt={'15px'} 
      px={{sm:'10px', md:'20px', lg:'110px'}}
      w={'100%'}
      spacing={'53px'}
    >
      <Title />
      <Total />
      <Grid
        templateColumns='repeat(2, 1fr)' gap={6}
        w={'100%'}
      >
        {data.map(row => <GridItem key={row.blockchain}>
          <DepositPanel data={row}/>
        </GridItem>)}
      </Grid>
      <Expected />
    </VStack>
  );
}
export default MyPage;