import React, { FunctionComponent, useState } from 'react';
import { Stack, Flex, HStack, Button, Text, Divider, Spinner } from '@chakra-ui/react'
import { Deposit, MsgExecuteContract, WasmAPI, Coin } from '@terra-money/terra.js'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import ReactLoading from 'react-loading';

import { shortenAddress } from '../../Util';
import { useStore } from '../../store';

interface Props {
  isOpen: boolean,
  onClose: () => void,
}
const WaitingModal: FunctionComponent<Props> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useStore();
  const txhash = state.txhash;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        background={'#212121'}
        rounded={'25px'}
        w={{ sm: '80%', md: '562px', lg: '562px' }}
        minW={{ sm: '80%', md: '562px', lg: '562px' }}
        h={'453px'}
        px={{ sm: '10px', md: '47px', lg: '47px' }}
        py={'39px'}
        alignItems={'center'}
      >
        <ReactLoading type={'bars'} color={'#F9D85E'} height={200} width={200} />
        <Text
          mt={'30px'}
          fontSize={'24px'}
          fontWeight={'400'}
          lineHeight={'28px'}
          color={'white'}
        >
          Waiting for Near Wallet ...
        </Text>
        <Text
          mt={'20px'}
          fontSize={'11px'}
          fontWeight={'400'}
          lineHeight={'13px'}
          color={'#CEC0C0'}
        >
          Transaction broadcasted. There is no need to send another until it has been completed.
        </Text>
        <Divider mt={'23px'} orientation='horizontal' variant={'dashed'} color={'#CEC0C0'} />
        <HStack mt={'23px'} w={'100%'} justify={'space-between'}>
          <Text
            fontSize={'13px'}
            fontWeight={'400'}
            lineHeight={'14px'}
            color={'#CEC0C0'}
          >
            Tx Hash
          </Text>
          <Text
            fontSize={'13px'}
            fontWeight={'400'}
            lineHeight={'14px'}
            color={'#CEC0C0'}
          >
            {shortenAddress(txhash)}
          </Text>
        </HStack>
        <ModalCloseButton color={'#CEBFBF'} />
      </ModalContent>
    </Modal>
  );
}
export default WaitingModal;

