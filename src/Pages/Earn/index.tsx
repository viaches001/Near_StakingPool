import React, { FunctionComponent } from 'react';
import { Stack, VStack, HStack, Flex, Button, Grid, GridItem } from '@chakra-ui/react'

import Title from './Title'
import Total from './Total';
import DepositPanel from './DepositPanel';
import Expected from './Expected';
import { coins } from '../../constants';

const MyPage: FunctionComponent = (props) => {
 
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
        templateColumns={{sm: 'repeat(1, 1fr)' , md:'repeat(1, 1fr)' , lg:'repeat(2, 1fr)' }}
        gap={6}
        w={'100%'}
      >
        {coins.map(coin => <GridItem key={coin.blockchain}>
          <DepositPanel coin={coin}/>
        </GridItem>)}
      </Grid>
      <Expected />
    </VStack>
  );
}
export default MyPage;