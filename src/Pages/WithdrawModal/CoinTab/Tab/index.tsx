import React, { FunctionComponent } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Link, Center, Divider, Button } from '@chakra-ui/react'
import {COINTYPE, useStore, ActionKind} from '../../../../store'

interface Props {
  id: COINTYPE,
}
const Tab: FunctionComponent<Props> = (props) => {
  const {state, dispatch} = useStore();
  const selected = state.coinType === props.id;

  return (
    <Flex
      background={ selected ? '#CEBFBF' : 'none'}
      rounded={'10px'}
      w={'93px'}
      h={'100%'}
      justify={'center'}
      align={'center'}
      cursor={'pointer'}
      onClick={() => { dispatch({type: ActionKind.setCoinType, payload: props.id}) }}
    >
      <Text
        fontSize={'13px'}
        fontWeight={'860'}
        lineHeight={'16px'}
        color={selected? '#493C3C' : '#CEBFBF'}
      >
        {props.children}
      </Text>
    </Flex>
  );
}
export default Tab;