import React, { FunctionComponent, useMemo, useState } from 'react';
import { Stack, VStack, Flex, Button, Grid, GridItem } from '@chakra-ui/react'

import { QueryClient, QueryClientProvider, useInfiniteQuery } from "react-query"
import { useLCD, useWallet, useTerraAPIURL, useStore, useNetworkName } from '../../store';

import Title from './Title'
import TotalValue from './TotalValue';
import TotalPayed from './TotalPayed';
import DepositTab from './DepositTab';
import DepositPanel from './DepositPanel';
import TransactionHistory from './TransactionHistory';

const MyPage: FunctionComponent = (props) => {
  const [depositTab, setDepositTab] = useState('all');
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
      {/* {(depositTab === 'all' || depositTab === 'luna') && 
        <LUNADepositPanel />
      } */}
      <Grid
        templateColumns='repeat(2, 1fr)' gap={6}
        w={'100%'}
      >
        {data.map(row => <GridItem key={row.blockchain}>
          <DepositPanel data={row}/>
        </GridItem>)}
      </Grid>
      <TransactionHistory />
    </VStack>
  );
}
export default MyPage;

