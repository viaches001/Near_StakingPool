import React, { FunctionComponent, useState } from 'react';
import MarkdownIt from "markdown-it";
import './terms.css';
import { VStack, HStack, Stack, Flex, Text, Image, Link, Center, Tooltip, Button } from '@chakra-ui/react'

const Terms: FunctionComponent = (props) => {
  const [content, setContent] = useState<String>('');
  const md = new MarkdownIt();

  React.useEffect(() => {
    fetch('/terms.txt').then(response => {
      return response.text().then(function(text) {
        setContent(text);
      });
    })
  })

  return (
    <Flex
      direction={'column'}
      px={{ sm: '10px', md:'20px', lg: '109px' }}
      // mr={{sm:'10px', md:'20px', lg:'110px'}}
      mt={'50px'}
      mb={'50px'}
      w={'100%'}
      justify={'space-between'}
      align={'center'}
    >
      <VStack align={'baseline'} w={'100%'}>
        <Text
          fontSize={'40px'}
          fontWeight={'800'}
        >
          Terms of Service
        </Text>
        <Text
          fontSize={'20px'}
          fontWeight={'800'}
        >
          Updated: 14 Apr 21
        </Text>
      </VStack>
      <HStack 
        mt={'53px'}
        w={'100%'}
        rounded={'25px'} 
        background={'#212121'} 
        align={'center'}
        spacing={'34px'}
        px={{sm:'10px', md:'20px', lg:'50px'}}
        py={{sm:'10px', md:'20px', lg:'60px'}}
      >
        <div className={'content'} dangerouslySetInnerHTML={{ __html: md.render(content as string) }}>
        </div>
      </HStack>
    </Flex>
  );
}
export default Terms;