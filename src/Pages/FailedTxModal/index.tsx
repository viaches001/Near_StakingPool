import React, { FunctionComponent, useState } from 'react';
import { Stack, Flex, HStack, Button, Text, Divider, Image } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import ReactLoading from 'react-loading';
import { nearWalletIcon } from '../../context/icons';
import { shortenAddress } from '../../Util';
import { useStore } from '../../store';
import { MdClose } from 'react-icons/md';

interface Props {
  isOpen: boolean,
  onClose: () => void,
}

const FailedTxModal: FunctionComponent<Props> = ({ isOpen, onClose }) => {
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
        {/* <ReactLoading type={'bars'} color={'#F9D85E'} height={200} width={200} /> */}
        <Image as={MdClose} height={'100px'} width={'100px'} color={'red'} fontWeight={'1200'}></Image>
        <Text
          mt={'30px'}
          fontSize={'24px'}
          fontWeight={'400'}
          lineHeight={'28px'}
          color={'white'}
        >
          Transaction failed...
        </Text>
        <Text
          mt={'20px'}
          fontSize={'11px'}
          fontWeight={'400'}
          lineHeight={'13px'}
          color={'#CEC0C0'}
          w={'100%'}
          alignItems={'left'}
        >
          Transaction failed.
        </Text>
        <Text
          mt={'20px'}
          fontSize={'11px'}
          fontWeight={'400'}
          lineHeight={'13px'}
          color={'#CEC0C0'}
          w={'100%'}
          alignItems={'left'}
        >
          The transaction requested has failed due to the following reason: 
        </Text>
        <Text
          mt={'20px'}
          fontSize={'11px'}
          fontWeight={'400'}
          lineHeight={'13px'}
          color={'#CEC0C0'}
          w={'100%'}
          alignItems={'left'}
        >
          ......
        </Text>
        <Text
          mt={'20px'}
          fontSize={'11px'}
          fontWeight={'400'}
          lineHeight={'13px'}
          color={'#CEC0C0'}
          w={'100%'}
          alignItems={'left'}
        >
          For assistance, please report your Tx hash to the official Near Treasury Telegram Support Channel: https://t.me/neartreasury
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
export default FailedTxModal;

