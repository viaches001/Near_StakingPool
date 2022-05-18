import React, { FunctionComponent } from 'react';
import { HStack, Stack, Flex, Text, Image, Link, Center, Divider } from '@chakra-ui/react'

import TotalLocked from './TotalLocked';
import CircularView from './CircularView';
import ValueView from './ValueView';
import LockedChart from './LockedChart';

const Overview: FunctionComponent = (props) => {
  return (
    <Stack 
      direction={{sm:'column', md:'row', lg:'row'}}
      mt={'53px'} 
      w={'100%'}
      rounded={'25px'} 
      background={'#212121'} 
      align={'center'}
      spacing={'50px'}
      px={{sm:'10px', md:'20px', lg:'50px'}}
      py={{sm:'10px', md:'20px', lg:'60px'}}
    >
      <Flex 
        direction={'column'}
        minW={{sm:'100%', md: '100%', lg:'397px'}}
        w={{sm:'100%', md: '100%', lg:'397px'}}
      >
        <TotalLocked />
        <HStack mt={'53px'} spacing={'48px'} align={'center'}>
          <CircularView />
          <ValueView />
        </HStack>
      </Flex>
      <Center 
        height={'304px'}
        display={{sm:'none', md:'block', lg:'block'}}
      >
        <Divider orientation={'vertical'} />
      </Center>
      <Center 
        width={'100%'}
        display={{sm:'block', md:'none', lg:'none'}}
      >
        <Divider orientation={'horizontal'} />
      </Center>

      <LockedChart />
    </Stack>
  );
}
export default Overview;