import React, { FunctionComponent } from 'react';
import { VStack, HStack, Stack, Box, Flex, Text, SliderMark } from '@chakra-ui/react'

interface Props{
  value: number
}
const Indicator: FunctionComponent<Props> = (props) => {
  return (
    <SliderMark 
      value={props.value} 
      mt='-35px' 
      h='35px' 
      border='solid #CEC0C0'          
      borderWidth='0 0 0 1px' 
    >
      <Text
        fontSize='8px' 
        color='#CEC0C0'
        position={'relative'}
        left={'-20px'}
      >
      {props.value}%
      </Text>
    </SliderMark>
  );
}
export default Indicator;