import React, { FunctionComponent, useState } from 'react';
import { Stack, Flex, HStack, Button, Text, Divider } from '@chakra-ui/react'
import { Deposit, MsgExecuteContract, WasmAPI, Coin } from '@terra-money/terra.js'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  Image,
  VStack,
  Grid,
  GridItem
} from '@chakra-ui/react'

import InputPanel from './InputPanel';
import SliderWish from './SliderWish';
import Info from './Info';
import WarningModal from './Warning';
import { coins } from '../../constants';
import { useStore } from '../../store';

interface Props{
  isOpen: boolean,
  onClose: () => void
}
const WithdrawModal: FunctionComponent<Props> = ({isOpen, onClose}) => {
  const [amount, setAmount] = useState('0');
  const { isOpen: isOpenWarning, onOpen: onOpenWarning, onClose: onCloseWarning } = useDisclosure();
  const {state, dispatch} = useStore();
  const coinType = state.coinType;
  const coin = coins.find(item => item.name == coinType);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent 
        background={'#212121'}
        rounded={'25px'}
        w={{sm:'80%', md: '562px', lg:'562px'}}
        minW={{sm:'80%', md: '562px', lg:'562px'}}
        h={'512px'}
        px={{sm:'10px', md: '47px', lg: '47px'}}
        py={'39px'}
      >
        <Grid
          templateColumns="45% 50%"
          gap={3}
          w={'100%'}
          flexDirection={'row'}
        >
           <GridItem w={'100%'} h={'20px'} mt={'20px'} textAlign={'right'}>
            <Text
              fontSize={'20px'}
              fontWeight={'860'}
              lineHeight={'24px'}
              color={'white'}
            >
              Withdraw
            </Text>
           </GridItem>
           <GridItem w={'100%'} h={'60px'}>
            <HStack
                w={'100%'}
                h={'100%'}
                align={'center'}
                justify={'left'}
                display={'flex'}
              >
                <Image 
                  borderRadius='full'
                  boxSize='36px'
                  src={coin?.img}
                  alt='Dan Abramov'
                  mt={'10px'}
                />
                <VStack align={'baseline'} spacing={'0px'}>
                  <Text
                    fontSize={'20px'}
                    fontWeight={'800'}
                    lineHeight={'36px'}
                    color={'white'}
                  >
                    {coin?.currency}
                  </Text>
                  <Text
                    fontSize={'13px'}
                    fontWeight={'400'}
                    lineHeight={'15.6px'}
                    color={'white'}
                  >
                    {coin?.blockchain}
                  </Text>
                </VStack>
              </HStack>
           </GridItem>
        </Grid>
        <InputPanel amount={amount} setAmount={setAmount} coin={coin}/>
        <SliderWish amount={amount} setAmount={setAmount}/>
        <Divider mt={'23px'} orientation='horizontal' variant={'dashed'} color={'#CEC0C0'} />
        <Info amount={amount} coin={coin}/>
        <Divider mt={'23px'} orientation='horizontal' variant={'dashed'} color={'#CEC0C0'} />
        <Button 
          w={'100%'} 
          h={'45px'} 
          mt={'26px'} 
          color={'#CEC0C0'}
          background={'#493C3C'} 
          rounded={'25px'}
          onClick={() => {
            if(parseFloat(amount) > 0){
                onOpenWarning()
            }
          }}
        >
          <Text
            fontSize={'13px'}
            fontWeight={'860'}
            lineHeight={'15px'}
          >
            Proceed
          </Text>
        </Button>
        <ModalCloseButton color={'#CEBFBF'} />
        <WarningModal onClose={onCloseWarning} isOpen={isOpenWarning} onCloseParent = {onClose} amount={amount}/>
      </ModalContent>
    </Modal>
  );
}
export default WithdrawModal;

