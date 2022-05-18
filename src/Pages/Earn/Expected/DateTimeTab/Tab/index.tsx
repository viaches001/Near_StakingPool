import React, { FunctionComponent } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Link, Center, Divider, Button } from '@chakra-ui/react'
import { Dispatch, SetStateAction } from "react";

interface Props{
  id: string
  current: string,
  setCurrent: Dispatch<SetStateAction<string>>,
}

const Tab: FunctionComponent<Props> = (props) => {
  return (
    <Flex 
      background={props.current==props.id?'#493C3C':'none'}
      rounded={'25px'}
      w={'25%'}
      h={'100%'}
      justify={'center'}
      align={'center'}
      cursor={'pointer'}
      onClick={() => {props.setCurrent(props.id)}}
    >
      <Text
        fontSize={'13px'}
        fontWeight={'860'}
        lineHeight={'16px'}
      >
        {props.children}
      </Text>
    </Flex>
  );
}
export default Tab;