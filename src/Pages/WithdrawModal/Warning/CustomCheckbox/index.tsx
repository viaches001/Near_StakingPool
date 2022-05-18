import React, { FunctionComponent, useState } from 'react';
import { Stack, VStack, Flex, HStack, Button, Text, Divider, Image, Checkbox } from '@chakra-ui/react'
import { SetStateAction, Dispatch } from 'react';
import {MdOutlineCheck} from 'react-icons/md'

interface Props{
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
}
const CustomCheckbox: FunctionComponent<Props> = ({checked, setChecked}) => {

  return (
    <Flex 
      w={'20px'} 
      h={'20px'} 
      bg={'#493C3C'}
      rounded={'5px'}
      justify={'center'}
      align={'center'}
      cursor={'pointer'}
      onClick = {() => setChecked(!checked)}
    >
      {checked &&
        <MdOutlineCheck color={'#F9D85E'}/>
      }
    </Flex>
  );
}
export default CustomCheckbox;

