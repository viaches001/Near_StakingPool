import React, { FunctionComponent, useState } from 'react';
import { Stack, Flex, HStack, Button, Text, Divider } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Image,
  VStack,
  Grid,
  GridItem
} from '@chakra-ui/react'
import { toast } from 'react-toastify';
import InputPanel from './InputPanel';
import SliderWish from './SliderWish';
import Info from './Info';
import { useStore, useNearSelector, ActionKind } from '../../store';
import { estimateSend, fetchData, sleep } from '../../Util';
import { coins, POOL} from '../../constants';
import { utils } from "near-api-js";
import { useWalletSelector } from '../../context/NearWalletSelectorContext';

interface Props{
  isOpen: boolean,
  onClose: () => void,
}
const DepositModal: FunctionComponent<Props> = ({isOpen, onClose}) => {
  const [amount, setAmount] = useState('0');
  const {state, dispatch} = useStore();
  const coinType = state.coinType;
  const coin = coins.find(item => item.name == coinType);
  const nearSelector = useNearSelector();
  const { accountId } = useWalletSelector();

  const deposit = async () => {
    if(parseFloat(amount) <= 0  || !accountId)
      return;

    // let res = await estimateSend(nearSelector, 'ft_metadata', {}, 'voucher_usdc.testnet');
    // console.log(res)
      
    // let val = Math.floor(parseFloat(amount) * 10 ** 6);
    let val = String(amount);
    let args = {amount: val, receiver_id: POOL,  memo: "from User to Pool",  msg: JSON.stringify({
      usdc: 1000000,
      qualified: true,
      wallet: accountId
    }) }; 
    // let res = await estimateSend(nearSelector, 'ft_transfer', args, coin?.testnet_address);
    let res = await estimateSend(nearSelector, 'ft_transfer_call', { "amount": "1000000", "receiver_id": "staking_voucher_tokens.testnet",
    "msg": JSON.stringify({
      token_name: "usdc",
      qualified: true,
    }), }, "usdc.fakes.testnet");
    if(res){
      console.log(res);
    }
    
    // const methodName = 'try_deposit';
    // args = { token_name: "usdc", amount: String(val), qualified: true }

    // res = await estimateSend(nearSelector, methodName, args);
    // if(res){
    //   dispatch({type: ActionKind.setTxhash, payload: res});
    //   onClose();
    //   if(state.openWaitingModal)
    //     state.openWaitingModal();

    //   // let count = 10;
    //   // let height = 0;
    //   // while (count > 0) {
    //   //   await lcd.tx.txInfo(res)
    //   //     // eslint-disable-next-line no-loop-func
    //   //     .then((e) => {
    //   //       if (e.height > 0) {
    //   //         toast.dismiss();
    //   //         toast("Success", successOption);
    //   //         height = e.height;
    //   //       }
    //   //     })
    //   //     .catch((e) => {})

    //   //   if (height > 0) break;

    //   //   await sleep(1000);
    //   //   count--;
    //   // }
      
    //   if(state.closeWaitingModal)
    //     state.closeWaitingModal();

    //   fetchData(state, dispatch);
    // }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent 
        background={'#212121'}
        rounded={'25px'}
        w={{sm:'100%', md: '562px', lg:'562px'}}
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
              Deposit
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
          background={'#493C3C'} 
          rounded={'25px'}
          color={'#CEC0C0'}
          onClick={() => deposit()}
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
      </ModalContent>
    </Modal>
  );
}
export default DepositModal;

