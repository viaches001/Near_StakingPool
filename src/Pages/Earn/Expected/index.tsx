import React, { FunctionComponent, useState } from 'react';
import { VStack, Stack, Text, Divider, HStack, Image, Flex, Tooltip } from '@chakra-ui/react'
import AnimationNumber from '../../Components/AnimationNumber';
import Warning from './../../../assets/Warning.svg'
import DateTimeTab from './DateTimeTab'

const Expected: FunctionComponent = (props) => {
  const [interest, setInterest] = useState(0);

  return (
    <Flex
      direction={'column'} 
      w={'100%'}
      rounded={'25px'} 
      background={'#212121'} 
      px={{sm:'10px', md:'20px', lg:'47px'}}
      py={{sm:'10px', md:'20px', lg:'55px'}}
    >
      <HStack spacing={'18px'} w={'100%'} align={'baseline'}>
        <Text
          fontSize={'20px'}
          fontWeight={'860'}
          lineHeight={'24px'}
        >
          EXPECTED INTEREST BASED ON YOUR DEPOSIT
        </Text>
        <Tooltip 
          label="Estimated interest based on your deposit for the selected period" 
          background={'#C4C4C4'} hasArrow 
          placement='top-start' 
          color={'black'}
        > 
          <Image src={Warning} w={'13px'}/>
        </Tooltip>
      </HStack>
      <HStack spacing={'18px'} w={'100%'} align={'baseline'}>
        <Text
          fontSize={'35px'}
          fontWeight={'860'}
          lineHeight={'36px'}
        >
          <AnimationNumber value={interest} />
        </Text>
        <Text
          fontSize={'20px'}
          fontWeight={'860'}
          lineHeight={'36px'}
        >
          USD
        </Text>
      </HStack>
      <DateTimeTab setInterest={setInterest}/>
    </Flex>
  );
}
export default Expected;