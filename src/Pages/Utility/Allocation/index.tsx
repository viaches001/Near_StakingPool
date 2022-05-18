import React, { FunctionComponent } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Link, Center, Divider, Button } from '@chakra-ui/react'

import { OpenDepositModal, useStore } from '../../../store';
import YourAllocation from './YourAllocation';
import Projected from './Projected';

const Allocation: FunctionComponent = (props) => {
  const { state, dispatch } = useStore();
  return (
    <Stack
      direction={{ sm: 'column', md: 'column', lg: 'row' }}
      w={'100%'}
      rounded={'25px'}
      background={'#212121'}
      align={'baseline'}
      p={{ sm: '10px', md: '20px', lg: '59px' }}
      spacing={'10px'}
    >
      <YourAllocation />
      <Projected />
    </Stack>
  );
}
export default Allocation;