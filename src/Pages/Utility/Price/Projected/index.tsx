import React, { FunctionComponent } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Link, Center, Tooltip, Button } from '@chakra-ui/react'
import AnimationNumber from '../../../Components/AnimationNumber';
import Warning from '../../../../assets/Warning.svg'

const ProjectedPrice: FunctionComponent = (props) => {
  return (
    <Flex w={'100%'} direction="column">
      <HStack>
        <Text
          fontSize={'20px'}
          fontWeight={'860'}
          lineHeight={'24px'}
        >
          PROJECTED NearT PRICE 
        </Text>
        <Tooltip 
          label="Projected at the public sale" 
          background={'#C4C4C4'} hasArrow 
          placement='top-start' 
          color={'black'}
        > 
          <Image src={Warning} w={'13px'}/>
        </Tooltip>
      </HStack>
      <HStack w={'100%'} align={'baseline'}>
        <Text
          fontSize={'35px'}
          fontWeight={'860'}
          lineHeight={'36px'}
        >
          <AnimationNumber value={1.25} />
        </Text>
        <Text
          fontSize={'25px'}
          fontWeight={'860'}
          lineHeight={'36px'}
        >
          USD
        </Text>
      </HStack>
    </Flex>
  );
}
export default ProjectedPrice;