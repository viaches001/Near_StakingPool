import React, { FunctionComponent, useState } from 'react';
import { VStack, HStack, Flex} from '@chakra-ui/react'
import { Dispatch, SetStateAction } from "react";

import Tab from './Tab';
import {COINTYPE} from '../../../store'

interface Props {
}

const CoinTab: FunctionComponent<Props> = (props) => {

  return (
    <Flex
      direction="row" 
      rounded={'10px'} 
      background={'#493C3C'} 
      align={'center'}
      height={'29px'}
    >

    </Flex>
  );
}
export default CoinTab;