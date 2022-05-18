import React, { FunctionComponent } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Link, Center, Divider, Button } from '@chakra-ui/react'

import { OpenDepositModal, useStore } from '../../../store';
import CurrentPrice from './Current';
import ProjectedPrice from './Projected';

const Price: FunctionComponent = (props) => {
  const { state, dispatch } = useStore();
  return (
    <VStack w={'100%'} align={'baseline'}>
      <Text
        fontSize={'20px'}
        fontWeight={'860'}
        lineHeight={'24px'}
      >
        COMMUNITY FARMING EVENT 🚜
      </Text>
      <Stack
        direction={{ sm: 'column', md: 'column', lg: 'row' }}
        w={'100%'}
        rounded={'25px'}
        background={'#212121'}
        align={'baseline'}
        p={{ sm: '10px', md: '20px', lg: '59px' }}
        spacing={'10px'}
      >
        <CurrentPrice />
        <ProjectedPrice />
      </Stack>
    </VStack>
  );
}
export default Price;