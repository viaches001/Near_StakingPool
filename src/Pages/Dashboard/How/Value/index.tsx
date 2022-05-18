import React, { useState, FunctionComponent } from 'react';
import { HStack, VStack, Flex, Text, Image } from '@chakra-ui/react'

import AnimationNumber from '../../../Components/AnimationNumber';
import BlackPanel from './../../../../assets/BlackPanel.svg'
import YellowPanel from './../../../../assets/YellowPanel.svg'

interface Props{
  interest: number,
  total: number
}
const Value: FunctionComponent<Props> = ({total, interest}) => {

  return (
    <VStack mt={'55px'} align={'baseline'} minW={'220px'} w={'220px'}>
      <Text
        fontSize={'35px'}
        fontWeight={'860'}
        lineHeight={'36px'}
      >
        $<AnimationNumber value={interest} />
      </Text>
      <Text
        fontSize={'9px'}
        fontWeight={'860'}
        lineHeight={'10px'}
      >
        Interest Earned
      </Text>
      <Text
        fontSize={'35px'}
        fontWeight={'860'}
        lineHeight={'36px'}
        pt={'17px'}
      >
        $<AnimationNumber value={total} />
      </Text>
      <Text
        fontSize={'9px'}
        fontWeight={'860'}
        lineHeight={'10px'}
      >
        Total
      </Text>
      <HStack spacing={'4px'} pt={'26px'}>
        <Image src={YellowPanel} w={'10px'} />
        <Text
          fontSize={'9px'}
          fontWeight={'860'}
          lineHeight={'10px'}
        >
          NT Performance
        </Text>
      </HStack>
      <HStack spacing={'4px'}>
        <Image src={BlackPanel} w={'10px'} />
        <Text
          fontSize={'9px'}
          fontWeight={'860'}
          lineHeight={'10px'}
        >
          Traditional Market
        </Text>
      </HStack>
    </VStack>
  );
}
export default Value;