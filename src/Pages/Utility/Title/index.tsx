import React, { FunctionComponent } from 'react';
import { HStack, Flex, Text, Image, Link } from '@chakra-ui/react'

import ExternalLink from "./../../../assets/ExternalLink.svg"

const Title: FunctionComponent = (props) => {
  return (
    <Flex ml={'13px'} w={'100%'} justify={'left'}  align={'flex-end'}>
      <Text
        fontSize={'40px'}
        fontWeight={'860'}
      >
        UTILITY +
      </Text>
      <Link href={'https://www.wefund.app'}>
        <HStack spacing={'3px'}  pb={'10px'}>
          <Text ml='13px'>
            Docs
          </Text>
          <Image src={ExternalLink} w={'10px'}/>
          </HStack>
      </Link>
      
    </Flex>
  );
}
export default Title;